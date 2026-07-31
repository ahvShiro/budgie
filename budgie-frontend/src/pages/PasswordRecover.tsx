import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SUPPORT_EMAIL } from "@/configs/env";
import { buildSupportUrl } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export const PasswordRecover = () => {
  const [email, setEmail] = useState("");

  const handleClick = () => {
    // EMAIL SENDING STUFF HERE
    toast.success("Email enviado!", {
      description:
        "Acesse o link no email para redefinir sua senha. Caso não tenha recebido, cheque a caixa de spam ou tente enviar novamente",
      duration: 5000,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full sm:max-w-md">
        <FieldSet>
          <FieldLegend>Redefinir senha</FieldLegend>
          <FieldDescription>
            Insira o email utilizado para a criação da sua conta. Enviaremos um
            código de recuperação em seu email para que você possa alterar sua
            senha.
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                id="email"
                placeholder="Insira seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
            </Field>

            <Field>
              <Button
                type="submit"
                onClick={handleClick}
                className="mt-4"
                disabled={email.length == 0}
              >
                Enviar código de recuperação
              </Button>

              <FieldDescription className="text-center">
                Precisa de ajuda?{" "}
                <a
                  href={buildSupportUrl({
                    email: SUPPORT_EMAIL,
                    subject: "Budgie - Suporte com recuperação de senha",
                  })}
                >
                  Entre em contato com o suporte.
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </main>
  );
};
