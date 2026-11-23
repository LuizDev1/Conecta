import Link from "next/link";
import { Network } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1769E8] text-white">
              <Network size={20} />
            </span>
            <span className="text-xl font-bold tracking-[-0.04em]">
              conecta<span className="text-[#1769E8]">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/profissionais"
              className="hidden text-sm font-semibold text-slate-600 hover:text-[#1769E8] sm:block"
            >
              Profissionais
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {children}
      </div>
    </main>
  );
}
