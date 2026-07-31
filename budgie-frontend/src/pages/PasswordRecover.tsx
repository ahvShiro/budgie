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
import { useState } from "react";


export const PasswordRecover = () => {

  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full sm:max-w-md">
        <FieldSet>
          <FieldLegend>Redefinir senha</FieldLegend>
          <FieldDescription>
            Insira o email utilizado para a criação da sua conta. Enviaremos um código de recuperação em seu email para que você possa alterar sua senha.
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
              <Button type="submit" className="mt-4" disabled={email.length == 0}>
                Enviar código de recuperação
              </Button>

              <FieldDescription className="text-center">
                Precisa de ajuda? <a href="mailto:arthurshiro123@gmail.com">Entre em contato com o suporte.</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </main>
  );
};
