import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../firebase";
import { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="text-center p-10">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
