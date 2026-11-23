"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

type UserRole = "customer" | "professional";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim();

    if (normalizedName.length < 3) {
      setError("Informe seu nome completo.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== repeatPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: normalizedName,
            role,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/protected`,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          throw new Error("Este e-mail já possui uma conta cadastrada.");
        }

        throw new Error("Não foi possível criar sua conta. Tente novamente.");
      }

      router.push("/auth/sign-up-success");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao criar sua conta. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-[#0F172A]">
          Crie sua conta
        </CardTitle>

        <CardDescription>
          Faça parte da Conecta e encontre soluções para seus serviços de
          tecnologia.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignUp}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Nome completo</Label>

              <Input
                id="full-name"
                type="text"
                placeholder="Seu nome completo"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

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
              <Label htmlFor="role">Como deseja utilizar a Conecta?</Label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#1769E8]"
              >
                <option value="customer">
                  Sou cliente — quero contratar serviços
                </option>

                <option value="professional">
                  Sou profissional — quero oferecer serviços
                </option>
              </select>

              <p className="text-xs text-slate-500">
                Essa escolha define o tipo da sua conta.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>

              <Input
                id="password"
                type="password"
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeat-password">Confirmar senha</Label>

              <Input
                id="repeat-password"
                type="password"
                placeholder="Digite sua senha novamente"
                autoComplete="new-password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
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
              {isLoading ? "Criando sua conta..." : "Criar conta"}
            </Button>
          </div>

          <div className="mt-5 text-center text-sm text-slate-600">
            Já possui uma conta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#1769E8] hover:underline"
            >
              Entrar
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}