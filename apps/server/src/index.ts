import { Elysia } from "elysia";
import { writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/ping", () => {
    console.info("🏓 Ping endpoint called!");

    const response = {
      message: "pong from Bun sidecar!",
      timestamp: new Date().toISOString(),
      status: "success",
      bunVersion: Bun.version,
    };

    console.info("🏓 Retornando resposta:", JSON.stringify(response));
    return response;
  })
  .get("/version", () => {
    console.info("📋 Version endpoint called!");
    
    const versionInfo = {
      bun: Bun.version,
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    };
    
    console.info("📋 Retornando versões:", JSON.stringify(versionInfo));
    return versionInfo;
  });

// Use dynamic port (0 = system assigns available port)
app.listen(0);

// Get the actual port assigned by the system
const port = app.server?.port;
if (port) {
  console.info(`SIDECAR_PORT:${port}`);

  // BACKUP: Escreve a porta em um arquivo temporário
  const portFilePath = join(tmpdir(), "tauri-sidecar.port");
  try {
    writeFileSync(portFilePath, port.toString(), "utf8");
    console.info(`📁 Porta salva em: ${portFilePath}`);
  } catch (error) {
    console.error("❌ Erro ao salvar arquivo de porta:", error);
  }

  console.info(`🦊 Elysia sidecar is running at http://localhost:${port}`);
} else {
  console.error("Failed to get server port");
  process.exit(1);
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.info("🔥 Sidecar received SIGTERM, shutting down gracefully...");
  void app.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.info("🔥 Sidecar received SIGINT, shutting down gracefully...");
  void app.stop();
  process.exit(0);
});

process.on("exit", () => {
  console.info("👋 Sidecar process exiting...");
});

// Export the app type for Eden Treaty
export type App = typeof app;
