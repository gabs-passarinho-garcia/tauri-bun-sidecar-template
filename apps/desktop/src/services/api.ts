import { treaty } from "@elysiajs/eden";
import type { App } from "../../../server/src/index";

/**
 * Creates an Eden Treaty client for the sidecar API
 * @param port - The port where the sidecar is running
 * @returns Configured Eden client with type-safe API methods
 */
export function createApiClient(port: number): ReturnType<typeof treaty<App>> {
  return treaty<App>(`http://localhost:${port}`);
}

/**
 * Type for the API client instance
 */
export type ApiClient = ReturnType<typeof createApiClient>;