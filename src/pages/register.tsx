import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/loginService";
import { createFolder } from "../services/folderService";

export default function Register() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await registerUser({ username, email, password });

      // Login automático después del registro
      await loginUser({ email, password });

      console.log("Token: " + localStorage.getItem("token"));

      // Crear carpeta "Favoritos" automáticamente
      await createFolder("Favoritos");

      // Mostrar modal en lugar de alert
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError("Hubo un error en el registro.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Sección izquierda con imagen */}
      <section
        className="w-full md:w-1/2 bg-cover bg-center order-1 md:order-none"
        style={{
          backgroundImage: 'url("/banner.jpg")',
          backgroundPosition: "left center",
        }}
      >
        <div className="h-full flex items-center justify-center bg-black/50 p-4 md:p-0">
          <div className="relative z-10 text-center text-white px-4 md:px-6 h-full flex flex-col justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6">
              <img
                src="/logo.png"
                alt="Logo SeñaTalk"
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">SeñaTalk</h1>
            <p className="text-base md:text-lg mb-4">
              Plataforma inclusiva que traduce el lenguaje de señas peruano a
              texto y voz en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Sección derecha con formulario */}
      <section className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-8 order-2 md:order-none">
        <div className="w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-4 md:mb-6">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-900">
                Nombre completo
              </label>
              <input
                type="text"
                className="w-full border p-2 md:p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
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
                className="w-full border p-2 md:p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border p-2 md:p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border p-2 md:p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 md:py-3 rounded hover:bg-blue-700 transition"
            >
              Registrarme
            </button>
          </form>

          <p className="mt-4 md:mt-6 text-center text-sm text-gray-900">
            ¿Ya tienes una cuenta?{" "}
            <a href="/" className="font-semibold text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </section>

      {/* Modal para mensaje de éxito */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-xs w-full md:max-w-sm">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-4">
              ¡Registro exitoso!
            </h3>
            <p className="text-gray-700 mb-4 md:mb-6">
              Bienvenido(a), {username}. Tu cuenta ha sido creada.
            </p>
            <button
              onClick={handleModalClose}
              className="w-full bg-blue-600 text-white py-1 md:py-2 rounded hover:bg-blue-700 transition"
            >
              Continuar al Dashboard
            </button>
          </div>
        </div>
      )}
    </main>
  );
}