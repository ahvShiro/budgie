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
import type { Fields } from "./types";
import axios from "axios";
import { toast } from "sonner";

export const Login = () => {
  const [fields, setFields] = useState<Fields>({});

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    console.log(fields);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      toast.success("Olá, nome!", {description: "Logado com sucesso"});
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Erro inesperado, contate o admin");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
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
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                ></Input>
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <FieldDescription className="ml-auto">
                    <Link to="/recuperar-senha">Esqueceu a senha?</Link>
                  </FieldDescription>
                </div>
                <Input
                  type="password"
                  id="password"
                  placeholder="Insira sua senha"
                  name="password"
                  value={fields.password}
                  onChange={handleChange}
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
        </form>
      </div>
    </main>
  );
};
