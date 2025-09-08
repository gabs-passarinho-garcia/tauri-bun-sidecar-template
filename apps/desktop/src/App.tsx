import { JSX, useState } from "react";
import { useSidecarPort } from "./hooks/useSidecarPort";

function App(): JSX.Element {
  // --- Estados do Componente ---
  const [pingResponse, setPingResponse] = useState("");
  const {
    sidecarPort,
    isLoading: sidecarLoading,
    error: sidecarError,
  } = useSidecarPort();

  // --- Funções de Interação ---
  const pingBackend = async (): Promise<void> => {
    if (!sidecarPort) {
      setPingResponse("Erro: Porta do sidecar não disponível");
      return;
    }

    try {
      const url = `http://localhost:${sidecarPort}/ping`;

      const response = await fetch(url);

      const data = await response.text();

      // Try to parse as JSON first
      try {
        const jsonData = JSON.parse(data) as Record<string, unknown>;

        // If it's JSON, try to get the 'message' field, otherwise stringify
        const message = jsonData.message;
        const displayText =
          typeof message === "string"
            ? message
            : JSON.stringify(jsonData, null, 2);
        setPingResponse(displayText);
      } catch {
        setPingResponse(data);
      }
    } catch (error) {
      console.error("[DEBUG] Ping error:", error);
      setPingResponse(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  };

  // --- Renderização do Componente ---
  if (sidecarLoading) {
    return (
      <div className="container">
        <h1>PoC: Tauri + Bun Sidecar</h1>
        <p>Carregando sidecar...</p>
      </div>
    );
  }

  if (sidecarError) {
    return (
      <div className="container">
        <h1>PoC: Tauri + Bun Sidecar</h1>
        <p style={{ color: "red" }}>Erro: {sidecarError}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>PoC: Tauri + Bun Sidecar</h1>
      <h2>Missão 1: "Hello, Sidecar"</h2>

      <div className="card">
        <button
          onClick={() => void pingBackend()}
          disabled={sidecarLoading || !sidecarPort}
        >
          {sidecarLoading ? "Pinging..." : "1. Ping Backend"}
        </button>

        <p>
          <strong>Status do Sidecar:</strong>{" "}
          {sidecarPort ? `Pronto na porta ${sidecarPort}` : "Iniciando..."}
        </p>

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
