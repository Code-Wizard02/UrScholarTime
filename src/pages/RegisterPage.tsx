import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function RegisterPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [age, setAge] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;

      // Guardar datos en Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        age: parseInt(age),
        createdAt: new Date().toISOString(),
    });

    window.location.href = "/";
    } catch (err: any) {
        console.error(err);
        setError("No se pudo registrar el usuario. Verifica los datos.");
    } finally {
        setLoading(false);
    }
};

return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
        <form
            onSubmit={handleRegister}
            className="bg-black opacity-90 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4"
            id="register-form"
        >
        <h2 className="text-2xl font-bold text-center text-white">Crear Cuenta</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-xl"
            required
        />
        <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border rounded-xl"
            required
        />
        <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-xl"
            required
        />
        <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-xl"
            required
        />
        <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition"
            disabled={loading}
        >
            {loading ? "Registrando..." : "Registrarse"}
        </button>
        <div className="text-center mt-4">
            <p className="text-white text-sm">¿Ya tienes una cuenta?</p>
            <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition mt-2"
            >
            Iniciar Sesión
            </button>
        </div>
        </form>
    </div>
);
}
