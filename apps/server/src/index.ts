import { Elysia } from "elysia";

new Elysia()
  .get("/ping", () => ({ message: "pong from Bun sidecar!" }))
  .listen(3002);

console.log("🦊 Elysia sidecar is running at http://localhost:3002");
