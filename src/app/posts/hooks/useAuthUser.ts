import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useAuthUser = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    getCurrentUser();
  }, []);

  return user;
};
