import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/sonner";

export const Layout = () => {
  return (
    <main>
      <Outlet />
      <Toaster />
    </main>
  );
};
