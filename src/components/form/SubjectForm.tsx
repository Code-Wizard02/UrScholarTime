import { useEffect, useState } from "react";
import { Subject as Materia } from "../../models/Subject";
import { v4 as uuidv4 } from "uuid";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./../../services/firebase";
import { addSubject } from "@/services/Subject/crudSubject";

interface MateriaFormProps{
    onAdd: (materia: Materia) => void;
    onCancel: () => void;
    materiaInicial?: Materia | null;
    modoEdicion?: boolean;
}

interface Profesor {
    id: string;
    name: string;
}

export function MateriaForm({ 
    onAdd,
    onCancel,
    materiaInicial = null,    
    modoEdicion=false
}: MateriaFormProps) {
    const [nombre, setNombre] = useState("");
    const [subject, setProfesor] = useState<Profesor | null>(null);
    const [aula, setAula] = useState("");
    const [dificultad, setDificultad] = useState(1);
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (materiaInicial) {
            setNombre(materiaInicial.name || "");
            setProfesor(materiaInicial.teacher || null);
            setAula(materiaInicial.classroom || "");
            setDificultad(materiaInicial.difficulty || 3);
        }
    }, [materiaInicial]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modoEdicion && materiaInicial && materiaInicial.id) {
                const materiaActualizada: Materia = {
                    ...materiaInicial,
                    name: nombre,
                    teacher: subject ? { ...subject, email: "default@example.com" } : { id: "", name: "", email: "" },
                    classroom: aula,
                    difficulty: dificultad,
                    updatedAt: new Date(),
                };
                onAdd(materiaActualizada);
            } else {
                const nuevaMateria: Materia = {
                    id: uuidv4(),
                    name: nombre,
                    teacher: subject ? { ...subject, email: "" } : { id: "", name: "", email: "" },
                    classroom: aula,
                    difficulty: dificultad,
                    userId: auth.currentUser?.uid || "userId",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const subjectId = await addSubject(nuevaMateria);
                const subjectWithId = {
                    ...nuevaMateria,
                    id: subjectId,
                };
                onAdd(subjectWithId);
                setNombre("");
                setProfesor(null);
                setAula("");
                setDificultad(3);
            }
        } catch (error) {
            console.error("Error al guardar la materia:", error);
        } finally {
            setIsSubmitting(false);
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
            <h2 className="text-2xl font-bold mb-4">{modoEdicion ? "Editar subject" : "Agregar subject"}</h2>
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
                value={subject?.id || ""}
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
                disabled={isSubmitting}
            >
            {isSubmitting 
                        ? "Agregando..." 
                        : modoEdicion
                            ? "Actualizar" 
                            : "Agregar materia"
                    }
            </button>
            <button
                type="button"
                onClick={() => {
                    onCancel();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={isSubmitting}
            >
                Cancelar
            </button>
        </form>
        </div>
    );
}
