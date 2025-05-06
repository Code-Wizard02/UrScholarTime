import { useEffect, useState } from "react";
import { Subject as Materia } from "../models/Subject";
import { MateriaForm } from "../components/form/SubjectForm";
import { useOutletContext } from "react-router-dom";
import { getAllSubjects, deleteSubject, updateSubject } from "@/services/Subject/crudSubject";

type DashboardContextType = {
    setPageTitle: (title: string) => void;
};  

export function MateriasPage() {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setPageTitle } = useOutletContext<DashboardContextType>();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        setPageTitle("📚 Materias");
        return () => setPageTitle("Dashboard");
    }, [setPageTitle]);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                setLoading(true);
                const materiasData = await getAllSubjects();
                setMaterias(materiasData as Materia[]);
                setError(null);
            } catch (error) {
                console.error("Error al obtener las materias:", error);
                setError("Error al obtener las materias.");
            } finally {
                setLoading(false);
            }
        };
        fetchMaterias();
    }, []);

    // useEffect(() => {
    //     saveToStorage<Materia[]>("materias", materias);
    // }, [materias]);

    const addMateria = (materia: Materia) => {
        setMaterias((prev) => [...prev, materia]);
    };

    const handleDeleteMateria = async (id: string) => {
        if (!id) return;

        if (window.confirm("¿Estás seguro que deseas eliminar esta materia?")) {
            try {
                await deleteSubject(id);
                const updatedMaterias = materias.filter((materia) => materia.id !== id);
                setMaterias(updatedMaterias);
            } catch (error) {
                console.error("Error al eliminar la materia:", error);
            }
        }
    };

    const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null);

    const handleEditSubject = async (materia: Materia) => {
        if (!materia.id) return;
        setMateriaEditando(materia);
        setShowForm(true);
    }

    const handleUpdateMateria = async (materiaActualizada: Materia) => {
        try {
            if (!materiaActualizada.id) return;
            await updateSubject(materiaActualizada.id,{
                ...materiaActualizada,
                updatedAt: new Date(),
            });
            setMaterias((prevMaterias) =>
                prevMaterias.map((materia) =>
                    materia.id === materiaActualizada.id ? materiaActualizada : materia
                )
            );
            setMateriaEditando(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al actualizar la materia:", error);
            alert("No se pudo actualizar la materia. Por favor, intenta de nuevo.");
        }
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setMateriaEditando(null);
    }

    if (loading) {
        return <div className="text-center mt-2">Cargando...</div>;
    }
    if (error) {
        return (
            <div className="text-center p-6 text-red-500">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }


//     const handleAddMateria = (materia: Materia) => {
//     setMaterias([...materias, materia]);
// };

    return (
        <div className="p-2 max-w-xl mx-auto"> 
            <div className="mb-4">
                {materias.length > 0 && (
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {showForm ? "Ver Materias" : "Añadir Materia"}
                    </button>
                )}
            </div>

            {showForm ? (
                <MateriaForm 
                    onAdd={materiaEditando ? handleUpdateMateria : addMateria}
                    onCancel={handleCancelEdit}
                    materiaInicial={materiaEditando}
                    modoEdicion={!!materiaEditando}
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
                                        m.id && handleDeleteMateria(m.id);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => {
                                        handleEditSubject(m);
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
