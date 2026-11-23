"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        },
      );

      if (error) {
        throw new Error(
          "Não foi possível enviar o e-mail. Verifique o endereço informado e tente novamente.",
        );
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      {success ? (
        <>
          <CardHeader>
            <CardTitle className="text-2xl text-[#0F172A]">
              Verifique seu e-mail
            </CardTitle>

            <CardDescription>
              As instruções para redefinir sua senha foram enviadas.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="text-sm leading-relaxed text-slate-600">
              Se existe uma conta cadastrada com esse endereço, você receberá
              um link para criar uma nova senha. Verifique também sua pasta de
              spam.
            </p>

            <Button asChild className="w-full bg-[#1769E8] hover:bg-blue-700">
              <Link href="/auth/login">Voltar para o login</Link>
            </Button>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-2xl text-[#0F172A]">
              Recuperar senha
            </CardTitle>

            <CardDescription>
              Informe seu e-mail para receber um link de redefinição de senha.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#1769E8] hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </div>

              <div className="mt-5 text-center text-sm text-slate-600">
                Lembrou sua senha?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#1769E8] hover:underline"
                >
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  );
}