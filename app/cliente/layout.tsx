import Link from "next/link";
import { redirect } from "next/navigation";
import { Network } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";


export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "customer") redirect("/profissional");

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1769E8] text-white">
              <Network size={20} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              conecta<span className="text-[#1769E8]">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/cliente" className="hidden text-sm font-semibold text-slate-600 hover:text-[#1769E8] sm:block">
              Visão geral
            </Link>
            <Link href="/cliente/perfil" className="hidden text-sm font-semibold text-slate-600 hover:text-[#1769E8] sm:block">
              Meus dados
            </Link>
            <Link href="/profissionais" className="hidden text-sm font-semibold text-slate-600 hover:text-[#1769E8] sm:block">
              Encontrar profissionais
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
