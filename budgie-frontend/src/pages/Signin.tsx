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
import { useState } from "react";
import { Link } from "react-router-dom";

export function Signin() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full sm:max-w-md">
        <FieldSet>
          <FieldLegend>Crie sua conta</FieldLegend>
          <FieldDescription>
            Insira seus dados para criar uma conta nova no sistema
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                type="text"
                id="name"
                placeholder="Insira seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Input>
            </Field>

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
                Criar sua conta
              </Button>

              <FieldDescription className="text-center">
                Já tem uma conta? <Link to="/login">Entrar agora.</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </main>
  );
}
