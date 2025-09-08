import { JSX, useState, useEffect } from "react";

// Extend Window interface for Tauri
declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

function App(): JSX.Element {
  const [pingResponse, setPingResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidecarPort, setSidecarPort] = useState<number | null>(null);

  useEffect(() => {
    // Poll for sidecar port every 500ms until we get it
    const pollForPort = async (): Promise<void> => {
      try {
        // Check if we're in a Tauri environment
        if (typeof window !== "undefined" && window.__TAURI_INTERNALS__) {
          // Dynamic import to handle Tauri API loading
          const { invoke } = await import("@tauri-apps/api/core");
          const port = await invoke<number | null>("get_sidecar_port");
          if (port) {
            setSidecarPort(port);
            console.info(`Sidecar running on port ${port}`);
          } else {
            // Keep polling if port is not available yet
            setTimeout(() => {
              pollForPort().catch(console.error);
            }, 500);
          }
        } else {
          console.warn("Not running in Tauri environment, using fallback port");
          // Fallback for development - try common ports
          setSidecarPort(3000);
        }
      } catch (error) {
        console.error("Failed to get sidecar port:", error);
        // Retry after a delay if Tauri API is not ready
        setTimeout(() => {
          pollForPort().catch(console.error);
        }, 1000);
      }
    };

    pollForPort().catch(console.error);
  }, []);

  async function pingBackend(): Promise<void> {
    if (!sidecarPort) {
      setPingResponse("Error: Sidecar port not available yet");
      return;
    }

    setIsLoading(true);
    setPingResponse("");
    try {
      const response = await fetch(`http://localhost:${sidecarPort}/ping`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: unknown = await response.json();
      setPingResponse(JSON.stringify(data));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setPingResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePingClick = (): void => {
    pingBackend().catch((error) => {
      console.error("Unhandled error in pingBackend:", error);
    });
  };

  console.log(pingResponse);

  return (
    <div className="container">
      <h1>PoC: Tauri + Bun Sidecar</h1>
      <h2>Missão 1: "Hello, Sidecar"</h2>

      <div className="card">
        <button onClick={handlePingClick} disabled={isLoading}>
          {isLoading ? "Pinging..." : "1. Ping Backend"}
        </button>
        <p>
          <strong>Resposta do Servidor:</strong>
        </p>
        <pre>
          <code>{pingResponse}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;
