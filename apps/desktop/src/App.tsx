import { useState } from "react";

function App() {
  const [pingResponse, setPingResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function pingBackend() {
    setIsLoading(true);
    setPingResponse("");
    try {
      const response = await fetch("http://localhost:3000/ping");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as unknown;
      setPingResponse(JSON.stringify(data));
    } catch (error) {
      setPingResponse(`Error: ${error as Error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>PoC: Tauri + Bun Sidecar</h1>
      <h2>Missão 1: "Hello, Sidecar"</h2>

      <div className="card">
        <button onClick={pingBackend} disabled={isLoading}>
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
