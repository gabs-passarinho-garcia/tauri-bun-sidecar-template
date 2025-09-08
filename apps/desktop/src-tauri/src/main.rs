#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use std::path::PathBuf;
use std::sync::{Arc, Mutex, LazyLock};
use regex::Regex;
use tauri::Emitter;

// 2. Estado Global (ainda útil para o invoke handler)
//    Mantém a porta do sidecar acessível de forma segura em todo o backend Rust.
static SIDECAR_PORT: LazyLock<Arc<Mutex<Option<u16>>>> = LazyLock::new(|| Arc::new(Mutex::new(None)));

// 3. Comando Invocável (ainda é uma boa prática manter)
//    Permite que o frontend "puxe" a informação, se necessário.
#[tauri::command]
fn get_sidecar_port() -> Option<u16> {
  *SIDECAR_PORT.lock().unwrap()
}

#[tauri::command]
fn read_sidecar_port_file() -> Result<u16, String> {
  use std::fs;
  use std::env;
  
  let temp_dir = env::temp_dir();
  let port_file_path = temp_dir.join("tauri-sidecar.port");
  
  match fs::read_to_string(&port_file_path) {
    Ok(content) => {
      match content.trim().parse::<u16>() {
        Ok(port) => {
          Ok(port)
        },
        Err(e) => {
          let error_msg = format!("Erro ao parsear porta do arquivo: {}", e);
          eprintln!("[Tauri] {}", error_msg);
          Err(error_msg)
        }
      }
    },
    Err(e) => {
      let error_msg = format!("Erro ao ler arquivo de porta: {}", e);
      eprintln!("[Tauri] {}", error_msg);
      Err(error_msg)
    }
  }
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![get_sidecar_port, read_sidecar_port_file])
    .setup(|app| {
      // 4. Pegamos um "handle" da aplicação para poder emitir eventos de dentro da task assíncrona.
      let app_handle = app.handle().clone();
      
      println!("[Tauri] Iniciando o sidecar Bun...");
      
      let shell = app.shell();
      let (mut rx, _child) = shell
        .command("bun")
        .args(["dev"])
        .current_dir(PathBuf::from("../../../apps/server"))
        .spawn()
        .expect("Falha ao iniciar o sidecar");
      
      let port_regex = Regex::new(r"SIDECAR_PORT:(\d+)").unwrap();
      
      // 5. Criamos uma task assíncrona para não travar a thread principal da UI.
      //    Ela ficará lendo a saída do processo do sidecar em background.
      tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
          match event {
            CommandEvent::Stdout(line_bytes) => {
              let line = String::from_utf8_lossy(&line_bytes);
              print!("[Sidecar] {}", line); // Usamos print! para não adicionar nova linha dupla
              
              if let Some(captures) = port_regex.captures(&line) {
                if let Some(port_match) = captures.get(1) {
                  if let Ok(port) = port_match.as_str().parse::<u16>() {
                    // Guarda a porta no estado global
                    *SIDECAR_PORT.lock().unwrap() = Some(port);
                    println!("[Tauri] Porta do sidecar capturada: {}", port);

                    // 6. A MÁGICA: Emite o evento para o frontend com a porta como payload!
                    println!("[Tauri] Emitindo evento 'sidecar_ready' com porta: {}", port);
                    if let Err(e) = app_handle.emit("sidecar_ready", port) {
                      eprintln!("[Tauri] Erro ao emitir evento: {:?}", e);
                    } else {
                      println!("[Tauri] Evento 'sidecar_ready' emitido com sucesso!");
                    }
                  }
                }
              }
            },
            CommandEvent::Stderr(line_bytes) => {
              let line = String::from_utf8_lossy(&line_bytes);
              eprint!("[Sidecar Error] {}", line); // Saída de erro
            },
            _ => {} // Ignora outros eventos como exit code, etc.
          }
        }
      });
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}