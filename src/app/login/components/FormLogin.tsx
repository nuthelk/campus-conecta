import { toast } from "sonner";
import { useState } from "react";
import Logo from "../../../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { checkUserExists } from "../../../api/checkUserExists";
import FloatingLabelInput from "../../../components/FloatingLabelInput";

const FormLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const { email, password } = formData;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Verificar si el usuario existe en la tabla perfiles
        const userExists = await checkUserExists(data.user.id);

        if (!userExists) {
          // Si el usuario no existe en perfiles, cerrar sesión y redirigir a registro
          await supabase.auth.signOut();
          toast.error(
            "Tu cuenta no está registrada. Por favor completa tu registro."
          );
          navigate("/register");
          return;
        }

        navigate("/home");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error signing in:", errorMessage);
      toast.error("Credenciales incorrectas. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full lg:w-[40%] flex flex-col justify-center items-center bg-white px-8 lg:px-16">
      {/* Header */}
      <div className="w-full max-w-md flex flex-col items-center mb-8">
        <div className="flex flex-col items-center">
          <img
            src={Logo}
            alt="Campus Conecta Logo"
            className="h-40 object-contain mb-2"
          />
        </div>

        <div className="w-full text-left">
          <p className="text-gray-600 text-sm mb-1">Comparte tu conocimiento</p>
          <h1 className="text-[#1a1b4b] text-3xl font-bold leading-tight">
            Inicia sesión en
            <br />
            Campus Conecta
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-6">
        {/* Email Input */}
        <FloatingLabelInput
          id="email"
          label="Correo"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password Input */}
        <FloatingLabelInput
          id="password"
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          placeholder="* * * * * * *"
          value={formData.password}
          onChange={handleChange}
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full h-12 bg-[#4F82C0] hover:bg-[#4a75ac] text-white font-medium rounded-md transition-colors shadow-sm mt-4 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        {/* Divider */}
        {/* <div className="relative flex items-center justify-center my-8">
          <div className="h-px bg-gray-200 w-full absolute"></div>
          <span className="bg-white px-4 text-gray-300 text-sm relative z-10">
            O inicia sesión con
          </span>
        </div> */}

        {/* Social Login */}
        {/* <div className="flex justify-center ">
          <GoogleButton />
        </div> */}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-gray-500 text-sm">
        ¿No tienes cuenta?{" "}
        <Link
          to="/register"
          className="text-[#6923d0] font-bold hover:underline"
        >
          Registrate
        </Link>
      </div>
    </div>
  );
};

export default FormLogin;
