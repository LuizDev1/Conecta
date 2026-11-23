import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";


async function updateProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const specialties = String(formData.get("specialties") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const serviceCategories = String(formData.get("service_categories") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") || "").trim(),
      presentation: String(formData.get("presentation") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      specialties,
      service_categories: serviceCategories,
      service_area: String(formData.get("service_area") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      city: String(formData.get("city") || "").trim(),
    })
    .eq("id", user.id);

  if (!error) revalidatePath("/profissional/perfil");
}

export default async function PerfilProfissionalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-[#1769E8]">
        Perfil profissional
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Apresente seus serviços
      </h1>

      <form
        action={updateProfile}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      >
        <div className="grid gap-5">
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
            Apresentação curta
            <input
              name="presentation"
              defaultValue={profile?.presentation || ""}
              placeholder="Ex.: Técnico em computadores e redes"
              className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Descrição dos serviços
            <textarea
              name="description"
              defaultValue={profile?.description || ""}
              rows={5}
              placeholder="Descreva sua experiência e os serviços que oferece."
              className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Especialidades
            <input
              name="specialties"
              defaultValue={profile?.specialties?.join(", ") || ""}
              placeholder="Manutenção, formatação, redes"
              className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Categorias de atendimento
            <input
              name="service_categories"
              defaultValue={profile?.service_categories?.join(", ") || ""}
              placeholder="Computadores, Redes e Wi-Fi"
              className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Região de atendimento
              <input
                name="service_area"
                defaultValue={profile?.service_area || ""}
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
          </div>

          <label className="grid gap-2 text-sm font-semibold">
            Telefone
            <input
              name="phone"
              defaultValue={profile?.phone || ""}
              className="rounded-lg border border-slate-200 px-3.5 py-3 font-normal"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[#1769E8] px-5 py-3 text-sm font-bold text-white"
          >
            Salvar perfil
          </button>
        </div>
      </form>
    </div>
  );
}
