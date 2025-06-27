import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/loginService";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await registerUser({ name, email, password });
      alert(`Usuario ${name} registrado correctamente.`);
      navigate("/"); // Redirige al login
    } catch (err) {
      console.error(err);
      setError("Hubo un error en el registro.");
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Sección izquierda con imagen */}
      <section
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/banner.jpg")',
          backgroundPosition: "left center",
        }}
      >
        <div className="h-full flex items-center justify-center bg-black/50">
          <div className="relative z-10 text-center text-white px-6 h-full flex flex-col justify-center">
            <div className="w-24 h-24 mx-auto mb-6">
              <img
                src="/logo.png"
                alt="Logo SeñaTalk"
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SeñaTalk</h1>
            <p className="text-lg mb-4">
              Plataforma inclusiva que traduce el lenguaje de señas peruano a
              texto y voz en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Sección derecha con formulario */}
      <section className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-900">
                Nombre completo
              </label>
              <input
                type="text"
                className="w-full border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-900">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-900">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-900">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="w-full border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
              Registrarme
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-900">
            ¿Ya tienes una cuenta?{" "}
            <a href="/" className="font-semibold text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
