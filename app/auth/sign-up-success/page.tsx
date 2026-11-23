import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth-layout";

export default function Page() {
  return (
    <AuthLayout>
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-[#0F172A]">
            Cadastro realizado!
          </CardTitle>
          <CardDescription>
            Falta apenas confirmar seu endereço de e-mail.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <p className="text-sm leading-relaxed text-slate-600">
            Enviamos uma mensagem para o e-mail informado. Acesse sua caixa de
            entrada e clique no link de confirmação para ativar sua conta.
            Caso não encontre a mensagem, verifique também a pasta de spam.
          </p>

          <Button asChild className="w-full bg-[#1769E8] hover:bg-blue-700">
            <Link href="/auth/login">Ir para o login</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}