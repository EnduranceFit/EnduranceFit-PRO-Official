"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex h-screen flex-col items-center justify-center bg-black p-4 text-center">
          <h1 className="text-2xl text-red-500 mb-4">Erro Crítico Global</h1>
          <p className="text-white mb-4">Ocorreu um erro inesperado no layout principal.</p>
          <pre className="text-left bg-gray-900 p-4 rounded text-red-400 text-xs overflow-auto max-w-2xl w-full mb-6">
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
      </body>
    </html>
  );
}
