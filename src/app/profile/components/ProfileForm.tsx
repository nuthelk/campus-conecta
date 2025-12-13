import React, { useState, useEffect } from "react";
import { User, Camera, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useAuthUser } from "@/app/posts/hooks/useAuthUser";
import { getUser } from "@/api/getUser";
import { supabase } from "@/lib/supabase";
import type { Perfil, EstadoCarrera } from "@/types/User";
import { toast } from "sonner";

export const ProfileForm: React.FC = () => {
  const authUser = useAuthUser();
  const [profile, setProfile] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      if (authUser?.id) {
        try {
          const profiles = await getUser(authUser.id);
          if (profiles.length > 0) {
            setProfile(profiles[0]);
            if (profiles[0].avatar_url) {
              setAvatarPreview(profiles[0].avatar_url);
            }
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          toast.error("Error al cargar el perfil");
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [authUser]);

  const handleInputChange = (
    field: keyof Perfil,
    value: string | number | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (profile) {
      const finalValue = typeof value === "object" ? value.target.value : value;
      setProfile({ ...profile, [field]: finalValue });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no puede ser mayor a 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("El archivo debe ser una imagen");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${authUser?.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        toast.error(
          "No tienes permisos para subir archivos. Contacta al administrador."
        );
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("files").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error al subir la imagen de perfil");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !authUser?.id) return;

    setSaving(true);
    try {
      let avatarUrl = profile.avatar_url;
      let avatarUploadFailed = false;

      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          avatarUploadFailed = true;
        }
      }

      const { error } = await supabase
        .from("perfiles")
        .update({
          ...profile,
          avatar_url: avatarUrl,
          actualizado_en: new Date().toISOString(),
        })
        .eq("id", authUser.id);

      if (error) throw error;

      setProfile({ ...profile, avatar_url: avatarUrl });
      setAvatarFile(null);

      if (avatarUploadFailed) {
        toast.warning(
          "Perfil actualizado, pero la imagen no pudo ser guardada. Intenta con la imagen más tarde."
        );
      } else {
        toast.success("Perfil actualizado correctamente");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (profile) {
      setProfile({ ...profile, avatar_url: null });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
          >
            <Camera size={20} />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        {avatarPreview && (
          <button
            type="button"
            onClick={removeAvatar}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X size={16} />
            Eliminar foto
          </button>
        )}
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          label="Nombre"
          value={profile.nombre}
          onChange={(value) => handleInputChange("nombre", value)}
          required
        />
        <FloatingLabelInput
          label="Apellido"
          value={profile.apellido}
          onChange={(value) => handleInputChange("apellido", value)}
          required
        />
        <FloatingLabelInput
          label="Correo electrónico"
          type="email"
          value={profile.correo}
          onChange={(value) => handleInputChange("correo", value)}
          required
        />
        <FloatingLabelInput
          label="Teléfono"
          type="tel"
          value={profile.telefono || ""}
          onChange={(value) => handleInputChange("telefono", value)}
        />
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          label="Fecha de nacimiento"
          type="date"
          value={profile.fecha_nacimiento?.split("T")[0] || ""}
          onChange={(value) => handleInputChange("fecha_nacimiento", value)}
        />
        <FloatingLabelInput
          label="Universidad"
          value={profile.universidad || ""}
          onChange={(value) => handleInputChange("universidad", value)}
        />
        <FloatingLabelInput
          label="Carrera"
          value={profile.carrera || ""}
          onChange={(value) => handleInputChange("carrera", value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado de la carrera
          </label>
          <select
            value={profile.estado_carrera || ""}
            onChange={(e) =>
              handleInputChange(
                "estado_carrera",
                e.target.value as EstadoCarrera
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Seleccionar estado</option>
            <option value="activo">Activo</option>
            <option value="egresado">Egresado</option>
            <option value="pausado">Pausado</option>
          </select>
        </div>
        <FloatingLabelInput
          label="Semestre"
          type="number"
          min="1"
          max="20"
          value={profile.semestre || ""}
          onChange={(e) =>
            handleInputChange("semestre", parseInt(e.target.value) || 0)
          }
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center gap-2"
        >
          <Save size={20} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
};
