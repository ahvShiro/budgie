import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initialValues, loginSchema, type Fields } from "./Login.validation";
import axios from "axios";
import { toast } from "sonner";
import AuthService from "@/services/AuthService";
import { session } from "@/services/session";
import type { ApiErrorMessage } from "@/services/types";
import { toFieldErrors, type FieldErrors } from "@/lib/validationErrors";

export const Login = () => {
  const [fields, setFields] = useState<Fields>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(fields);

    if (!result.success) {
      setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    setIsSubmitting(true);

    try {
      const { token } = await AuthService.authenticate(result.data);

      session.setToken(token);

      toast.success("Usuário autenticado com sucesso!");

      navigate("/app/dashboard");
    } catch (err) {
      if (axios.isAxiosError<ApiErrorMessage>(err) && err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Erro inesperado, contate o admin");
      }
    } finally {
      setIsSubmitting(false);
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
                <FieldError
                  errors={
                    fieldErrors.email ? [{ message: fieldErrors.email }] : []
                  }
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <FieldDescription className="ml-auto">
                    <Link to="/recuperar-senha">Esqueceu a senha?</Link>
                  </FieldDescription>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Insira sua senha"
                  name="password"
                  value={fields.password}
                  onChange={handleChange}
                />
                <FieldError
                  errors={
                    fieldErrors.password
                      ? [{ message: fieldErrors.password }]
                      : []
                  }
                />
              </Field>

              <Field>
                <Button type="submit" className="mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Entrando..." : "Entrar na conta"}
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
