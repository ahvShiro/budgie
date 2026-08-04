import { PasswordInput } from "@/components/PasswordInput";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
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
import AuthService from "@/services/AuthService";
import type { ApiErrorMessage } from "@/services/types";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { initialValues, signinSchema, type Fields } from "./Signin.validation";
import { toFieldErrors, type FieldErrors } from "@/lib/validationErrors";

export const Signin = () => {
const [fields, setFields] = useState<Fields>(initialValues);
const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = () => {
    const result = signinSchema.safeParse(fields);
    setFieldErrors(result.success ? {} : toFieldErrors<Fields>(result.error));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = signinSchema.safeParse(fields);

    if (!result.success) {
        setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    try {
      await AuthService.register(result.data);
      toast.success("Conta criada com sucesso!");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError<ApiErrorMessage>(err) && err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Erro inesperado");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
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
                  value={fields.name}
                  name="name"
                  onChange={handleChange}
                ></Input>
                <FieldError
                  errors={
                    fieldErrors.name ? [{ message: fieldErrors.name }] : []
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Insira seu email"
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Input>
                <FieldError
                  errors={
                    fieldErrors.email ? [{ message: fieldErrors.email }] : []
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <PasswordInput
                  value={fields.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="password"
                />
                <FieldError
                  errors={
                    fieldErrors.password
                      ? [{ message: fieldErrors.password }]
                      : []
                  }
                />

                <PasswordStrengthMeter password={fields.password} />
              </Field>
              <Field>
                <FieldLabel htmlFor="passwordConfirmation">
                  Confirmação da senha
                </FieldLabel>
                <PasswordInput
                  value={fields.passwordConfirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="passwordConfirmation"
                />
                <FieldError
                  errors={
                    fieldErrors.passwordConfirmation
                      ? [{ message: fieldErrors.passwordConfirmation }]
                      : []
                  }
                />
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
        </form>
      </div>
    </main>
  );
};
