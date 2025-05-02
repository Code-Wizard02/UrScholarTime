import { useEffect, useState } from "react";
import { Subject as Materia } from "../../models/Subject";
import { v4 as uuidv4 } from "uuid";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface MateriaFormProps{
    onAdd: (materia: Materia) => void;
    onCancel: () => void;
}

interface Profesor {
    id: string;
    name: string;
}

export function MateriaForm({ onAdd, onCancel }: MateriaFormProps) {
    const [nombre, setNombre] = useState("");
    const [profesor, setProfesor] = useState<Profesor | null>(null);
    const [aula, setAula] = useState("");
    const [dificultad, setDificultad] = useState(1);
    const [profesores, setProfesores] = useState<Profesor[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    const nuevaMateria: Materia = {
        id: uuidv4(),
        name: nombre,
        teacher: profesor ? { id: profesor.id, name: profesor.name, email: "" } : { id: "", name: "", email: "" },
        classroom:aula,
        difficulty:dificultad,
    };
    onAdd(nuevaMateria);
    setNombre("");
    setProfesor(null);
    setAula("");
    setDificultad(3);
    };

    useEffect(() => {
        const fetchProfesores = async () => {
            try {
                const profesoresCollection = collection(db, "professors");
                const profesoresSnapshot = await getDocs(profesoresCollection);
                const profesoresData: Profesor[] = profesoresSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setProfesores(profesoresData);
            } catch (error) {
                console.error("Error fetching profesores:", error);
            }
        }
        fetchProfesores();
    }
    , []);

    return (
        <div className="text-center mb-4">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h2 className="text-2xl font-bold mb-4">Agregar Materia</h2>
            <input
                type="text"
                placeholder="Nombre de la materia"
                className="w-full border rounded p-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            <select
                className="w-full border rounded p-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-200"
                value={profesor?.name || ""}
                onChange={(e) => {
                    const selectedProfesor = profesores.find((prof) => prof.id === e.target.value);
                    setProfesor(selectedProfesor || null);
                }}
                required
            >
                <option 
                    value="" disabled>
                    Selecciona un profesor
                </option>
                {profesores.map((profesor) => (
                    <option key={profesor.id} value={profesor.id}>
                        {profesor.name}
                    </option>
                ))}
                
            </select>
            <input
                type="text"
                placeholder="Aula"
                className="w-full border rounded p-2"
                value={aula}
                onChange={(e) => setAula(e.target.value)}
                required
            />
            <label className="block">Dificultad: {dificultad}</label>
            <input
                type="range"
                min={1}
                max={5}
                value={dificultad}
                onChange={(e) => setDificultad(Number(e.target.value))}
                className="w-full"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
            Agregar materia
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Cancelar
            </button>
        </form>
        </div>
    );
}
