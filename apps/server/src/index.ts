import { Elysia } from "elysia";

const app = new Elysia().get("/ping", () => {
  console.info("🏓 Ping endpoint called!");
  return {
    message: "pong from Bun sidecar!",
  };
});

// Use dynamic port (0 = system assigns available port)
app.listen(0);

// Get the actual port assigned by the system
const port = app.server?.port;
if (port) {
  console.info(`SIDECAR_PORT:${port}`);
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
