import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";


export default async function ClientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: requests } = await supabase
    .from("quote_requests")
    .select("*, quote_proposals(id, amount, message, created_at)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#1769E8]">Área do cliente</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Olá, {profile?.full_name || "cliente"}
          </h1>
        </div>
        <Link
          href="/profissionais"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1769E8] px-5 py-3 text-sm font-bold text-white"
        >
          <Search size={17} />
          Encontrar profissionais
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Minhas solicitações</h2>
        <div className="mt-4 grid gap-3">
          {!requests?.length && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-bold">Você ainda não solicitou nenhum orçamento.</p>
              <Link
                href="/profissionais"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1769E8]"
              >
                Encontrar profissional
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
          {requests?.map((request) => (
            <article
              key={request.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1769E8]">
                    {request.category}
                  </p>
                  <p className="mt-2 leading-7 text-slate-700">
                    {request.description}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                    request.status === "proposal_sent"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {request.status === "proposal_sent"
                    ? "Proposta recebida"
                    : "Aguardando resposta"}
                </span>
              </div>
              {request.quote_proposals?.map((proposal: {
                id: string;
                amount: number;
                message: string;
              }) => (
                <div
                  key={proposal.id}
                  className="mt-5 rounded-xl border border-blue-100 bg-blue-50/50 p-4"
                >
                  <p className="text-sm font-bold text-[#1769E8]">
                    Proposta: R$ {Number(proposal.amount).toFixed(2)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {proposal.message}
                  </p>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
