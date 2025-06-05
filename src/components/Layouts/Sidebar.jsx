import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  NewspaperIcon,
  DocumentMagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";

const logo = `${process.env.PUBLIC_URL}/assets/LogOcean.png`;
const smallLogo = `${process.env.PUBLIC_URL}/assets/LogOcean.png`;
const footerLogo = `${process.env.PUBLIC_URL}/assets/LogoFooter.png`;
const smallFooterLogo = `${process.env.PUBLIC_URL}/assets/IconoPrincipalAzul.png`;



const Sidebar = ({ isFormOpen }) => {  // Recibe isFormOpen desde Formulario
  const { userRole } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: "/inicio", icon: HomeIcon, label: "INICIO" },
    { to: "/registro", icon: NewspaperIcon, label: "REGISTRO" },
    userRole === "ADMINISTRADOR" && { to: "/consultas", icon: DocumentMagnifyingGlassIcon, label: "CONSULTAS" },
    { to: "/soporte", icon: ChatBubbleLeftRightIcon, label: "SOPORTE" },
  ].filter(Boolean); // Elimina elementos "false" si el rol no es ADMIN

  return (
    <div className={`h-screen bg-[#182540] text-white flex flex-col justify-between transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      <div>
        <div className="flex flex-col items-center p-4 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className={`bg-[#F2F2F2] rounded-full overflow-hidden flex items-center justify-center shadow-lg transition-all duration-300 ${isCollapsed ? "w-16 h-16" : "w-40 h-40"}`}>
            <img
              src={isCollapsed ? smallLogo : logo}
              alt="Logo Ocean Coal"
              className={`object-contain transition-all duration-300 ${isCollapsed ? "w-12 h-12" : "w-32 h-32"}`}
            />
          </div>
        </div>
        <nav className="flex flex-col space-y-4 p-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} py-2 px-4 rounded font-semibold transition-all duration-300 ${
                location.pathname === to ? "bg-gray-300 text-[#182540]" : "hover:bg-gray-300 hover:text-[#182540]"
              } ${isFormOpen ? "pointer-events-none opacity-50" : ""}`}  // Bloquea la navegación si el formulario está abierto
            >
              <div className="relative group">
                <Icon className="w-6 mx-auto" />
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {label}
                  </span>
                )}
              </div>
              {!isCollapsed && <p>{label}</p>}
            </Link>
          ))}
        </nav>
      </div>
      <footer className="p-4 flex justify-center">
        <img
          src={isCollapsed ? smallFooterLogo : footerLogo}
          className={`transition-all duration-300 ${isCollapsed ? "w-10" : "w-3/5"}`}
          alt="Logo Footer"
        />
      </footer>
    </div>
  );
};

export default Sidebar;
