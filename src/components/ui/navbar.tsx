import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type NavbarProps = { current: string };

export default function Navbar({ current }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "underline font-semibold" : "hover:underline";

  return (
    <header
      className="
        fixed top-0 inset-x-0 z-50
        bg-blue-600 text-white
        flex flex-wrap items-center justify-between
        px-4 py-3 sm:px-6 sm:py-4
        shadow-md
      "
    >
      <h1 className="text-lg sm:text-xl font-bold">{current}</h1>

      {/* Menú para desktops */}
      <nav className="hidden md:flex gap-4 lg:gap-6 text-sm md:text-base">
        <Link to="/dashboard" className={isActive("/dashboard")}>
          Captura y traducción
        </Link>
        <Link to="/carpetas" className={isActive("/carpetas")}>
          Carpetas
        </Link>
        <Link to="/info" className={isActive("/info")}>
          Ayuda & FAQ
        </Link>
        {/* <Link to="/perfil" className={isActive("/perfil")}>
          Perfil
        </Link> */}
        <button
          onClick={handleLogout}
          className="hover:underline text-sm md:text-base"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* Botón hamburguesa para móviles */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Menú móvil */}
      {isMenuOpen && (
        <nav className="md:hidden w-full mt-4 flex flex-col gap-4 text-center text-base">
          <Link to="/dashboard" className={isActive("/dashboard")} onClick={() => setIsMenuOpen(false)}>
            Captura y traducción
          </Link>
          <Link to="/carpetas" className={isActive("/carpetas")} onClick={() => setIsMenuOpen(false)}>
            Carpetas
          </Link>
          <Link to="/info" className={isActive("/info")} onClick={() => setIsMenuOpen(false)}>
            Ayuda & FAQ
          </Link>
          {/* <Link to="/perfil" className={isActive("/perfil")} onClick={() => setIsMenuOpen(false)}>
            Perfil
          </Link> */}
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="hover:underline"
          >
            Cerrar sesión
          </button>
        </nav>
      )}
    </header>
  );
}