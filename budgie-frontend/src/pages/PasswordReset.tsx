import { PasswordInput } from "@/components/PasswordInput";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
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
// TODO ADICIONAR O TOAST DO SONNER PRA CONFIRMAR QUE O EMAIL FOI ENVIADO
export const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full sm:max-w-md">
        <FieldSet>
          <FieldLegend>Redefinir senha</FieldLegend>
          <FieldDescription>
            Insira uma senha forte e confirme sua senha repetindo-a para
            redefinir sua senha antiga.
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>

              <PasswordInput
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />

              <PasswordStrengthMeter password={password} />
            </Field>

            <Field>
              <FieldLabel htmlFor="passwordConfirmation">
                Confirmação da senha
              </FieldLabel>

              <Input
                type="password"
                id="passwordConfirmation"
                placeholder="Repita a senha"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              ></Input>
            </Field>

            <Field>
              <Button type="submit" className="mt-4">
                Redefinir senha
              </Button>

              <FieldDescription className="text-center">
                Precisa de ajuda?{" "}
                <a
                  href={buildSupportUrl({
                    email: SUPPORT_EMAIL,
                    subject: "Budgie - Suporte com redefinição de senha",
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
