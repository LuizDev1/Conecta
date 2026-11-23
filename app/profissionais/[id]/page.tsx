import Link from "next/link";
import { ArrowLeft, MapPin, Network } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { QuoteRequestForm } from "@/components/quote-request-form";

export default async function ProfessionalProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dashboardHref = "/auth/login";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    dashboardHref =
      profile?.role === "professional" ? "/profissional" : "/cliente";
  }

  const { data: professional } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "professional")
    .eq("is_available", true)
    .maybeSingle();

  if (!professional) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <p className="font-bold">Profissional não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1769E8] text-white">
              <Network size={20} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              conecta<span className="text-[#1769E8]">.</span>
            </span>
          </Link>
          <Link
            href="/profissionais"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          <Link
            href={dashboardHref}
            className="ml-4 text-sm font-bold text-[#1769E8]"
          >
            {user ? "Meu painel" : "Entrar"}
          </Link>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-14">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1769E8]">
                Perfil profissional
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {professional.full_name}
              </h1>
              {professional.presentation && (
                <p className="mt-3 text-slate-600">
                  {professional.presentation}
                </p>
              )}
            </div>
            {professional.is_demo && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1769E8]">
                Perfil demonstrativo
              </span>
            )}
          </div>

          {professional.service_area && (
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />
              {professional.service_area}
            </p>
          )}

          {professional.specialties?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {professional.specialties.map((specialty: string) => (
                <span
                  key={specialty}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          {professional.description && (
            <div className="mt-8 border-t border-slate-200 pt-7">
              <h2 className="text-lg font-bold">Sobre os serviços</h2>
              <p className="mt-3 leading-7 text-slate-600">
                {professional.description}
              </p>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold">Solicitar orçamento</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Descreva o serviço que você precisa.
          </p>
          {user ? (
            <QuoteRequestForm
              professionalId={professional.id}
              categories={
                professional.service_categories?.length
                  ? professional.service_categories
                  : ["Computadores", "Redes e Wi-Fi", "Formatação", "Hardware"]
              }
            />
          ) : (
            <Link
              href="/auth/login"
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#1769E8] px-5 py-3 text-sm font-bold text-white"
            >
              Entrar para solicitar orçamento
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}
