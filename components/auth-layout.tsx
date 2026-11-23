import Link from "next/link";
import { Network } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(23,105,232,.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative w-full max-w-[440px]">
        <div className="mb-7 flex justify-center">
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1769E8] text-white">
              <Network size={20} strokeWidth={2.2} />
            </span>
            <span className="text-xl font-bold tracking-[-0.03em] text-[#0F172A]">
              conecta<span className="text-[#1769E8]">.</span>
            </span>
          </Link>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-1 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          {children}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="w-fit text-sm font-semibold text-slate-500 transition hover:text-[#1769E8]"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}