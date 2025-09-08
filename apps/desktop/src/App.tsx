import { JSX, useState } from "react";
import { useSidecarPort } from "./hooks/useSidecarPort";
import { Button, Card, CardHeader, CardContent, Badge } from "./components/ui";
import { ServerIcon, PlayIcon, CheckCircleIcon, ExclamationTriangleIcon } from "./components/icons";

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent>
            <div className="animate-pulse-slow mb-4">
              <ServerIcon className="w-16 h-16 mx-auto text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold text-gradient mb-2">
              PoC: Tauri + Bun Sidecar
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Inicializando sidecar...
            </p>
            <Badge variant="loading" className="mt-4">
              Carregando
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sidecarError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent>
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-danger-500 mb-4" />
            <h1 className="text-2xl font-bold text-gradient mb-2">
              PoC: Tauri + Bun Sidecar
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Erro ao inicializar o sidecar
            </p>
            <Badge variant="error">
              {sidecarError}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            PoC: Tauri + Bun Sidecar
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Demonstração da integração entre Tauri e Bun como sidecar
          </p>
        </div>

        {/* Mission Card */}
        <Card variant="elevated" className="mb-6 animate-slide-up">
          <CardHeader>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <PlayIcon className="w-6 h-6 text-primary-600" />
              Missão 1: "Hello, Sidecar"
            </h2>
          </CardHeader>
          <CardContent>
            {/* Status Section */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <ServerIcon className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Status do Sidecar
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {sidecarPort ? `Rodando na porta ${sidecarPort}` : "Iniciando..."}
                  </p>
                </div>
              </div>
              <Badge variant={sidecarPort ? "success" : "loading"}>
                {sidecarPort ? (
                  <>
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Conectado
                  </>
                ) : (
                  "Aguardando..."
                )}
              </Badge>
            </div>

            {/* Action Button */}
            <div className="text-center mb-6">
              <Button
                onClick={() => void pingBackend()}
                disabled={sidecarLoading || !sidecarPort}
                isLoading={sidecarLoading}
                size="lg"
                className="min-w-[200px]"
              >
                {sidecarLoading ? "Enviando Ping..." : "🚀 Ping Backend"}
              </Button>
            </div>

            {/* Response Section */}
            {pingResponse && (
              <Card variant="glass" className="animate-slide-up">
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-success-600" />
                    Resposta do Servidor
                  </h3>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 dark:bg-slate-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-slate-700">
                    <code>{pingResponse}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 animate-fade-in">
          <p>Construído com ❤️ usando Tauri, React, TypeScript e Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;
