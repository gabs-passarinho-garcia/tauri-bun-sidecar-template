import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

/**
 * Custom hook para gerenciar comunicação com o sidecar Bun
 * Implementa múltiplas estratégias de comunicação para máxima robustez
 */
export interface UseSidecarPortReturn {
  sidecarPort: number | null;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
}

export function useSidecarPort(): UseSidecarPortReturn {
  const [sidecarPort, setSidecarPort] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isComponentMounted = true;
    let attempts = 0;
    const maxAttempts = 30; // 30 tentativas = 15 segundos

    const pollForPort = async (): Promise<void> => {
      if (!isComponentMounted || attempts >= maxAttempts) {
        if (attempts >= maxAttempts && isComponentMounted) {
          setError('Timeout: Sidecar não iniciou em tempo hábil');
          setIsLoading(false);
        }
        return;
      }
      
      try {
        console.info(`[useSidecarPort] Tentativa ${attempts + 1}/${maxAttempts} - Obtendo porta via invoke...`);
        const port = await invoke<number>('get_sidecar_port');
        
        if (port && port > 0 && isComponentMounted) {
          console.info(`[useSidecarPort] Porta obtida: ${port}`);
          setSidecarPort(port);
          setIsLoading(false);
          setError(null);
          return;
        }
      } catch (invokeError) {
        console.warn(`[useSidecarPort] Tentativa ${attempts + 1} falhou:`, invokeError);
      }
      
      attempts++;
      // Tenta novamente em 500ms
      setTimeout(() => {
        void pollForPort();
      }, 500);
    };

    console.info('[useSidecarPort] Configurando comunicação com sidecar...');
    void pollForPort();

    // Cleanup function
    return (): void => {
      isComponentMounted = false;
    };
  }, []);

  return {
    sidecarPort,
    isLoading,
    error,
    isReady: sidecarPort !== null && !isLoading && !error
  };
}