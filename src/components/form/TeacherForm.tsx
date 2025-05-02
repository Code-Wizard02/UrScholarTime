import { useEffect, useState } from "react";
import { Teacher } from "@/models/Teacher";
import { v4 as uuidv4 } from "uuid";
import { addProfessor } from "../../services/Teacher/addTeacher"
import { auth } from "@/firebase";

interface TeacherFormProps{
    onAdd: (profesor: Teacher) => void;
    onCancel: () => void;
    profesorInicial?: Teacher | null;
    modoEdicion?: boolean;
}

export function TeacherForm({ 
    onAdd,
    onCancel,
    profesorInicial = null,
    modoEdicion=false
}: TeacherFormProps) {
    const [nombre, setNombre] = useState("");
    const [apellido,setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (profesorInicial) {
            setNombre(profesorInicial.name || "");
            setApellido(profesorInicial.lastName || "");
            setTelefono(profesorInicial.phoneNumber || "");
        }
    }, [profesorInicial]);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try{
            if (modoEdicion && profesorInicial && profesorInicial.id) {
                const profesorActualizado: Teacher = {
                    ...profesorInicial,
                    name: nombre,
                    lastName: apellido,
                    phoneNumber: telefono,
                    updatedAt: new Date(),
                }
                onAdd(profesorActualizado);
            }else{
                const nuevoProfesor: Teacher = {
                    id: uuidv4(),
                    name: nombre,
                    lastName: apellido,
                    phoneNumber: telefono,
                    userId: auth.currentUser?.uid || "userId",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const teacherId = await addProfessor(nuevoProfesor);

                const teacherWithId={
                    ...nuevoProfesor,
                    id: teacherId,
                };
                onAdd(teacherWithId);
                setNombre("");
                setApellido("");
                setTelefono("");
            }
        }catch (error) {
            console.error("Error al agregar el profesor:", error);
            alert("Error al agregar el profesor. Por favor, intenta de nuevo.");
        }finally {
            setIsSubmitting(false);
        }       
    };


    return (
        <form onSubmit={handleSubmit} 
            className="space-y-4 p-4">
            <h2 className="text-xl font-bold">{modoEdicion ? "Editar profesor" : "Agregar profesor"}</h2>
            <input
                type="text"
                placeholder="Nombre del profesor"
                className="w-full border rounded p-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Apellido"
                className="w-full border rounded p-2"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Teléfono"
                className="w-full border rounded p-2"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
            />
            <div className="flex space-x-2 justify-around">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={isSubmitting}
                >
                    {isSubmitting 
                        ? "Agregando..." 
                        : modoEdicion
                            ? "Actualizar" 
                            : "Agregar profesor"
                    }
                
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
