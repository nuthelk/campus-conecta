import React, { useState } from "react";
import {
    PlusCircle,
    Edit,
    Trash2,
    FileText,
    Home as HomeIcon,
    User,
    LogOut,
    Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "./ui/sheet";
import { Separator } from "./ui/separator";

// Sidebar Item Component using Button for consistent styling
const SidebarItem = ({ icon, label, onClick, isCollapsed }: { icon: React.ReactNode; label?: string; onClick?: () => void; isCollapsed?: boolean }) => (
    <Button
        variant="ghost"
        className={`w-full justify-start text-white hover:text-white hover:bg-white/10 ${isCollapsed ? "px-2 justify-center" : "px-4"}`}
        onClick={onClick}
        title={label}
    >
        {icon}
        {!isCollapsed && label && <span className="ml-3 font-medium truncate">{label}</span>}
    </Button>
);

const SidebarContent = ({ isCollapsed = false, onToggle }: { isCollapsed?: boolean; onToggle: () => void }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full py-6">
            {/* Toggle / Logo Area */}
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} mb-8 px-2`}>
                {!isCollapsed && <span className="text-xl font-bold text-white pl-2">Menu</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={onToggle}
                // Only functional in desktop mode for collapsing. In mobile sheet, this might just close the sheet or be hidden.
                >
                    <Menu size={24} />
                </Button>
            </div>

            <div className="flex flex-col gap-2 px-2">
                <SidebarItem icon={<HomeIcon size={20} />} label="Inicio" onClick={() => navigate("/home")} isCollapsed={isCollapsed} />
                <SidebarItem icon={<User size={20} />} label="Perfil" isCollapsed={isCollapsed} />
                <div className="my-2 px-2">
                    <Separator className="bg-white/20" />
                </div>
                <SidebarItem icon={<PlusCircle size={20} />} label="Crear publicación" isCollapsed={isCollapsed} onClick={() => navigate("/create-post")} />

            </div>

            <div className="mt-auto px-2">
                <SidebarItem
                    icon={<LogOut size={20} />}
                    label="Cerrar sesión"
                    isCollapsed={isCollapsed}
                    onClick={() => navigate("/")}
                />
            </div>
        </div>
    );
};

export const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();



    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col bg-[#1B003A] h-full transition-all duration-300 ease-in-out shadow-xl z-20 ${isSidebarOpen ? "w-64" : "w-20"
                    }`}
            >
                <SidebarContent isCollapsed={!isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-[#1a1b4b] border-none text-white hover:bg-[#1a1b4b]/90">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r-0 w-72 bg-[#1a1b4b] text-white">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Menu de Navegación</SheetTitle>
                        </SheetHeader>
                        {/* Reusing content but forced open state for mobile menu */}
                        <div className="flex flex-col h-full py-6">
                            <div className="flex items-center justify-start mb-8 px-6">
                                <span className="text-xl font-bold text-white">Menu</span>
                            </div>
                            <div className="flex flex-col gap-2 px-2">
                                <SidebarItem icon={<HomeIcon size={20} />} label="Inicio" onClick={() => navigate("/home")} isCollapsed={false} />
                                <SidebarItem icon={<User size={20} />} label="Perfil" isCollapsed={false} />
                                <div className="my-2 px-2">
                                    <Separator className="bg-white/20" />
                                </div>
                                <SidebarItem icon={<PlusCircle size={20} />} label="Crear publicación" isCollapsed={false} />
                                <SidebarItem icon={<Edit size={20} />} label="Editar publicación" isCollapsed={false} />
                                <SidebarItem icon={<Trash2 size={20} />} label="Eliminar publicación" isCollapsed={false} />
                                <SidebarItem icon={<FileText size={20} />} label="Revisar publicación" isCollapsed={false} />
                            </div>
                            <div className="mt-auto px-2">
                                <SidebarItem
                                    icon={<LogOut size={20} />}
                                    label="Cerrar sesión"
                                    isCollapsed={false}
                                    onClick={() => navigate("/")}
                                />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};
