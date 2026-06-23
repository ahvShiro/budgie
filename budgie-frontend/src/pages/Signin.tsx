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

export function Signin() {
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
                type="name"
                id="name"
                placeholder="Insira seu nome"
              ></Input>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                id="email"
                placeholder="Insira seu email"
              ></Input>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>

              <Input
                type="password"
                id="password"
                placeholder="Insira uma senha forte"
              ></Input>

              <div className="space-y-1">
                <div className="flex gap-1">
                  <div className="h-1 flex-1 rounded-full transition-colors bg-gray-500"></div>
                  <div className="h-1 flex-1 rounded-full transition-colors bg-gray-500"></div>
                  <div className="h-1 flex-1 rounded-full transition-colors bg-gray-500"></div>
                  <div className="h-1 flex-1 rounded-full transition-colors bg-gray-500"></div>
                </div>
                <p className="text-muted-foreground text-xs">
                  Insira uma senha
                </p>
              </div>

            </Field>

            <Field>
              <FieldLabel htmlFor="password">Confirmação da senha</FieldLabel>

              <Input
                type="password"
                id="password"
                placeholder="Insira uma senha forte"
              ></Input>
            </Field>

            <Field>
              <Button type="submit" className="mt-4">
                Criar sua conta
              </Button>

              <FieldDescription className="text-center">
                Já tem uma conta? <a href="#">Entrar agora.</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </main>
  );
}
