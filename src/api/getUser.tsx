import { supabase } from "@/lib/supabase";

export const getUser = async (id: string) => {
    const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', id)
        .order('creado_en', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    return data;
}