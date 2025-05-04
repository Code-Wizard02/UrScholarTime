import { useEffect, useState } from "react";
import { Subject as Materia } from "../../models/Subject";
import { v4 as uuidv4 } from "uuid";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./../../services/firebase";
import { saveSubject } from "@/services/Subject/crudSubject";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const nuevaMateria: Materia = {
            id: uuidv4(),
            name: nombre,
            teacher: profesor ? { id: profesor.id, name: profesor.name, email: "" } : { id: "", name: "", email: "" },
            classroom:aula,
            difficulty:dificultad,
            userId: getCurrentUserId(),
            createdAt: new Date()
        };
        try {
            const userId = getCurrentUserId();
            await saveSubject(nuevaMateria, userId);

            onAdd(nuevaMateria);
            setNombre("");
            setProfesor(null);
            setAula("");
            setDificultad(3);
        } catch (error) {
            console.error("Error al guardar la materia:", error);
        }
    };

    const getCurrentUserId = (): string => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No hay usuario autenticado');
        }
        return currentUser.uid;
    };

    useEffect(() => {
        const fetchProfesores = async () => {
            try {
                const userId = getCurrentUserId();
                const profesoresCollection = collection(db, "professors");
                const q = query(profesoresCollection,where("userId", "==", userId));
                const profesoresSnapshot = await getDocs(q);
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
