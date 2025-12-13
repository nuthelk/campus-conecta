import React, { useState } from "react";
import {
  PlusCircle,
  Home as HomeIcon,
  User,
  LogOut,
  Menu,
  Milestone,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Sidebar Item Component using Button for consistent styling
const SidebarItem = ({
  icon,
  label,
  onClick,
  isCollapsed,
  isActive,
}: {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  isCollapsed?: boolean;
  isActive?: boolean;
}) => (
  <Button
    variant="ghost"
    className={`w-full cursor-pointer justify-start text-white hover:text-white hover:bg-white/10 ${
      isCollapsed ? "px-2 justify-center" : "px-4"
    } ${isActive ? "bg-white/20 border-l-4 border-white" : ""}`}
    onClick={onClick}
    title={label}
  >
    {icon}
    {!isCollapsed && label && (
      <span className="ml-3 font-medium truncate">{label}</span>
    )}
  </Button>
);

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      toast.error("Error al cerrar sesión");
    } else {
      toast.success("Sesión cerrada correctamente");
    }
  } catch (error) {
    console.error("Unexpected error signing out:", error);
    toast.error("Error al cerrar sesión");
  }
};

const SidebarContent = ({
  isCollapsed = false,
  onToggle,
}: {
  isCollapsed?: boolean;
  onToggle: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutWithNavigate = async () => {
    await handleLogout();
    navigate("/login");
  };

  // Función para determinar si un item está activo
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-full py-6">
      {/* Toggle / Logo Area */}
      <div
        className={`flex  items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        } mb-8 px-2`}
      >
        {!isCollapsed && (
          <span className="text-xl font-bold text-white pl-2">Menu</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white cursor-pointer hover:bg-white/10"
          onClick={onToggle}
          // Only functional in desktop mode for collapsing. In mobile sheet, this might just close the sheet or be hidden.
        >
          <Menu size={24} />
        </Button>
      </div>

      <div className="flex flex-col gap-2 px-2">
        <SidebarItem
          icon={<HomeIcon size={20} />}
          label="Inicio"
          onClick={() => navigate("/home")}
          isCollapsed={isCollapsed}
          isActive={isActive("/home")}
        />
        <SidebarItem
          icon={<User size={20} />}
          label="Perfil"
          onClick={() => navigate("/profile")}
          isCollapsed={isCollapsed}
          isActive={isActive("/profile")}
        />
        <SidebarItem
          icon={<Milestone size={20} />}
          onClick={() => navigate("/posts")}
          label="Publicaciones"
          isCollapsed={isCollapsed}
          isActive={isActive("/posts")}
        />
        <div className="my-2 px-2">
          <Separator className="bg-white/20" />
        </div>
        <SidebarItem
          icon={<PlusCircle size={20} />}
          label="Crear publicación"
          isCollapsed={isCollapsed}
          onClick={() => navigate("/create-post")}
          isActive={isActive("/create-post")}
        />
      </div>

      <div className="mt-auto px-2 ">
        <SidebarItem
          icon={<LogOut size={20} />}
          label="Cerrar sesión"
          isCollapsed={isCollapsed}
          onClick={handleLogoutWithNavigate}
        />
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Función para determinar si un item está activo
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#1B003A] h-full transition-all duration-300 ease-in-out shadow-xl z-20 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <SidebarContent
          isCollapsed={!isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-[#1a1b4b] border-none text-white hover:bg-[#1a1b4b]/90"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 border-r-0 w-72 bg-[#1a1b4b] text-white"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu de Navegación</SheetTitle>
            </SheetHeader>
            {/* Reusing content but forced open state for mobile menu */}
            <div className="flex flex-col h-full py-6">
              <div className="flex items-center justify-start mb-8 px-6">
                <span className="text-xl font-bold text-white">Menu</span>
              </div>
              <div className="flex flex-col gap-2 px-2">
                <SidebarItem
                  icon={<HomeIcon size={20} />}
                  label="Inicio"
                  onClick={() => navigate("/home")}
                  isCollapsed={false}
                  isActive={isActive("/home")}
                />
                <SidebarItem
                  icon={<User size={20} />}
                  label="Perfil"
                  onClick={() => navigate("/profile")}
                  isCollapsed={false}
                  isActive={isActive("/profile")}
                />
                <div className="my-2 px-2">
                  <Separator className="bg-white/20" />
                </div>
                <SidebarItem
                  icon={<PlusCircle size={20} />}
                  label="Crear publicación"
                  isCollapsed={false}
                  isActive={isActive("/create-post")}
                />
                <SidebarItem
                  icon={<Milestone size={20} />}
                  label="Publicaciones"
                  onClick={() => navigate("/posts")}
                  isCollapsed={false}
                  isActive={isActive("/posts")}
                />
              </div>
              <div className="mt-auto px-2">
                <SidebarItem
                  icon={<LogOut size={20} />}
                  label="Cerrar sesión"
                  isCollapsed={false}
                  onClick={handleLogout}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
