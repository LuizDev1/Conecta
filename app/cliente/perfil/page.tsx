import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";


async function updateCustomerProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      city: String(formData.get("city") || "").trim(),
    })
    .eq("id", user.id);

  revalidatePath("/cliente");
  revalidatePath("/cliente/perfil");
}

export default async function PerfilClientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, city")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold text-[#1769E8]">Área do cliente</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Meus dados
      </h1>
      <form
        action={updateCustomerProfile}
        className="mt-8 grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      >
        <label className="grid gap-2 text-sm font-semibold">
          Nome completo
          <input
            name="full_name"
            defaultValue={profile?.full_name || ""}
            required
            className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Telefone
          <input
            name="phone"
            defaultValue={profile?.phone || ""}
            className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Cidade
          <input
            name="city"
            defaultValue={profile?.city || ""}
            className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-[#1769E8] px-5 py-3 text-sm font-bold text-white"
        >
          Salvar dados
        </button>
      </form>
    </div>
  );
}
