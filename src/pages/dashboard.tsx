import { useEffect, useRef, useState } from "react";
import Navbar from "../components/ui/navbar";
import {
  Holistic,
  POSE_CONNECTIONS,
  HAND_CONNECTIONS,
  FACEMESH_TESSELATION,
} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import { useNavigate } from "react-router-dom";
import { sendKeypoints } from "../services/recognitionService";
import { getFavoriteFolderByUser } from "../services/folderService";
import { createRecording } from "../services/recordingService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [translation, setTranslation] = useState("");
  const [confidence, setConfidence] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [showOverlay, setOverlay] = useState(true);
  const [lang, setLang] = useState<"es" | "en">("es");
  const isPredictingRef = useRef(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const overlayRef = useRef(true);
  const sequenceRef = useRef<number[][]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const extractKeypoints = (results: any): number[] => {
    const extractOrZeros = (
      list: any[] | undefined,
      length: number,
      includeVisibility: boolean = false
    ) => {
      if (!list) return new Array(length).fill(0);
      return list.flatMap((p) =>
        includeVisibility 
          ? [p.x, p.y, p.z ?? 0, p.visibility ?? 0] 
          : [p.x, p.y, p.z ?? 0]
      );
    };

    const pose = extractOrZeros(results.poseLandmarks, 132, true);    // 33 x 4
    const face = extractOrZeros(results.faceLandmarks, 1404, false);         // 468 x 3
    const right = extractOrZeros(results.rightHandLandmarks, 63, false);     // 21 x 3
    const left = extractOrZeros(results.leftHandLandmarks, 63, false);       // 21 x 3

    return [...pose, ...face, ...right, ...left]; 
  };

  const saveToFavorites = async () => {
    try {
      if (!translation.trim()) return alert("No hay traducción para guardar");

      const favoriteFolder = await getFavoriteFolderByUser();
      await createRecording(translation, favoriteFolder.id);
      alert("Traducción guardada en favoritos");
    } catch (error) {
      alert("Ocurrió un error al guardar la traducción.");
    }
  };

  const startCamera = async () => {
    if (cameraOn) return;
    setCameraOn(true);

    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      refineFaceLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(async (results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (overlayRef.current) {
        if (results.poseLandmarks)
          drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 4,
          });
        if (results.leftHandLandmarks)
          drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
            color: "#CC0000",
            lineWidth: 4,
          });
        if (results.rightHandLandmarks)
          drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
            color: "#0000FF",
            lineWidth: 4,
          });
        if (results.faceLandmarks)
          drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });
      }

      ctx.restore();

      const fullKeypoints = extractKeypoints(results);
      sequenceRef.current.push(fullKeypoints);
      if (sequenceRef.current.length > 30) {
        sequenceRef.current.shift();
      }

      if (sequenceRef.current.length === 30 && !isPredictingRef.current) {
        isPredictingRef.current = true;
        const sequenceCopy = [...sequenceRef.current];

        sendKeypoints(sequenceCopy)
          .then((response) => {
            setTranslation(response.result.text);
            setConfidence(response.result.confidence);
          })
          .catch((error) => {
            console.error("Error enviando keypoints:", error);
          })
          .finally(() => {
            isPredictingRef.current = false;
          });
      }
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
    sequenceRef.current = [];
  };

  const toggleOverlay = () =>
    setOverlay((prev) => (overlayRef.current = !prev));

  const speak = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(translation));
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6">
      <Navbar current="Captura y traducción" />
      <section className="flex gap-8 items-stretch mt-20">
        <div className="flex-1 bg-blue-50 p-4 rounded-lg shadow flex flex-col">
          <div className="relative flex-1 aspect-video border rounded overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain"
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl bg-white/80">
                [ Cámara (MediaPipe Holistic) aquí ]
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={startCamera}
              className="flex-1 px-4 py-2 bg-purple-700 text-white rounded"
            >
              🧤 Capturar
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded"
            >
              ❌ Detener
            </button>
            <button
              onClick={toggleOverlay}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded"
            >
              {showOverlay ? "🙈 Ocultar líneas" : "👀 Mostrar líneas"}
            </button>
          </div>
        </div>

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

          <p className="mt-2 text-sm text-gray-700">
            Confianza: {(Number(confidence) * 100).toFixed(2)}%
          </p>

          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={speak}
              className="w-1/3 px-4 py-2 bg-green-600 text-white rounded"
            >
              🔊 Voz
            </button>
            <button
              onClick={saveToFavorites}
              className="w-1/3 px-4 py-2 bg-blue-600 text-white rounded"
            >
              💾 Guardar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
