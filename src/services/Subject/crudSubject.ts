import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Subject as Materia } from "../../models/Subject";

export const saveSubject = async (materia: Materia, userId: string): Promise<void> => {
    try {
        const materiasCollection = collection(db, "subjects"); // Referencia a la colección "subjects"
        await addDoc(materiasCollection, {
            ...materia,
            userId, // Asociar la materia al usuario
            createdAt: new Date(), // Fecha de creación
        });
        console.log("Materia guardada exitosamente");
    } catch (error) {
        console.error("Error al guardar la materia:", error);
        throw error; // Propagar el error para manejarlo en el componente
    }
};