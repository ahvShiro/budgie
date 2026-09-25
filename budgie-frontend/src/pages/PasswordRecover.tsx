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
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Campo email é obrigatório")
  .pipe(z.email('E-mail inválido'));

export const PasswordRecover = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { message } = await AuthService.recoverPassword({ email: result.data });
      toast.success(message, { duration: 10000 });
      
    } catch (err) {
      if (axios.isAxiosError<ApiErrorMessage>(err) && err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Erro inesperado");
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
            <FieldLegend>Redefinir senha</FieldLegend>
            <FieldDescription>
              Insira o email utilizado para a criação da sua conta. Enviaremos um
              código de recuperação em seu email para que você possa alterar sua
              senha. Lembrou sua senha? <Link to="/login">Entrar na sua conta.</Link>
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Insira seu email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(undefined);
                  }}
                ></Input>
                <FieldError errors={error ? [{ message: error }] : []} />
              </Field>

              <Field>
                <Button type="submit" className="mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar código de recuperação"}
                </Button>

                <FieldDescription className="text-center">
                  Precisa de ajuda?{" "}
                  <Link to="/suporte">
                    Entre em contato com o suporte.
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </main>
  );
};
