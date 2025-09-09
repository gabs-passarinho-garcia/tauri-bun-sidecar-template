import { JSX, useState, useEffect, useMemo } from "react";
import { useSidecarPort } from "./hooks/useSidecarPort";
import { Button, Card, CardHeader, CardContent, Badge } from "./components/ui";
import { ServerIcon, PlayIcon, CheckCircleIcon, ExclamationTriangleIcon } from "./components/icons";
import { createApiClient } from "./services/api";

function App(): JSX.Element {
  // --- Estado do Componente ---
  const [pingResponse, setPingResponse] = useState("");
  const [versionInfo, setVersionInfo] = useState<{
    bun: string;
    node: string;
    platform: string;
    arch: string;
  } | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // --- Hooks ---
  const {
    sidecarPort,
    isLoading: isSidecarLoading,
    error: sidecarError,
  } = useSidecarPort();

  const apiClient = useMemo(() => {
    return sidecarPort ? createApiClient(sidecarPort) : null;
  }, [sidecarPort]);

  // --- Efeitos ---
  useEffect(() => {
    if (!apiClient) {
      return;
    }

    const fetchVersionInfo = async (): Promise<void> => {
      try {
        const response = await apiClient.version.get();
        if (response.data) {
          setVersionInfo(response.data);
        }
      } catch (error) {
        console.error("[DEBUG] Erro ao buscar versão:", error);
      }
    };

    void fetchVersionInfo();
  }, [apiClient]);

  // --- Gestores de Interação ---
  const handlePingBackend = async (): Promise<void> => {
    if (!apiClient) {
      setPingResponse("Erro: Cliente API não disponível");
      return;
    }

    setIsPinging(true);
    setPingResponse("");

    try {
      const response = await apiClient.ping.get();

      if (response.error) {
        setPingResponse(`Erro: ${JSON.stringify(response.error)}`);
        return;
      }

      if (response.data) {
        setPingResponse(JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.error("[DEBUG] Erro no ping:", error);
      setPingResponse(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    } finally {
      setIsPinging(false);
    }
  };

  // --- Lógica de Renderização ---
  if (isSidecarLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
        <Card className="w-full max-w-md text-center">
          <CardContent>
            <div className="animate-pulse mb-4">
              <ServerIcon className="w-16 h-16 mx-auto text-indigo-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              PoC: Tauri + Bun Sidecar
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              A inicializar o sidecar...
            </p>
            <Badge variant="loading" className="mt-4">
              A carregar
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sidecarError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
        <Card className="w-full max-w-md text-center">
          <CardContent>
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500 mb-2">
            PoC: Tauri + Bun Sidecar
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Demonstração da integração entre Tauri e Bun como sidecar
          </p>
        </div>

        {/* Cartão da Missão */}
        <Card className="mb-6 animate-slide-up" variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <PlayIcon className="w-6 h-6 text-indigo-600" />
              Missão 1: "Hello, Sidecar"
            </h2>
          </CardHeader>
          <CardContent>
            {/* Secção de Estado */}
            <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <ServerIcon className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="font-medium">
                    Estado do Sidecar
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {sidecarPort ? `A correr na porta ${sidecarPort}` : "A inicializar..."}
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
                  "A aguardar..."
                )}
              </Badge>
            </div>

            {/* Secção de Informação da Versão */}
            {versionInfo && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700/80 rounded-lg mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-lg">🦊</span>
                  Informação do Runtime
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Bun:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{versionInfo.bun}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Node:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{versionInfo.node}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Platform:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{versionInfo.platform}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Arch:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{versionInfo.arch}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Ação */}
            <div className="text-center mb-6">
              <Button
                onClick={() => void handlePingBackend()}
                disabled={!apiClient || isPinging}
                isLoading={isPinging}
                size="lg"
                className="min-w-[200px]"
              >
                {isPinging ? "A enviar Ping..." : "🚀 Ping Backend"}
              </Button>
            </div>

            {/* Secção de Resposta */}
            {pingResponse && (
              <Card className="animate-slide-up bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    Resposta do Servidor
                  </h3>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-slate-700">
                    <code>{pingResponse}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 animate-fade-in">
          <p>Construído com ❤️ usando Tauri, React, TypeScript e Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;

