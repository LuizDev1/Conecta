import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuoteProposalForm } from "@/components/quote-proposal-form";

export default async function ResponderSolicitacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: request } = await supabase
    .from("quote_requests")
    .select("*, profiles!quote_requests_customer_id_fkey(full_name)")
    .eq("id", id)
    .eq("professional_id", user.id)
    .maybeSingle();

  if (!request) redirect("/profissional");
  if (request.status !== "waiting") redirect("/profissional");

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-[#1769E8]">
        Nova solicitação
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Responder orçamento
      </h1>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1769E8]">
          {request.category}
        </p>
        <p className="mt-3 leading-7 text-slate-700">{request.description}</p>

        <QuoteProposalForm requestId={request.id} />
      </div>
    </div>
  );
}
