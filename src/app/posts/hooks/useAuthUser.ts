import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useAuthUser = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
