"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function QuoteRequestForm({
  professionalId,
  categories,
}: {
  professionalId: string;
  categories: string[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!category || !description.trim()) {
      setError("Selecione uma categoria e descreva o serviço necessário.");
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "customer") {
        setError("Somente contas de cliente podem solicitar orçamentos.");
        return;
      }

      const { error: insertError } = await supabase
        .from("quote_requests")
        .insert({
          customer_id: user.id,
          professional_id: professionalId,
          category,
          description: description.trim(),
          status: "waiting",
        })
        .select("id")
        .single();

      if (insertError) {
        setError(
          "Não foi possível enviar a solicitação. Verifique os dados e tente novamente.",
        );
        return;
      }

      router.replace("/cliente");
      router.refresh();
    } catch {
      setError(
        "Não foi possível enviar a solicitação. Tente novamente em alguns instantes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submitRequest} className="mt-5 grid gap-4">
      <label className="grid gap-2 text-sm font-semibold">
        Categoria
        <select
          name="category"
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-3 font-normal"
        >
          <option value="">Selecione</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        Descrição do serviço
        <textarea
          name="description"
          required
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Explique o problema ou serviço desejado."
          className="rounded-lg border border-slate-200 px-3 py-3 font-normal"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-[#1769E8] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {isLoading ? "Enviando..." : "Enviar solicitação"}
      </button>
    </form>
  );
}
