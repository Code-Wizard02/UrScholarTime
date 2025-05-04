import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Subject as Materia } from "../../models/Subject";

export const saveSubject = async (materia: Materia, userId: string): Promise<void> => {
    try {
        const materiasCollection = "subjects";
        const docRef = doc(db, materiasCollection, materia.id);
        await setDoc(docRef, {
            ...materia,
            userId, // Asociar la materia al usuario
            createdAt: new Date(), // Fecha de creación
        });
        console.log("Materia guardada exitosamente con ID:", materia.id);
    } catch (error) {
        console.error("Error al guardar la materia:", error);
        throw error; // Propagar el error para manejarlo en el componente
    }
};

export const getSubjectsByUser = async (userId: string): Promise<Materia[]> => {
    try {
        const materiasCollection = collection(db, "subjects"); // Referencia a la colección "subjects"
        const q = query(materiasCollection, where("userId", "==", userId)); // Filtrar por userId
        const querySnapshot = await getDocs(q); // Obtener los documentos
        const materias: Materia[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Materia[]; // Mapear los datos a la interfaz Materia
        return materias;
    } catch (error) {
        console.error("Error al obtener las materias:", error);
        throw error; // Propagar el error para manejarlo en el componente
    }
};