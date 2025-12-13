import { supabase } from "@/lib/supabase";

export const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("perfiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (error) {
      // Si el error es que no se encontró el registro, el usuario no existe
      if (error.code === "PGRST116") {
        return false;
      }
      console.error("Error checking user existence:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
};
