import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/navbar";
import { getFolders, createFolder } from "../services/folderService";

type Folder = { id: number; name: string };

export default function Carpetas() {
  const navigate = useNavigate();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFolders();
        setFolders(data);
      } catch (err) {
        console.error("Error al cargar carpetas:", err);
        navigate("/"); // redirigir si ocurre error (por ejemplo, sin login)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCreate = async () => {
    if (!newName.trim()) return;

    if (folders.some(f => f.name.toLowerCase() === newName.trim().toLowerCase())) {
      alert("Ya existe una carpeta con ese nombre");
      return;
    }

    try {
      const created = await createFolder(newName.trim());
      setFolders(prev => [...prev, created]);
      setNewName("");
      setIsOpen(false);
    } catch (err) {
      console.error("Error creando carpeta:", err);
    }
  };

  const goToFolder = (id: number) => navigate(`/carpetas/${id}`);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-white p-6 pt-20 text-gray-800">
      <Navbar current="Carpetas" />

      <div className="flex items-center gap-4 mb-8 flex-wrap">
        {folders.map(folder => (
          <div
            key={folder.id}
            onClick={() => goToFolder(folder.id)}
            className="flex flex-col items-center gap-2 cursor-pointer w-24 h-24"
          >
            <img
              src="/carpeta.png"
              alt="Carpeta"
              className="w-full h-full object-contain"
            />
            <span className="text-sm font-semibold">{folder.name}</span>
          </div>
        ))}

        {/* Botón nueva carpeta */}
        <div
          onClick={() => setIsOpen(true)}
          title="Crear carpeta"
          className="w-20 h-20 cursor-pointer flex items-center justify-center"
        >
          <img
            src="/agregar.png"
            alt="Agregar carpeta"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Nueva carpeta</h3>
            <input
              type="text"
              placeholder="Nombre de la carpeta"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border rounded p-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsOpen(false); setNewName(""); }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
