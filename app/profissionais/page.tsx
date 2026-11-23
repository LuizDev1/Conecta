import Link from "next/link";
import { ArrowRight, MapPin, Network } from "lucide-react";
import { createClient } from "@/lib/supabase/server";


export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; categoria?: string }>;
}) {
  const params = await searchParams;
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

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "professional")
    .eq("is_available", true)
    .order("full_name");

  if (params.busca) {
    query = query.ilike("full_name", `%${params.busca}%`);
  }

  if (params.categoria) {
    query = query.contains("service_categories", [params.categoria]);
  }

  const { data: professionals } = await query;

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
          <Link href={dashboardHref} className="text-sm font-bold text-slate-600">
            {user ? "Meu painel" : "Entrar"}
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1769E8]">
          Marketplace
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Encontre profissionais de tecnologia
        </h1>

        <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_220px_auto]">
          <input
            name="busca"
            defaultValue={params.busca || ""}
            placeholder="Buscar por nome"
            className="min-h-12 rounded-lg border border-slate-200 px-4"
          />
          <select
            name="categoria"
            defaultValue={params.categoria || ""}
            className="min-h-12 rounded-lg border border-slate-200 px-4"
          >
            <option value="">Todas as categorias</option>
            <option value="Computadores">Computadores</option>
            <option value="Redes e Wi-Fi">Redes e Wi-Fi</option>
            <option value="Formatação">Formatação</option>
            <option value="Hardware">Hardware</option>
            <option value="Segurança">Segurança</option>
            <option value="Recuperação">Recuperação</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-[#1769E8] px-5 py-3 text-sm font-bold text-white"
          >
            Buscar
          </button>
        </form>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {!professionals?.length && (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              Nenhum profissional encontrado.
            </div>
          )}
          {professionals?.map((professional) => (
            <article
              key={professional.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold">{professional.full_name}</p>
                  {professional.presentation && (
                    <p className="mt-1 text-sm text-slate-500">
                      {professional.presentation}
                    </p>
                  )}
                </div>
                {professional.is_demo && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#1769E8]">
                    DEMO
                  </span>
                )}
              </div>

              {professional.service_area && (
                <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin size={14} />
                  {professional.service_area}
                </p>
              )}

              {professional.specialties?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {professional.specialties.slice(0, 4).map((specialty: string) => (
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
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {professional.description}
                </p>
              )}

              <Link
                href={`/profissionais/${professional.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1769E8]"
              >
                Ver perfil
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
