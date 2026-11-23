
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const message = error.message.toLowerCase();

        if (message.includes("invalid login")) {
          throw new Error("E-mail ou senha incorretos.");
        }

        if (message.includes("email not confirmed")) {
          throw new Error("Confirme seu e-mail antes de entrar.");
        }

        throw new Error("Não foi possível entrar. Verifique seus dados e tente novamente.");
      }

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const { data: profile } = userId
        ? await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .maybeSingle()
        : { data: null };

      router.replace(profile?.role === "professional" ? "/profissional" : "/cliente");
      router.refresh();
    } catch {
      setError("Não foi possível realizar o login. Verifique seus dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-[#0F172A]">
          Bem-vindo de volta!
        </CardTitle>

        <CardDescription>
          Entre na sua conta para continuar utilizando a Conecta.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin}>
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

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[#1769E8] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          <div className="mt-5 text-center text-sm text-slate-600">
            Ainda não tem uma conta?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-[#1769E8] hover:underline"
            >
              Cadastre-se
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
