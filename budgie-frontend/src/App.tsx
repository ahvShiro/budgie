import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Signin } from './pages/Signin/Signin';
import { Login } from './pages/Login/Login';
import { PasswordRecover } from './pages/PasswordRecover';
import { PasswordReset } from './pages/PasswordReset/PasswordReset';
import { Toaster } from 'sonner';
import { NotFound } from './pages/NotFound/NotFound';
import { Support } from '@/pages/Support/Support.tsx';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { AppLayout } from './components/AppLayout';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';
import { session } from './services/session';

function App() {
  // TODO orquestrar páginas e adicionar fluxo
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={session.isAuthenticated() ? '/app/dashboard' : '/login'}
                replace
              />
            }
          />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/register" element={<Signin />} />
          <Route path="/recuperar-senha" element={<PasswordRecover />} />
          <Route path="/redefinir-senha/:token?" element={<PasswordReset />} />

          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/app/dashboard" element={<Dashboard />} />
              <Route path="/app/perfil/senha" element={<div />} />
              <Route path="/suporte" element={<Support />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </>
  );
}

export default App;
