import { useEffect, useRef, useState } from "react";
import Navbar from "../components/ui/navbar";
import { getFolders, createRecording } from "../services/folderService";
import { Holistic, POSE_CONNECTIONS, HAND_CONNECTIONS, FACEMESH_TESSELATION } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { useNavigate } from "react-router-dom";

type Folder = { id: string; name: string; userId: string };
type RecordingPayload = { text: string; folderId: string; createdAt: string };

export default function Dashboard() {
  const navigate = useNavigate();

  const [translation, setTranslation] = useState("");
  const [saved, setSaved] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [showOverlay, setOverlay] = useState(true);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [recFolderId, setRecId] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const overlayRef = useRef(true);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      navigate("/");
      return;
    }

    getFolders(uid).then((lst) => {
      setFolders(lst);
      const def = lst.find((f: Folder) => f.name === "Recientes");
      if (def) setRecId(def.id);
    });
  }, [navigate]);

  const startCamera = async () => {
    if (cameraOn) return;
    setCameraOn(true);

    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults((results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (overlayRef.current) {
        if (results.poseLandmarks) {
          drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 4 });
          drawLandmarks(ctx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });
        }
        if (results.leftHandLandmarks) {
          drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: "#CC0000", lineWidth: 4 });
          drawLandmarks(ctx, results.leftHandLandmarks, { color: "#00FFFF", lineWidth: 2 });
        }
        if (results.rightHandLandmarks) {
          drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: "#0000FF", lineWidth: 4 });
          drawLandmarks(ctx, results.rightHandLandmarks, { color: "#FF00FF", lineWidth: 2 });
        }
        if (results.faceLandmarks) {
          drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
        }
      }

      ctx.restore();

      // Simulación de predicción
      const keypoints = [
        ...(results.poseLandmarks || []),
        ...(results.faceLandmarks || []),
        ...(results.leftHandLandmarks || []),
        ...(results.rightHandLandmarks || []),
      ].flatMap((p) => [p.x, p.y, p.z ?? 0]);

      console.log("Vectores:", keypoints);
    });

    const cam = new Camera(videoRef.current!, {
      onFrame: async () => await holistic.send({ image: videoRef.current! }),
      width: 640,
      height: 480,
    });

    cameraRef.current = cam;
    cam.start();
  };

  const stopCamera = () => {
    cameraRef.current?.stop();
    setCameraOn(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const toggleOverlay = () => setOverlay((prev) => (overlayRef.current = !prev));

  const fakeTranslate = () => {
    setTranslation("Hola, ¿cómo estás?");
    setSaved(false);
  };

  const speak = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(translation));
    }
  };

  const saveRec = async () => {
    if (!translation.trim() || !recFolderId) return;
    const payload: RecordingPayload = {
      text: translation,
      folderId: recFolderId,
      createdAt: new Date().toISOString(),
    };
    await createRecording(payload, recFolderId).catch(console.error);
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6">
      <Navbar current="Captura y traducción" />

      <section className="flex gap-8 items-stretch mt-20">
        {/* ─── Cámara ─── */}
        <div className="flex-1 bg-blue-50 p-4 rounded-lg shadow flex flex-col">
          <div className="relative flex-1 aspect-video border rounded overflow-hidden bg-black">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-contain" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl bg-white/80">
                [ Cámara (MediaPipe Holistic) aquí ]
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <button onClick={startCamera} className="flex-1 px-4 py-2 bg-purple-700 text-white rounded">
              🧤 Capturar
            </button>
            <button onClick={stopCamera} className="flex-1 px-4 py-2 bg-red-600 text-white rounded">
              ❌ Detener
            </button>
            <button onClick={toggleOverlay} className="flex-1 px-4 py-2 bg-gray-700 text-white rounded">
              {showOverlay ? "🙈 Ocultar líneas" : "👀 Mostrar líneas"}
            </button>
            <button onClick={fakeTranslate} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded">
              🤖 Traducir
            </button>
          </div>
        </div>

        {/* ─── Traducción ─── */}
        <div className="flex-1 bg-blue-50 p-4 rounded-lg shadow flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Texto traducido</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "es" | "en")}
              className="px-3 py-1 rounded border bg-white text-sm text-gray-900"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <textarea
            readOnly
            value={translation}
            className="flex-1 min-h-[600px] p-4 border rounded resize-none bg-white text-gray-900"
          />

          {saved && <p className="text-sm text-green-600 mt-2">Traducción guardada.</p>}

          <div className="flex justify-center gap-2 mt-4">
            <button onClick={speak} className="w-1/3 px-4 py-2 bg-green-600 text-white rounded">
              🔊 Voz
            </button>
            <button onClick={saveRec} className="w-1/3 px-4 py-2 bg-gray-700 text-white rounded">
              💾 Guardar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}