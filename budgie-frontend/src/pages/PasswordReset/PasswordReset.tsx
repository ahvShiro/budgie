import { ExpiredPasswordRedefinitionToken } from "@/components/ExpiredPasswordRedefinitionToken";
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
import { SUPPORT_EMAIL } from "@/configs/env";
import { buildSupportUrl } from "@/lib/utils";
import { toFieldErrors, type FieldErrors } from "@/lib/validationErrors";
import AuthService from "@/services/AuthService";
import type { ApiErrorMessage } from "@/services/types";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  initialValues,
  resetSchema,
  type Fields,
} from "./PasswordReset.validation";

export const PasswordReset = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [fields, setFields] = useState<Fields>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});

  if (!token) return <ExpiredPasswordRedefinitionToken />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = resetSchema.safeParse(fields);

    if (!result.success) {
      setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    try {
      const { message } = await AuthService.resetPassword({
        token,
        ...result.data,
      });
      toast.success(message);
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
            <FieldLegend>Redefinir senha</FieldLegend>
            <FieldDescription>
              Insira uma senha forte e confirme sua senha repetindo-a para
              redefinir sua senha antiga.
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="newPassword">Senha</FieldLabel>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  value={fields.newPassword}
                  onChange={handleChange}
                />
                <FieldError
                  errors={
                    fieldErrors.newPassword
                      ? [{ message: fieldErrors.newPassword }]
                      : []
                  }
                />
                <PasswordStrengthMeter password={fields.newPassword} />
              </Field>

              <Field>
                <FieldLabel htmlFor="newPasswordConfirmation">
                  Confirmação da senha
                </FieldLabel>
                <PasswordInput
                  id="newPasswordConfirmation"
                  name="newPasswordConfirmation"
                  value={fields.newPasswordConfirmation}
                  onChange={handleChange}
                />
                <FieldError
                  errors={
                    fieldErrors.newPasswordConfirmation
                      ? [{ message: fieldErrors.newPasswordConfirmation }]
                      : []
                  }
                />
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
        </form>
      </div>
    </main>
  );
};
