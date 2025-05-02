import { useEffect, useState } from "react";
import { Subject as Materia } from "../models/Subject";
import { MateriaForm } from "../components/form/SubjectForm";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { useOutletContext } from "react-router-dom";

type DashboardContextType = {
    setPageTitle: (title: string) => void;
};  

export function MateriasPage() {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const { setPageTitle } = useOutletContext<DashboardContextType>();

    useEffect(() => {
        setPageTitle("📚 Materias");
        return () => setPageTitle("Dashboard");
    }, [setPageTitle]);

    useEffect(() => {
        const loaded = loadFromStorage<Materia[]>(
            "materias",
            [] as Materia[]
        );
        setMaterias(loaded);
    }, []);

    useEffect(() => {
        saveToStorage<Materia[]>("materias", materias);
    }, [materias]);

    const addMateria = (materia: Materia) => {
        setMaterias((prev) => [...prev, materia]);
    };

//     const handleAddMateria = (materia: Materia) => {
//     setMaterias([...materias, materia]);
// };

    const [showForm, setShowForm] = useState(false);

    return (
        <div className="p-2 max-w-xl mx-auto"> 
            <div className="mb-4">
                {materias.length > 0 && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {showForm ? "Ver Materias" : "Añadir Materia"}
                    </button>
                )}
            </div>

            {showForm ? (
                <MateriaForm 
                    onAdd={addMateria}
                    onCancel={()=>{setShowForm(false)}}
                    />
            ) : materias.length === 0 ? (
                <div className="text-center mt-2">
                    <p>No hay ninguna materia registrada.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    >
                        ¿Desea agregar una?
                    </button>
                </div>
            ) : null}

            {showForm ? null : (
                <ul className="mt-4 space-y-2 rounded-r-md">
                    {materias.map((m) => (
                        <li
                            key={m.id}
                            className="border p-3 rounded shadow flex justify-between items-center"
                        >
                            <div>
                                <h2 className="font-bold">{m.name}</h2>
                                <p>Profesor: {m.teacher.name}</p>
                                <p>Aula: {m.classroom}</p>
                                <p>Dificultad: {m.difficulty}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        const updatedMaterias = materias.filter(
                                            (materia) => materia.id !== m.id
                                        );
                                        setMaterias(updatedMaterias);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => {
                                        const updatedName = prompt(
                                            "Editar nombre de la materia:",
                                            m.name
                                        );
                                        if (updatedName) {
                                            const updatedMaterias = materias.map((materia) =>
                                                materia.id === m.id
                                                    ? { ...materia, name: updatedName }
                                                    : materia
                                            );
                                            setMaterias(updatedMaterias);
                                        }
                                    }}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Editar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
