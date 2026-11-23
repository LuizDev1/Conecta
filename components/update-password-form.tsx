"use client";

import { useState, type FormEvent } from "react";
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

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

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

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw new Error(
          "Não foi possível atualizar sua senha. Solicite um novo link de recuperação.",
        );
      }

      router.push("/auth/login");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao atualizar sua senha.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-[#0F172A]">
          Crie uma nova senha
        </CardTitle>

        <CardDescription>
          Escolha uma senha segura para acessar sua conta.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleUpdatePassword}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="password">Nova senha</Label>

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
              <Label htmlFor="repeat-password">Confirmar nova senha</Label>

              <Input
                id="repeat-password"
                type="password"
                placeholder="Digite a nova senha novamente"
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
              {isLoading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}