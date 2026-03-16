"use client";

import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-tech-pattern p-4 text-center">
      <h1 className="text-2xl text-red-500 mb-4">Erro Crítico no Sistema</h1>
      <p className="text-white mb-4">Ocorreu um erro inesperado. Por favor, limpe os dados e tente novamente.</p>
      <pre className="text-left bg-black/50 p-4 rounded text-red-400 text-xs overflow-auto max-w-2xl w-full mb-6">
        {error.message}
      </pre>
      <button
        onClick={() => {
          localStorage.removeItem('endurancefit_state');
          window.location.reload();
        }}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Limpar Dados e Reiniciar
      </button>
    </div>
  );
}
