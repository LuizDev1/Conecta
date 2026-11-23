
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  HardDrive,
  Laptop,
  MonitorCog,
  Network,
  Search,
  ShieldCheck,
  Wrench,
  Wifi,
  Users,
} from "lucide-react";

const categories = [
  {
    name: "Manutenção de computadores",
    description: "Diagnóstico e reparo de computadores e notebooks.",
    icon: Wrench,
  },
  {
    name: "Formatação e instalação",
    description: "Sistemas operacionais, programas e configurações.",
    icon: MonitorCog,
  },
  {
    name: "Redes e Wi-Fi",
    description: "Instalação, configuração e solução de problemas.",
    icon: Wifi,
  },
  {
    name: "Montagem e upgrade",
    description: "Montagem de PCs e melhorias de desempenho.",
    icon: Laptop,
  },
  {
    name: "Segurança digital",
    description: "Proteção, remoção de vírus e configurações.",
    icon: ShieldCheck,
  },
  {
    name: "Recuperação de dados",
    description: "Backup e recuperação de arquivos.",
    icon: HardDrive,
  },
];

const steps = [
  {
    number: "01",
    title: "Encontre",
    description:
      "Escolha o serviço que você precisa e encontre profissionais disponíveis.",
  },
  {
    number: "02",
    title: "Compare",
    description:
      "Conheça os profissionais, analise seus perfis e solicite orçamentos.",
  },
  {
    number: "03",
    title: "Conecte-se",
    description:
      "Entre em contato e combine os detalhes do serviço diretamente.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1769E8] text-white">
              <Network size={21} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              conecta<span className="text-[#1769E8]">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="#inicio" className="transition hover:text-[#1769E8]">
              Início
            </Link>
            <Link href="#categorias" className="transition hover:text-[#1769E8]">
              Serviços
            </Link>
            <Link href="#como-funciona" className="transition hover:text-[#1769E8]">
              Como funciona
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-[#1769E8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Cadastrar-se
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-[#1769E8]">
              <BadgeCheck size={16} />
              Tecnologia mais perto de você
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A solução para seus problemas de tecnologia{" "}
              <span className="text-[#1769E8]">começa aqui.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Encontre profissionais técnicos, compare opções e conecte-se
              com quem pode resolver seu problema. Tudo em um só lugar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#categorias"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1769E8] px-7 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Encontrar profissionais
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-[#1769E8]"
              >
                Sou profissional
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#1769E8]" />
                Diversos serviços técnicos
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#1769E8]" />
                Conexões mais simples
              </span>
            </div>
          </div>

          {/* Visual ilustrativo */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-blue-200/50 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Encontre seu serviço
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    O que você precisa resolver?
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-[#1769E8]">
                  <Search size={21} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Laptop, name: "Manutenção de notebook" },
                  { icon: Wifi, name: "Configuração de rede Wi-Fi" },
                  { icon: MonitorCog, name: "Formatação de computador" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <div className="rounded-lg bg-blue-50 p-3 text-[#1769E8]">
                      <item.icon size={21} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="ml-auto text-slate-400"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-[#0F172A] p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/10 p-2.5">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Pessoas e profissionais conectados
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      Uma maneira mais simples de encontrar soluções.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section id="categorias" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-wider text-[#1769E8]">
              Nossos serviços
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Soluções para diferentes necessidades.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Encontre profissionais para os principais serviços de informática
              e tecnologia.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1769E8] transition group-hover:bg-[#1769E8] group-hover:text-white">
                  <category.icon size={23} />
                </div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {category.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#1769E8]">
                  Saiba mais
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-[#1769E8]">
              Simples assim
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Como funciona a Conecta?
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Aproximamos quem precisa de um serviço de quem sabe como
              realizá-lo.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-bold tracking-tight text-blue-100">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Área para profissionais */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl bg-[#0F172A] p-9 text-white sm:p-14 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-300">
              Para profissionais
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Seu trabalho merece ser encontrado.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              Faça parte da Conecta e tenha a oportunidade de apresentar seus
              serviços a pessoas que precisam de soluções tecnológicas.
            </p>
          </div>

          <Link
            href="/auth/sign-up"
            className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#1769E8] px-7 py-4 font-semibold text-white transition hover:bg-blue-600"
          >
            Quero participar
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 sm:flex-row sm:items-center lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1769E8] text-white">
              <Network size={18} />
            </div>
            <span className="text-xl font-bold">
              conecta<span className="text-[#1769E8]">.</span>
            </span>
          </Link>

          <p className="text-sm text-slate-500">
            © 2026 Conecta. Todos os direitos reservados.
          </p>

          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-600 transition hover:text-[#1769E8]"
          >
            Acessar minha conta
          </Link>
        </div>
      </footer>
    </main>
  );
}
