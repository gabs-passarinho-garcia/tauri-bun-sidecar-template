#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use std::path::PathBuf;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      // --- Início do código do Sidecar ---
      let shell = app.shell();
      let command = shell
        .command("bun")
        .args(["dev"])
        .current_dir(PathBuf::from("../../../apps/server"));
      
      let (mut rx, _child) = command
        .spawn()
        .expect("Failed to spawn sidecar");

      tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
          if let CommandEvent::Stdout(line_bytes) = event {
            let line = String::from_utf8_lossy(&line_bytes);
            println!("[Sidecar] {}", line);
          }
        }
      });
      // --- Fim do código do Sidecar ---
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}