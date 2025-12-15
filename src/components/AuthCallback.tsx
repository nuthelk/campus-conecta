import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Esperar un momento a que Supabase procese el callback
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Si hay sesión, redirigir al home
          navigate("/home", { replace: true });
        } else {
          // Si no hay sesión, redirigir al login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error en callback de autenticación:", error);
        navigate("/login", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
