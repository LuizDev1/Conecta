
import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const requestedNext = searchParams.get("next") ?? "/";

  // Impede redirecionamentos para sites externos.
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  const supabase = await createClient();

  let error = null;

  // Fluxo PKCE: troca o código por uma sessão.
  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  }
  // Fluxo com token hash: verifica o token diretamente.
  else if (tokenHash && type) {
    const result = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    error = result.error;
  } else {
    redirect(
      `/auth/error?error=${encodeURIComponent(
        "Link de confirmação inválido ou incompleto."
      )}`
    );
  }

  if (error) {
    redirect(
      `/auth/error?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(next);
}
