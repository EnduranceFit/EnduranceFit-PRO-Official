import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col gap-4 items-center justify-center bg-tech-pattern text-[#3b82f6] font-mono p-4 text-center">
      <h2 className="text-2xl">Página não encontrada</h2>
      <p className="text-sm text-[#808090]">A página que você está procurando não existe.</p>
      <Link 
        href="/"
        className="mt-4 px-6 py-2 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
      >
        Voltar ao Início
      </Link>
    </div>
  );
}
