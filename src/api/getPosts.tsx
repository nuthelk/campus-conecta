import { supabase } from "@/lib/supabase";

export const getPosts = async () => {
    const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .order('creado_en', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    return data;
}


