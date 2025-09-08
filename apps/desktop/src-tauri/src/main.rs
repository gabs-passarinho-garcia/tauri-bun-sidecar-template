#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use std::path::PathBuf;
use std::sync::{Arc, Mutex, LazyLock};
use regex::Regex;

// Global state to store the sidecar port
static SIDECAR_PORT: LazyLock<Arc<Mutex<Option<u16>>>> = LazyLock::new(|| Arc::new(Mutex::new(None)));

#[tauri::command]
fn get_sidecar_port() -> Option<u16> {
    *SIDECAR_PORT.lock().unwrap()
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![get_sidecar_port])
    .setup(|app| {
      // --- Início do código do Sidecar ---
      println!("[Tauri] Starting Bun sidecar...");
      
      let shell = app.shell();
      let command = shell
        .command("bun")
        .args(["dev"])
        .current_dir(PathBuf::from("../../../apps/server"));
      
      let (mut rx, child) = command
        .spawn()
        .expect("Failed to spawn sidecar");

      println!("[Tauri] Sidecar process spawned with PID: {:?}", child.pid());
      
      let port_regex = Regex::new(r"SIDECAR_PORT:(\d+)").unwrap();
      
      tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
          if let CommandEvent::Stdout(line_bytes) = event {
            let line = String::from_utf8_lossy(&line_bytes);
            println!("[Sidecar] {}", line);
            
            // Check if this line contains the port information
            if let Some(captures) = port_regex.captures(&line) {
              if let Some(port_match) = captures.get(1) {
                if let Ok(port) = port_match.as_str().parse::<u16>() {
                  *SIDECAR_PORT.lock().unwrap() = Some(port);
                  println!("[Tauri] Captured sidecar port: {}", port);
                }
              }
            }
          } else if let CommandEvent::Stderr(line_bytes) = event {
            let line = String::from_utf8_lossy(&line_bytes);
            println!("[Sidecar Error] {}", line);
          }
        }
        println!("[Tauri] Sidecar process terminated");
      });
      // --- Fim do código do Sidecar ---
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}