import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Cpu,
  HardDrive,
  Laptop,
  MapPin,
  MonitorCog,
  Network,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wifi,
  Wrench,
} from "lucide-react";

const categories = [
  {
    name: "Computadores",
    detail: "Diagnóstico e manutenção",
    icon: Laptop,
  },
  {
    name: "Redes e Wi-Fi",
    detail: "Conexão e infraestrutura",
    icon: Wifi,
  },
  {
    name: "Formatação",
    detail: "Sistema e aplicativos",
    icon: MonitorCog,
  },
  {
    name: "Hardware",
    detail: "Montagem e upgrade",
    icon: Cpu,
  },
  {
    name: "Segurança",
    detail: "Proteção e configuração",
    icon: ShieldCheck,
  },
  {
    name: "Recuperação",
    detail: "Backup e dados",
    icon: HardDrive,
  },
];

const steps = [
  {
    number: "1",
    title: "Escolha o serviço",
    text: "Encontre a categoria que corresponde à sua necessidade.",
  },
  {
    number: "2",
    title: "Veja as opções",
    text: "Conheça profissionais e suas áreas de atendimento.",
  },
  {
    number: "3",
    title: "Faça o contato",
    text: "Combine diretamente o diagnóstico, o prazo e o orçamento.",
  },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex w-fit items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${
          light ? "bg-white text-[#1769E8]" : "bg-[#1769E8] text-white"
        }`}
      >
        <Network size={20} strokeWidth={2.3} />
      </span>
      <span
        className={`text-xl font-bold tracking-[-0.04em] ${
          light ? "text-white" : "text-[#0F172A]"
        }`}
      >
        conecta<span className="text-[#1769E8]">.</span>
      </span>
    </Link>
  );
}

function ServiceSearch() {
  return (
    <div className="relative mx-auto w-full max-w-[660px]">
      <div className="absolute -right-16 -top-12 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative rounded-[20px] border border-slate-200/80 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:p-4">
        <div className="rounded-[14px] border border-slate-200">
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1769E8]">
                Buscar serviço
              </p>
              <p className="mt-1 text-sm font-bold text-[#0F172A]">
                O que você precisa resolver?
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1769E8]">
              <MapPin size={17} />
            </span>
          </div>

          <div className="mx-4 border-t border-slate-100 sm:mx-5" />

          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-3">
              <Search size={18} className="shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-500">
                Ex.: meu notebook está lento
              </span>
              <SlidersHorizontal size={16} className="shrink-0 text-slate-400" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {categories.slice(0, 6).map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.name}
                    className="flex min-h-[68px] items-center gap-3 rounded-xl border border-slate-100 px-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1769E8]">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-700">
                        {category.name}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        Explorar
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 left-5 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <BadgeCheck size={19} />
        </span>
        <div>
          <p className="text-xs font-bold text-[#0F172A]">
            Conexão direta
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Cliente e profissional
          </p>
        </div>
      </div>

      <p className="mt-10 text-center text-[10px] font-medium text-slate-400">
        Prévia ilustrativa da experiência
      </p>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileRole: "customer" | "professional" | null = null;
  let profileName = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    profileRole =
      profile?.role === "professional" || profile?.role === "customer"
        ? profile.role
        : null;
    profileName = profile?.full_name || "";
  }

  const dashboardHref =
    profileRole === "professional" ? "/profissional" : "/cliente";
  const professionalCtaHref = user
    ? dashboardHref
    : "/auth/sign-up";
  const discoveryCtaHref = user
    ? "/profissionais"
    : "/auth/login";
  const accountCtaHref = user
    ? dashboardHref
    : "/auth/sign-up";

  return (
    <main className="overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <nav className="conecta-container flex h-[72px] items-center justify-between">
          <Brand />

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <Link href="#servicos" className="transition hover:text-[#1769E8]">
              Serviços
            </Link>
            <Link
              href="#como-funciona"
              className="transition hover:text-[#1769E8]"
            >
              Como funciona
            </Link>
            <Link
              href="#profissionais"
              className="transition hover:text-[#1769E8]"
            >
              Para profissionais
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="hidden max-w-44 truncate px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:text-[#1769E8] sm:block"
                >
                  {profileName || "Minha conta"}
                </Link>
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1769E8] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Meu painel
                  <ArrowRight size={16} />
                </Link>
                <div className="hidden lg:block">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:text-[#1769E8] sm:block"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1769E8] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  <span className="hidden sm:inline">Criar conta</span>
                  <span className="sm:hidden">Criar</span>
                  <ArrowUpRight size={16} />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="conecta-container grid items-center gap-12 py-16 sm:py-20 lg:min-h-[620px] lg:grid-cols-[48%_52%] lg:py-14">
          <div className="max-w-[610px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1769E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1769E8]" />
              Serviços de tecnologia
            </div>

            <h1 className="mt-7 text-[43px] font-bold leading-[1.05] tracking-[-0.045em] text-[#0F172A] sm:text-[58px] lg:text-[68px]">
              Soluções de tecnologia, mais perto de você.
            </h1>

            <p className="mt-6 max-w-[540px] text-base leading-8 text-slate-600 sm:text-lg">
              Encontre profissionais preparados para ajudar com computadores,
              notebooks, redes, instalações e suporte técnico.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#servicos"
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#1769E8] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Encontrar profissional
                <ArrowRight size={18} />
              </Link>
              <Link
                href={professionalCtaHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-[#1769E8]"
              >
                Sou profissional
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
              {["Busca por categoria", "Perfis profissionais", "Contato direto"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-500"
                  >
                    <CheckCircle2
                      size={15}
                      strokeWidth={2.5}
                      className="text-[#1769E8]"
                    />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative rounded-[24px] bg-[#0F172A] px-4 py-10 sm:px-8 lg:px-10 lg:py-12">
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px] opacity-[0.09]"
              style={{
                backgroundImage:
                  "radial-gradient(#93C5FD 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative">
              <ServiceSearch />
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-[#F8FAFC] py-20 sm:py-24">
        <div className="conecta-container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1769E8]">
                Categorias
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">
                Qual tipo de ajuda você precisa?
              </h2>
            </div>
            <Link
              href={accountCtaHref}
              className="hidden items-center gap-2 text-sm font-bold text-[#1769E8] md:flex"
            >
              Criar uma conta
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  href={discoveryCtaHref}
                  key={category.name}
                  className="group flex min-h-[190px] flex-col justify-between bg-white p-6 transition hover:bg-blue-50/50 sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1769E8] transition group-hover:bg-[#1769E8] group-hover:text-white">
                      <Icon size={21} strokeWidth={1.8} />
                    </span>
                    <ChevronRight
                      size={18}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#1769E8]"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {category.detail}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-y border-slate-200 bg-white py-20 sm:py-24"
      >
        <div className="conecta-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1769E8]">
                Como funciona
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">
                Resolver o problema em poucos passos.
              </h2>
            </div>
            <p className="max-w-md leading-7 text-slate-600">
              A Conecta aproxima quem precisa de ajuda técnica de profissionais
              capazes de atender a necessidade.
            </p>
          </div>

          <div className="mt-14 grid border-t border-slate-200 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`py-8 md:min-h-[220px] md:px-8 md:py-10 ${
                  index !== 0
                    ? "border-t border-slate-200 md:border-l md:border-t-0"
                    : ""
                }`}
              >
                <span className="text-sm font-bold text-[#1769E8]">
                  {step.number}
                </span>
                <h3 className="mt-8 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="profissionais" className="bg-[#0F172A] py-20 text-white sm:py-24">
        <div className="conecta-container grid items-center gap-14 lg:grid-cols-[1fr_0.82fr]">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
              Para profissionais
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">
              Seu trabalho merece ser encontrado.
            </h2>
            <p className="mt-6 max-w-lg leading-8 text-slate-300">
              Crie seu perfil profissional, organize suas especialidades e
              apresente os serviços que você oferece.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Perfil profissional",
                "Especialidades",
                "Novas oportunidades",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>

            <Link
              href={professionalCtaHref}
              className="mt-9 inline-flex items-center gap-3 rounded-lg bg-[#1769E8] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Quero divulgar meus serviços
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-10 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="relative rounded-[20px] border border-white/10 bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1769E8] text-white">
                    <Wrench size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">
                      Perfil profissional
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Serviços de tecnologia
                    </p>
                  </div>
                </div>
                <BadgeCheck size={20} className="text-[#1769E8]" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Especialidade", MonitorCog],
                  ["Atendimento", MapPin],
                  ["Disponibilidade", Users],
                  ["Contato", Network],
                ].map(([label, Icon]) => (
                  <div
                    key={label as string}
                    className="rounded-xl border border-slate-100 p-3"
                  >
                    <Icon size={17} className="text-[#1769E8]" />
                    <p className="mt-3 text-xs font-bold text-[#0F172A]">
                      {label as string}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-[10px] text-slate-400">
                Prévia ilustrativa
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="conecta-container flex flex-col items-start justify-between gap-8 py-16 sm:flex-row sm:items-center sm:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1769E8]">
              Comece agora
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">
              Tecnologia fica mais simples quando as pessoas se conectam.
            </h2>
          </div>
          <Link
            href={accountCtaHref}
            className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-[#1769E8] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Criar minha conta
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-[#F8FAFC]">
        <div className="conecta-container flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Brand />
            <p className="mt-3 text-sm text-slate-500">
              Conectando pessoas, tecnologia e oportunidades.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500">
            <Link href="#servicos" className="hover:text-[#1769E8]">
              Serviços
            </Link>
            <Link href="#como-funciona" className="hover:text-[#1769E8]">
              Como funciona
            </Link>
            <Link
              href={user ? dashboardHref : "/auth/login"}
              className="hover:text-[#1769E8]"
            >
              {user ? "Meu painel" : "Entrar"}
            </Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 Conecta</p>
        </div>
      </footer>
    </main>
  );
}
