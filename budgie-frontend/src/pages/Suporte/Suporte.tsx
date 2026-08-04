import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/configs/env";
import { useNavigate } from "react-router-dom";

const SUPPORT_PHONE_DISPLAY = "00 98765-4321";
const SUPPORT_PHONE_DIAL = "0098765432";

export const Suporte = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center min-h-screen justify-center p-6 gap-4">
      <h1 className="text-4xl font-extrabold">Suporte</h1>

      <div className="flex items-center justify-center flex-col">
        <p className="text-lg pt-6 ">
          Precisa de ajuda? Entre em contato pelo email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-current/75 hover:text-current/100">
            {SUPPORT_EMAIL}
          </a>
          , ou abra uma issue no GitHub no{" "}
          <a href="https://github.com/ahvShiro/budgie" className="underline text-current/75 hover:text-current/100">
            repositório
          </a>
          .
        </p>
      </div>

      <div className="flex gap-4 pt-6">
        <Button variant={"outline"} onClick={() => { navigate(-1) }}>Voltar para a página anterior</Button>
        <Button onClick={() => { navigate("/app/dashboard") }}>Ir para a página principal</Button>
      </div>
    </main>
  );
};
