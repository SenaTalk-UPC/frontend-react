import Navbar from "../components/ui/navbar";

export default function Ayuda() {
  
  const cardBase =
    "rounded-2xl px-6 py-8 shadow transition duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center";

  const faqs = [
    {
      q: "¿Necesito un equipo especial para usar SeñaTalk?",
      a: "No. Solo una computadora con cámara web y un navegador moderno (Chrome, Edge, Safari ≥ v15, Firefox ≥ v109).",
    },
    {
      q: "¿Qué señas reconoce la app?",
      a: "Por ahora el modelo está entrenado para el alfabeto y vocabulario básico de la LSP (Lengua de Señas Peruana).",
    },
    {
      q: "¿Los datos de la cámara se envían a la nube?",
      a: "El reconocimiento se realiza *en tu dispositivo* mediante WebAssembly. No subimos vídeo ni fotos a nuestros servidores.",
    },
  ];

  const infoCards: [string, string, string][] = [
    ["🖥️", "Reconocimiento local", "El modelo corre directamente en tu navegador. No requiere instalar software."],
    ["♿", "Accesibilidad", "Facilita la comunicación entre personas oyentes y usuarias de la Lengua de Señas Peruana."],
    ["🔊", "Multimodal", "Traduce la seña a texto y genera el audio correspondiente."],
  ];

  return (
    <main className="min-h-screen bg-blue-50 text-gray-900 flex flex-col">
      <Navbar current="Ayuda & FAQ" />

      {/* ───── HERO ───── */}
      <section className="relative h-[580px] flex items-center justify-center text-center overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Personas usando lenguaje de señas"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 flex flex-col items-center gap-5 px-6">
          <div className="w-24 h-24">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">SeñaTalk</h1>
          <p className="max-w-lg mx-auto text-white">
            Traduce el lenguaje de señas peruano a texto y voz en tiempo real.
          </p>
        </div>
      </section>

      {/* ───── INFO ───── */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">¿Qué es&nbsp;SeñaTalk?</h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {infoCards.map(([emoji, title, desc]) => (
            <div key={title} className={`${cardBase} bg-white`}>
              <span className="text-5xl mb-4">{emoji}</span>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CÓMO UTILIZAR ───── */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Cómo utilizar SeñaTalk</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            ["1️⃣", "Crea tu cuenta", "Regístrate e inicia sesión. Solo te tomará un minuto."],
            ["2️⃣", "Activa la cámara", "En el Dashboard haz clic en «Capturar gestos» y concede permiso al navegador."],
            ["3️⃣", "Haz tu seña", "Sitúa tu mano en el recuadro. SeñaTalk mostrará puntos y conexiones sobre ella."],
            ["4️⃣", "Lee o escucha", "La transcripción aparece a la derecha; pulsa «🔊 Voz» para oírla."],
          ].map(([step, title, desc]) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="text-3xl">{step}</div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Preguntas frecuentes</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map(({ q, a }) => (
            <details key={q} className="bg-white rounded-xl p-4 shadow">
              <summary className="font-medium cursor-pointer">{q}</summary>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───── FOOTER / CTA ───── */}
      <footer className="py-8 text-center text-sm text-gray-600 bg-blue-50">
        <p className="mt-6">© 2025 SeñaTalk – Todos los derechos reservados</p>
      </footer>
    </main>
  );
}
