import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import { getFolders } from "../../services/folderService";
import { getRecordings, deleteRecording, updateTranslation } from "../../services/recordingService";
import { synthesizeSpeech } from "../../services/speechService";
import { translateText } from "../../services/textTranslationService";

type Folder = { id: number; name: string };
type Recording = { id: number; text: string; folder_id: number; created_at: string };

export default function FolderPage() {
  const { folderId } = useParams<{ folderId: string }>();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [langMap, setLangMap] = useState<Record<number, "es" | "en">>({});
  const [moveModal, setMoveModal] = useState<{
    isOpen: boolean;
    recordingId: number | null;
    currentText: string;
  }>({ isOpen: false, recordingId: null, currentText: "" });
  const [translateModal, setTranslateModal] = useState<{
    isOpen: boolean;
    recordingId: number | null;
    currentLang: "es" | "en";
  }>({ isOpen: false, recordingId: null, currentLang: "es" });
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedTargetLang, setSelectedTargetLang] = useState<"es" | "en">("es");

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
        recs.forEach((r: Recording) => (initLang[r.id] = "es"));
        setLangMap(initLang);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [folderId]);

  const handlePlay = async (txt: string, lang: "es" | "en") => {
    try {
      const languageCode = lang === "es" ? "es-ES" : "en-US";
      const voiceName = lang === "es" ? "es-ES-Chirp3-HD-Fenrir" : "en-US-Chirp3-HD-Achird";
      const audioBlob = await synthesizeSpeech(txt, languageCode, voiceName);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("Error al sintetizar y reproducir audio:", err);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteRecording(id);
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleMove = async (id: number, newFolderId: number) => {
    const rec = recordings.find((r) => r.id === id);
    if (!rec || rec.folder_id === newFolderId) {
      setMoveModal({ isOpen: false, recordingId: null, currentText: "" });
      setSelectedFolderId(null);
      return;
    }

    try {
      await updateTranslation(id, { text: rec.text, folder_id: newFolderId });
      const updatedRecs = await getRecordings(Number(folderId));
      setRecordings(updatedRecs);
      setMoveModal({ isOpen: false, recordingId: null, currentText: "" });
      setSelectedFolderId(null);
    } catch (err) {
      console.error("Error moving translation:", err);
    }
  };

  const handleTranslate = async (id: number, targetLang: "es" | "en") => {
    const rec = recordings.find((r) => r.id === id);
    if (!rec) return;

    try {
      const translatedText = await translateText(rec.text, targetLang);
      await updateTranslation(id, { text: translatedText, folder_id: rec.folder_id });

      setRecordings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, text: translatedText } : r))
      );

      setLangMap((prev) => ({ ...prev, [id]: targetLang }));
      setTranslateModal({ isOpen: false, recordingId: null, currentLang: "es" });
      setSelectedTargetLang("es");
    } catch (err) {
      console.error("Error translating text:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        <p>Cargando grabaciones...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 pt-20 text-gray-800">
      <Navbar current="Grabaciones" />

      <div className="max-h-[70vh] overflow-y-auto pr-1">
        {recordings.length === 0 ? (
          <p className="text-gray-500">No hay grabaciones en esta carpeta.</p>
        ) : (
          recordings.map((rec) => (
            <div
              key={rec.id}
              className="bg-blue-50 p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <p className="mb-1">{rec.text}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    setMoveModal({ isOpen: true, recordingId: rec.id, currentText: rec.text })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mover
                </button>

                <button
                  onClick={() =>
                    setTranslateModal({
                      isOpen: true,
                      recordingId: rec.id,
                      currentLang: langMap[rec.id] ?? "es"
                    })
                  }
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Traducir a idioma...
                </button>

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

      {/* Modal para mover grabación */}
      {moveModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Mover grabación</h3>
            <p className="text-gray-700 mb-4">¿A qué carpeta quiere mover el texto?</p>
            <select
              value={selectedFolderId || ""}
              onChange={(e) => setSelectedFolderId(parseInt(e.target.value) || null)}
              className="w-full border rounded p-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Seleccione una carpeta
              </option>
              {folders
                .filter((f) => f.id !== Number(folderId))
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMoveModal({ isOpen: false, recordingId: null, currentText: "" });
                  setSelectedFolderId(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (moveModal.recordingId && selectedFolderId) {
                    handleMove(moveModal.recordingId, selectedFolderId);
                  }
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                disabled={!selectedFolderId}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para traducir texto */}
      {translateModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Traducir texto</h3>
            <p className="text-gray-700 mb-4">Seleccione el idioma de destino:</p>
            <select
              value={selectedTargetLang}
              onChange={(e) => setSelectedTargetLang(e.target.value as "es" | "en")}
              className="w-full border rounded p-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setTranslateModal({ isOpen: false, recordingId: null, currentLang: "es" });
                  setSelectedTargetLang("es");
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (translateModal.recordingId) {
                    handleTranslate(translateModal.recordingId, selectedTargetLang);
                  }
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}