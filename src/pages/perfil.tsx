import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/navbar";
import { getUser, updateUser } from "../services/userService"; // Asegúrate de que esté bien exportado

type User = { id: string; name: string; email: string; password: string };

const baseInput = `
  w-full px-5 py-3 rounded-full border
  focus:outline-none focus:ring-2 focus:ring-blue-500
  text-gray-900 placeholder-gray-400
`;
const readonly = `bg-gray-100 border-transparent cursor-default`;

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<"view" | "verify" | "edit">("view");

  const [form, setForm] = useState({
    name: "",
    email: "",
    newPass: "",
    confirm: "",
    verifyPass: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        const data = await getUser(uid);
        setUser(data);
        setForm(f => ({ ...f, name: data.name, email: data.email }));
      } catch {
        navigate("/");
      }
    })();
  }, [navigate]);

  const change =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleEditClick = () => {
    setError("");
    setForm(f => ({ ...f, verifyPass: "" }));
    setStep("verify");
  };

  const handleVerify = () => {
    if (form.verifyPass !== user?.password) {
      setError("Contraseña incorrecta.");
      return;
    }
    setError("");
    setStep("edit");
  };

  const handleSave = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nombre y correo son obligatorios.");
      return;
    }
    if (form.newPass && form.newPass !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const payload: Partial<User> = {
        name: form.name,
        email: form.email,
        ...(form.newPass ? { password: form.newPass } : {}),
      };
      const updated = await updateUser(user!.id, payload);
      setUser(updated);
      setForm(f => ({
        ...f,
        newPass: "",
        confirm: "",
        verifyPass: "",
      }));
      setStep("view");
    } catch {
      setError("No se pudo actualizar la información.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Navbar current="Perfil" />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Avatar */}
          <div className="w-32 h-32 mx-auto rounded-full border-2 border-gray-300 flex items-center justify-center">
            <span className="text-gray-400">Avatar</span>
          </div>

          {/* Nombre */}
          <input
            disabled={step !== "edit"}
            className={`${baseInput} ${step !== "edit" ? readonly : ""}`}
            value={form.name}
            onChange={change("name")}
            placeholder="Nombre"
          />

          {/* Email */}
          <input
            disabled={step !== "edit"}
            className={`${baseInput} ${step !== "edit" ? readonly : ""}`}
            value={form.email}
            onChange={change("email")}
            placeholder="Correo electrónico"
          />

          {/* Nueva contraseña */}
          {step === "edit" && (
            <>
              <input
                type="password"
                className={baseInput}
                value={form.newPass}
                onChange={change("newPass")}
                placeholder="Nueva contraseña (opcional)"
              />
              <input
                type="password"
                className={baseInput}
                value={form.confirm}
                onChange={change("confirm")}
                placeholder="Confirmar nueva contraseña"
              />
            </>
          )}

          {/* Verificar contraseña */}
          {step === "verify" && (
            <input
              type="password"
              className={baseInput}
              value={form.verifyPass}
              onChange={change("verifyPass")}
              placeholder="Ingrese su contraseña para verificar"
            />
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Botones */}
          {step === "view" && (
            <div className="flex gap-4">
              <button
                onClick={handleEditClick}
                className="flex-1 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Editar información
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {step === "verify" && (
            <button
              onClick={handleVerify}
              className="w-full py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Verificar
            </button>
          )}

          {step === "edit" && (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                Guardar
              </button>
              <button
                onClick={() => setStep("view")}
                className="flex-1 py-3 rounded-full bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
