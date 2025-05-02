import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Teacher } from "@/models/Teacher";
import { TeacherForm } from "@/components/form/TeacherForm";
import { getAllProfessors,deleteProfessor,updateProfessor } from "../services/Teacher/addTeacher";

type DashboardContextType = {
    setPageTitle: (title: string) => void;
};  

export function TeachersPage() {
    const [profesores, setProfesores] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setPageTitle } = useOutletContext<DashboardContextType>();

    useEffect(() => {
        setPageTitle("👤 Profesores");
        return () => setPageTitle("Dashboard");
    }, [setPageTitle]);

    // useEffect(() => {
    //     const loaded = loadFromStorage<Teacher[]>(
    //         "profesores",
    //         [] as Teacher[]
    //     );
    //     setProfesores(loaded);
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const professorsData = await getAllProfessors();
                setProfesores(professorsData as Teacher[]);
                setError(null);
            } catch (error) {
                console.error("Error al cargar los profesores:", error);
                setError("Error al cargar los profesores.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     saveToStorage<Teacher[]>("materias", profesores);
    // }, [profesores]);

    const addProfesor = (profesor: Teacher) => {
        setProfesores((prev) => [...prev, profesor]);
    };

    const handleDeleteProfesor = async (id: string) => {
        if (!id) return;

        if (window.confirm("¿Estás seguro que deseas eliminar este profesor?")) {
            try {
                await deleteProfessor(id);
                setProfesores((prevProfesores) => 
                    prevProfesores.filter(profesor => profesor.id !== id)
                );
            } catch (err) {
                console.error("Error al eliminar el profesor:", err);
                alert("No se pudo eliminar el profesor. Por favor, intenta de nuevo.");
            }
        }
    };

    const [profesorEditando, setProfesorEditando] = useState<Teacher | null>(null);

    const handleEditProfesor = async (profesor: Teacher) => {
        if (!profesor.id) return;
        setProfesorEditando(profesor);
        setShowForm(true);
    };

    const handleUpdateProfesor = async (profesorActualizado: Teacher) => {
        try{
            if(!profesorActualizado.id) return;
            await updateProfessor(profesorActualizado.id,{
                ...profesorActualizado,
                updatedAt: new Date()
            });
            setProfesores((prevProfesores) => 
                prevProfesores.map(p=>
                    p.id === profesorActualizado.id ? profesorActualizado : p
                )
            );
            setProfesorEditando(null);
            setShowForm(false);
        }catch(err){
            console.error("Error al actualizar el profesor:", err);
            alert("No se pudo actualizar el profesor. Por favor, intenta de nuevo.");
        }
    };

    const handleCancelEdit = () => {
        setProfesorEditando(null);
        setShowForm(false);
    }

    const [showForm, setShowForm] = useState(false);

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

    return (
        <div className="p-2 max-w-xl mx-auto"> 
            <div className="mb-4">
                {profesores.length > 0 && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {showForm ? "Ver Profesores" : "Añadir Profesor"}
                    </button>
                )}
            </div>

            {showForm ? (
                <TeacherForm 
                    onAdd={profesorEditando ? handleUpdateProfesor : addProfesor}
                    onCancel={handleCancelEdit}
                    profesorInicial={profesorEditando}
                    modoEdicion={!!profesorEditando}
                    />
            ) : profesores.length === 0 ? (
                <div className="text-center mt-2">
                    <p>No hay ningun profesor registrado.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    >
                        ¿Desea agregar uno?
                    </button>
                </div>
            ) : null}

            {showForm ? null : (
                <ul className="mt-4 space-y-2 rounded-r-md">
                    {profesores.map((p) => (
                        <li
                            key={p.id}
                            className="border p-3 rounded shadow flex justify-between items-center"
                        >
                            <div>
                                <h2>{`${p.name} ${p.lastName}`}</h2>
                                {p.phoneNumber && <p>Telefono: {p.phoneNumber}</p>}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        p.id && handleDeleteProfesor(p.id);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => {
                                        handleEditProfesor(p);
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
