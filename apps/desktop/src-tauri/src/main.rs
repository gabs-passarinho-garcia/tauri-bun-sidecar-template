// Adicione estas linhas no topo do arquivo
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::api::process::{Command, CommandEvent};
use std::path::PathBuf;

fn main() {
  // --- Início do código do Sidecar ---
  let (mut rx, _child) = Command::new("bun")
    .args(["dev"]) // Chama o script "dev" do package.json do servidor
    // IMPORTANTE: Ajuste o diretório de trabalho para a pasta do servidor
    .current_dir(PathBuf::from("../../../apps/server")) 
    .spawn()
    .expect("Failed to spawn sidecar");

  tauri::async_runtime::spawn(async move {
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        // Imprime a saída do servidor Bun no console do Rust para debugging
        println!("[Sidecar] {}", line);
      }
    }
  });
  // --- Fim do código do Sidecar ---

  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}