import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileForm() {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name);
        setAge(data.age.toString());
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, "users", user!.uid), {
        name,
        age: parseInt(age),
      });

      alert("Perfil actualizado");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4"
    >
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded-xl"
      />

      <input
        type="number"
        placeholder="Edad"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full p-2 border rounded-xl"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>
    </form>
  );
}
