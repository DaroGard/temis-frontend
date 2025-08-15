import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, User, UserCircle, FileText, LogOut } from "lucide-react";
import { useNavigate } from '@tanstack/react-router';
import logo from "~/assets/logos/temisGI.svg";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  // Función para cerrar sesión
  const handleLogout = () => {
    setMenuOpen(false);

    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    navigate({ to: '/login' });
  };

  return (
    <header className="bg-[#1E293B] h-20 px-8 flex items-center justify-between shadow-md relative">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src={logo} alt="TEMIS logo" className="h-24" />
      </div>

      {/* Íconos de notificaciones, configuración y usuario */}
      <div className="flex items-center gap-6 text-white relative">
        {/* Botón de notificaciones */}
        <button
          className="hover:text-blue-300 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell size={26} />
        </button>

        {/* Botón de configuración */}
        <button
          className="hover:text-blue-300 transition-colors"
          aria-label="Configuración"
        >
          <Settings size={26} />
        </button>

        {/* Menú de usuario */}
        <div
          ref={userIconRef}
          className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center hover:ring-2 hover:ring-blue-300 cursor-pointer relative transition"
          onClick={() => setMenuOpen((open) => !open)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="Menú de usuario"
        >
          <User size={22} />

          {/* Contenedor del menú desplegable */}
          <div
            ref={menuRef}
            className={`
              origin-top-right absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50
              transform transition-all duration-200 ease-out
              ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
            style={{ transformOrigin: "top right" }}
          >
            {/* Perfil */}
            <a
              href="/UserProfilePage"
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors rounded-md"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <UserCircle className="mr-3 h-5 w-5" />
              Perfil
            </a>

            {/* Plan */}
            <a href="/pricingPage">
              <button
                className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors rounded-md"
                role="menuitem"
                type="button"
                onClick={() => setMenuOpen(false)}
              >
                <FileText className="mr-3 h-5 w-5" />
                Plan
              </button>
            </a>

            <div className="border-t border-gray-200 my-1" />

            {/* Cerrar sesión */}
            <button
              className="group flex items-center w-full px-4 py-2 text-sm text-warning hover:bg-red-500 hover:text-white transition-colors rounded-md"
              role="menuitem"
              type="button"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;