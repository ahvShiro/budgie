import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();
  return (
    <main className="flex flex-col items-center min-h-screen justify-center p-6 gap-4">
            <h1 className="text-9xl font-extrabold">404</h1>
            <h2 className="text-4xl font-extrabold">Página não encontrada</h2>

            <div className="flex items-center justify-center flex-col">
                <p className="text-lg pt-6 ">
                    A página que você tentou acessar <b>não existe</b> ou <b>não foi encontrada</b>.
                    Se você acha que isso é um erro, <Link to="/suporte" className="underline text-current/75 hover:text-current/100">contate o nosso suporte</Link>.
                </p>
            </div>
            
            <div className="flex gap-4 pt-6">
                <Button variant={'outline'} onClick={() => {navigate(-1)}}>Voltar para a página anterior</Button>
                <Button onClick={() => {navigate("/app/dashboard")}}>Ir para a página principal</Button>
            </div>
    </main>
  );
};
