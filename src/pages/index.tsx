import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/loginService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser(email, password);
      if (user) {
        localStorage.setItem("userId", user.id);
        navigate("/dashboard");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch {
      setError("Hubo un error en el inicio de sesión.");
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
              Plataforma inclusiva que traduce el lenguaje de señas peruano a texto y voz en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Sección derecha con formulario */}
      <section className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Iniciar sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-900">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         fill="none" viewBox="0 0 24 24"
         strokeWidth="1.5" stroke="currentColor"
         className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 
               12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 
               0 .639C20.577 16.49 16.64 19.5 
               12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         fill="none" viewBox="0 0 24 24"
         strokeWidth="1.5" stroke="currentColor"
         className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 
               0 1.934 12C3.226 16.338 7.244 
               19.5 12 19.5c.993 0 1.953-.138 
               2.863-.395M6.228 6.228A10.451 
               10.451 0 0 1 12 4.5c4.756 0 8.773 
               3.162 10.065 7.498a10.522 10.522 
               0 0 1-4.293 5.774M6.228 6.228 
               3 3m3.228 3.228 3.65 3.65m7.894 
               7.894L21 21m-3.228-3.228-3.65-3.65" />
    </svg>
  );
}
