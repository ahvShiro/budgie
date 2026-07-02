import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Login } from "./pages/Login";

function App() {
  // TODO orquestrar páginas e adicionar fluxo
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signin />} />
            <Route path="/recuperar-senha" element={<div />} />
            <Route path="/app/perfil/senha" element={<div />} />
            <Route path="/app/dashboard" element={<div />} />
        </Routes>
    </BrowserRouter>
);
}

export default App;
