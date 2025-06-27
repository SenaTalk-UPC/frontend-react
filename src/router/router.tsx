import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/index";
import Register from "../pages/register";
import Dashboard from "../pages/dashboard";
import Ayuda from "../pages/info";
import Perfil from "../pages/perfil";
import Carpetas from "../pages/carpetas";
import FolderDetail from "../pages/carpetas/[folderId]";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/carpetas" element={<Carpetas />} />
        <Route path="/carpetas/:folderId" element={<FolderDetail />} />
        <Route path="/info" element={<Ayuda />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
