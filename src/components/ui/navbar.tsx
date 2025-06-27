// src/components/ui/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";

type NavbarProps = { current: string };

export default function Navbar({ current }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

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
        px-6 py-4
        shadow-md
      "
    >
      <h1 className="text-lg sm:text-xl font-bold">{current}</h1>

      <nav className="flex gap-6 text-sm sm:text-base">
        <Link to="/dashboard" className={isActive("/dashboard")}>
          Captura y traducción
        </Link>
        <Link to="/carpetas" className={isActive("/carpetas")}>
          Carpetas
        </Link>
        <Link to="/info" className={isActive("/info")}>
          Ayuda & FAQ
        </Link>
        <Link to="/perfil" className={isActive("/perfil")}>
          Perfil
        </Link>
        <button
          onClick={handleLogout}
          className="hover:underline text-sm sm:text-base"
        >
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
}
