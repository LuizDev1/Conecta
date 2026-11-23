import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


export default async function ProfissionalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: requests } = await supabase
    .from("quote_requests")
    .select("*, quote_proposals(id, amount, message)")
    .eq("professional_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#1769E8]">
            Área do profissional
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Solicitações recebidas
          </h1>
        </div>
        <Link
          href="/profissional/perfil"
          className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-[#1769E8]"
        >
          Editar meu perfil
        </Link>
      </div>

      <div className="mt-8 grid gap-3">
        {!requests?.length && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Nenhuma solicitação recebida ainda.
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
                <p className="mt-2 max-w-3xl leading-7 text-slate-700">
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
                  ? "Proposta enviada"
                  : "Aguardando proposta"}
              </span>
            </div>
            {request.status === "waiting" && (
              <Link
                href={`/profissional/solicitacoes/${request.id}`}
                className="mt-5 inline-flex rounded-lg bg-[#1769E8] px-4 py-2.5 text-sm font-bold text-white"
              >
                Responder solicitação
              </Link>
            )}
            {request.quote_proposals?.map((proposal: {
              id: string;
              amount: number;
              message: string;
            }) => (
              <div
                key={proposal.id}
                className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
              >
                <p className="text-sm font-bold text-emerald-700">
                  Valor informado: R$ {Number(proposal.amount).toFixed(2)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {proposal.message}
                </p>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
