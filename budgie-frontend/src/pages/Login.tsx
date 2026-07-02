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
import { Link } from "react-router-dom";

export function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full sm:max-w-md">
        <FieldSet>
          <FieldLegend>Entrar na sua conta</FieldLegend>
          <FieldDescription>
            Insira seus dados para ter acesso ao sistema
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                id="email"
                placeholder="Insira seu email"
              ></Input>
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldDescription className="ml-auto">
                  <a
                  href="#"
                  className="text-sm hover:underline"
                >
                  Esqueceu a senha?
                </a>
                </FieldDescription>
                
              </div>
              <Input
                type="password"
                id="password"
                placeholder="Insira sua senha"
              ></Input>
            </Field>

            <Field>
              <Button type="submit" className="mt-4">
                Entrar na conta
              </Button>

              <FieldDescription className="text-center">
                Não tem uma conta? <Link to="/register">Crie uma agora.</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </main>
  );
}
