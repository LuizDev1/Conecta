import Link from "next/link";
import { AuthLayout } from "@/components/auth-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <AuthLayout>
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-[#0F172A]">
            Não foi possível concluir a operação
          </CardTitle>

          <CardDescription>
            O link pode ter expirado ou já ter sido utilizado.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <p className="text-sm leading-relaxed text-slate-600">
            Tente novamente. Se o problema continuar, solicite um novo link de
            confirmação ou entre em contato com o suporte.
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full bg-[#1769E8] hover:bg-blue-700">
              <Link href="/auth/sign-up">Criar uma conta</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Voltar para o login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}