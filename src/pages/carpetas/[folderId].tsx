import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import {
  getFolders,
} from "../../services/folderService";
import {
  getRecordings,
  deleteRecording,
} from "../../services/recordingService"; // <-- ahora apunta al nuevo servicio

type Folder = { id: number; name: string };
type Recording = { id: number; text: string; folder_id: number; created_at: string };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("es-PE", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });

export default function FolderPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [langMap, setLangMap] = useState<Record<number, "es" | "en">>({});

  useEffect(() => {
    (async () => {
      try {
        const [foldersData, recs] = await Promise.all([
          getFolders(),
          folderId ? getRecordings(Number(folderId)) : []
        ]);
        setFolders(foldersData);
        setRecordings(recs);

        const initLang: Record<number, "es" | "en"> = {};
        recs.forEach((r: Recording) => initLang[r.id] = "es");
        setLangMap(initLang);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [folderId]);

  const orderedRecs = useMemo(() => {
    return [...recordings].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [recordings, sortOrder]);

  const handlePlay = (txt: string, lang: "es" | "en") => {
    if (!("speechSynthesis" in window)) return;
    const uttr = new SpeechSynthesisUtterance(txt);
    uttr.lang = lang === "es" ? "es-ES" : "en-US";
    speechSynthesis.speak(uttr);
  };

  const handleDelete = async (id: number) => {
    await deleteRecording(id);
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleMove = async (id: number, newFolderId: number) => {
    const rec = recordings.find((r) => r.id === id);
    if (!rec || rec.folder_id === newFolderId) return;
    // await updateRecording(id, { folder_id: newFolderId });
    setRecordings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, folder_id: newFolderId } : r))
    );
  };

  const handleLangChange = (id: number, newLang: "es" | "en") =>
    setLangMap((prev) => ({ ...prev, [id]: newLang }));

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        <p>Cargando grabaciones...</p>
      </main>
    );
  }

  const currentFolderName = folders.find((f) => String(f.id) === folderId)?.name ?? folderId;

  return (
    <main className="min-h-screen bg-white p-6 text-gray-800">
      <Navbar current="Grabaciones" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          📁 Grabaciones en <span className="text-blue-600">{currentFolderName}</span>
        </h2>
        <button
          onClick={() => navigate("/carpetas")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver a carpetas
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium">Ordenar por fecha:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="px-3 py-1 border rounded"
        >
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguas primero</option>
        </select>
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-1">
        {orderedRecs.length === 0 ? (
          <p className="text-gray-500">No hay grabaciones en esta carpeta.</p>
        ) : (
          orderedRecs.map((rec) => (
            <div
              key={rec.id}
              className="bg-blue-50 p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <p className="mb-1">{rec.text}</p>
                {/* <span className="text-xs text-gray-500">{fmt(rec.created_at)}</span> */}
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={rec.folder_id}
                  onChange={(e) => handleMove(rec.id, parseInt(e.target.value))}
                  className="px-3 py-2 border rounded bg-white"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>

                <select
                  value={langMap[rec.id] ?? "es"}
                  onChange={(e) => handleLangChange(rec.id, e.target.value as "es" | "en")}
                  className="px-3 py-2 border rounded bg-white"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>

                <button
                  onClick={() => handlePlay(rec.text, langMap[rec.id] ?? "es")}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  🔊 Voz
                </button>

                <button
                  onClick={() => handleDelete(rec.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
