import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/Signin/Signin";
import { Login } from "./pages/Login";
import { PasswordRecover } from "./pages/PasswordRecover";
import { PasswordReset } from "./pages/PasswordReset";
import { Toaster } from "sonner";

function App() {
  // TODO orquestrar páginas e adicionar fluxo
  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signin />} />
            <Route path="/recuperar-senha" element={<PasswordRecover />} />
            <Route path="/redefinir-senha" element={<PasswordReset />} />
            <Route path="/app/perfil/senha" element={<div />} />
            <Route path="/app/dashboard" element={<div />} />
        </Routes>
    </BrowserRouter>
    <Toaster richColors/>

    </>
);
}

export default App;
