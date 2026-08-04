import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const ExpiredPasswordRedefinitionToken = () => {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Link inválido</h1>
      <p className="text-muted-foreground max-w-sm">
        O link de redefinição de senha está incompleto ou expirou. Solicite um
        novo para continuar
      </p>
      <Button asChild className="mt-2">
        <Link to="/recuperar-senha">Solicitar novo link</Link>
      </Button>
    </main>
  );
};
