"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function QuoteProposalForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitProposal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const numericAmount = Number(amount.replace(",", "."));
    if (!Number.isFinite(numericAmount) || numericAmount < 0 || !message.trim()) {
      setError("Informe um valor válido e uma mensagem para o cliente.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const { data: request, error: requestError } = await supabase
        .from("quote_requests")
        .select("id, customer_id")
        .eq("id", requestId)
        .eq("professional_id", user.id)
        .eq("status", "waiting")
        .maybeSingle();

      if (requestError || !request) {
        setError("A solicitação não está disponível para resposta.");
        return;
      }

      const { error: proposalError } = await supabase
        .from("quote_proposals")
        .insert({
          request_id: request.id,
          professional_id: user.id,
          customer_id: request.customer_id,
          amount: numericAmount,
          message: message.trim(),
        })
        .select("id")
        .single();

      if (proposalError) {
        setError(
          "Não foi possível enviar a proposta. Nenhuma alteração foi confirmada.",
        );
        return;
      }

      setSuccess("Proposta enviada com sucesso.");
      router.replace("/profissional");
      router.refresh();
    } catch {
      setError(
        "Não foi possível enviar a proposta. Tente novamente em alguns instantes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submitProposal} className="mt-7 grid gap-5">
      <label className="grid gap-2 text-sm font-semibold">
        Valor da proposta
        <div className="flex items-center rounded-lg border border-slate-200">
          <span className="px-3 text-sm text-slate-500">R$</span>
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="min-w-0 flex-1 border-0 px-3 py-3 font-normal outline-none"
          />
        </div>
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        Mensagem ao cliente
        <textarea
          name="message"
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Explique o que está incluído na proposta."
          className="rounded-lg border border-slate-200 px-3 py-3 font-normal"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-[#1769E8] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {isLoading ? "Enviando..." : "Enviar proposta"}
      </button>
    </form>
  );
}
