import { toast } from "sonner";
import { useState } from "react";
import Logo from "../../../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import FloatingLabelInput from "../../../components/FloatingLabelInput";
import GoogleButton from "../../../components/GoogleButton";
import { supabase } from "../../../lib/supabase";


const FormRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async () => {
    setIsLoading(true);
    const { email, password, nombre, apellido } = formData;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from("perfiles").insert({
          id: data.user.id,
          nombre,
          apellido,
          correo: email,
          estado_carrera: "activo", // Default state or logic
          avatar_url: "",
        });

        if (profileError) throw profileError;

        toast.success(
          "Cuenta creada exitosamente. Por favor verifica tu correo.",
          {
            description: "Te hemos enviado un enlace de confirmación.",
          }
        );

        // Wait a bit so user can read the toast before redirecting
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      toast.error("Error al registrar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full lg:w-[40%] flex flex-col justify-center items-center bg-white px-8 lg:px-16 overflow-y-auto ">
      {/* Header */}
      <div className="w-full max-w-md flex flex-col items-center mb-8">
        <div className="flex flex-col items-center">
          <img
            src={Logo}
            alt="Campus Conecta Logo"
            className="h-40 object-contain "
          />
        </div>

        <div className="w-full -mt-4 text-left">
          <p className="text-gray-600 text-sm mb-1">Comienza tu viaje</p>
          <h1 className="text-[#1a1b4b] text-3xl font-bold leading-tight">
            Registrate en
            <br />
            Campus Conecta
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-4">
          <FloatingLabelInput
            id="nombre"
            label="Nombre"
            type="text"
            placeholder="Juan"
            value={formData.nombre}
            onChange={handleChange}
          />
          <FloatingLabelInput
            id="apellido"
            label="Apellido"
            type="text"
            placeholder="Perez"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>

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
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full h-12 bg-[#4F82C0] hover:bg-[#4a75ac] text-white font-medium rounded-md transition-colors shadow-sm mt-4 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Registrando..." : "Registrate"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-8">
          <div className="h-px bg-gray-200 w-full absolute"></div>
          <span className="bg-white px-4 text-gray-300 text-sm relative z-10">
            O registrate con
          </span>
        </div>

        {/* Social Login */}
        <div className="flex justify-center ">
          <GoogleButton />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-gray-500 text-sm">
        ¿Tienes una cuenta?{" "}
        <Link to="/login" className="text-[#6923d0] font-bold hover:underline">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
};

export default FormRegister;
