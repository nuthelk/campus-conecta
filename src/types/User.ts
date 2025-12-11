export type EstadoCarrera = "activo" | "egresado" | "pausado";

export interface Perfil {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
  fecha_nacimiento?: string | null; // Date en formato string ISO
  universidad?: string | null;
  carrera?: string | null;
  estado_carrera?: EstadoCarrera | null;
  semestre?: number | null;
  avatar_url?: string | null;
  cantidad_publicaciones?: number | null;
  creado_en?: string; // Timestamp en formato string ISO
  actualizado_en?: string; // Timestamp en formato string ISO
}
