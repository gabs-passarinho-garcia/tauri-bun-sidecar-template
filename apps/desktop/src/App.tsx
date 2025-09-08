import { JSX, useState } from "react";

function App(): JSX.Element {
  const [pingResponse, setPingResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function pingBackend(): Promise<void> {
    setIsLoading(true);
    setPingResponse("");
    try {
      const response = await fetch("http://localhost:3002/ping");
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
