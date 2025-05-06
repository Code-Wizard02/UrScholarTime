import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Subject } from '@/models/Subject';

// Nombre de la colección en Firestore
const COLLECTION_NAME = 'subjects';

const getCurrentUserId = (): string => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No hay usuario autenticado');
  }
  return currentUser.uid;
};

/**
 * Añade un nuevo profesor a Firestore
 */
export const addSubject = async (Subject: Omit<Subject, 'id'>): Promise<string> => {
    try {
        const userId = getCurrentUserId();
        console.log(' add userId', userId);

        const SubjectWithUserId = {
            ...Subject,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: userId,
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME),SubjectWithUserId);
        console.log('Materia añadida con ID:', docRef.id);
        await updateDoc(docRef, {id: docRef.id});
    
        return docRef.id;
    } catch (error) {
        console.error('Error añadiendo materia:', error);
        throw error;
    }
};

/**
 * Obtiene todos los profesores
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
  try {
    const userId = auth.currentUser?.uid; // Manejar el caso en que no hay usuario autenticado
    if (!userId) {
      throw new Error('No hay usuario autenticado');
    }
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Subject));
  } catch (error) {
    console.error('Error obteniendo materias:', error);
    throw error;
  }
};

/**
 * Obtiene un profesor por su ID
 */
export const getSubjecById = async (id: string): Promise<Subject | null> => {
  try {
    const userId = auth.currentUser?.uid; // Manejar el caso en que no hay usuario autenticado
    if (!userId) {
      throw new Error('No hay usuario autenticado');
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.userId === userId) {
        return { id: docSnap.id, ...data } as Subject;
      } else {
        console.error('La materia no pertenece al usuario actual');
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo materia:', error);
    throw error;
  }
};

/**
 * Actualiza un profesor existente
 */
export const updateSubject = async (id: string, data: Partial<Subject>): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid; // Manejar el caso en que no hay usuario autenticado
    if (!userId) {
      throw new Error('No hay usuario autenticado');
    }
    const SubjectRef = doc(db, COLLECTION_NAME, id);
    console.log('Intentando actualizar materia con Id:',id );
    const docSnap = await getDoc(SubjectRef);

    if (!docSnap.exists()) {
      throw new Error('La materia no existe');
    }
    
    const SubjectData = docSnap.data();
    if (SubjectData.userId !== userId) {
      throw new Error('La materia no pertenece al usuario actual');
    }

    await updateDoc(SubjectRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error actualizando materia:', error);
    throw error;
  }
};

/**
 * Elimina un profesor por su ID
 */
export const deleteSubject = async (id: string): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid; // Manejar el caso en que no hay usuario autenticado
    if (!userId) {
      throw new Error('No hay usuario autenticado');
    }
    console.log('Intentando eliminar materia con Id:',id );
    const SubjectRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(SubjectRef);

    if (!docSnap.exists()) {
      throw new Error('La materia no existe');
    }
    
    const SubjectData = docSnap.data();
    if (SubjectData.userId !== userId) {
      throw new Error('No tienes permiso para eliminar esta materia');
    }
    await deleteDoc(SubjectRef);
  } catch (error) {
    console.error('Error eliminando materia:', error);
    throw error;
  }
};