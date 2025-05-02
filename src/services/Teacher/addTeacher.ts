import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Teacher as Professor } from '@/models/Teacher';

// Nombre de la colección en Firestore
const COLLECTION_NAME = 'professors';

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
export const addProfessor = async (professor: Omit<Professor, 'id'>): Promise<string> => {
  try {
    const userId = getCurrentUserId();

    const professorWithUserId = {
      ...professor,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME),professorWithUserId);
    return docRef.id;
  } catch (error) {
    console.error('Error añadiendo profesor:', error);
    throw error;
  }
};

/**
 * Obtiene todos los profesores
 */
export const getAllProfessors = async (): Promise<Professor[]> => {
  try {
    const userId = getCurrentUserId();
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Professor));
  } catch (error) {
    console.error('Error obteniendo profesores:', error);
    throw error;
  }
};

/**
 * Obtiene un profesor por su ID
 */
export const getProfessorById = async (id: string): Promise<Professor | null> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.userId === userId) {
        return { id: docSnap.id, ...data } as Professor;
      } else {
        console.error('El profesor no pertenece al usuario actual');
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo profesor:', error);
    throw error;
  }
};

/**
 * Actualiza un profesor existente
 */
export const updateProfessor = async (id: string, data: Partial<Professor>): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const professorRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(professorRef);

    if (!docSnap.exists()) {
      throw new Error('El profesor no existe');
    }
    
    const professorData = docSnap.data();
    if (professorData.userId !== userId) {
      throw new Error('El profesor no pertenece al usuario actual');
    }

    await updateDoc(professorRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error actualizando profesor:', error);
    throw error;
  }
};

/**
 * Elimina un profesor por su ID
 */
export const deleteProfessor = async (id: string): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const professorRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(professorRef);

    if (!docSnap.exists()) {
      throw new Error('El profesor no existe');
    }
    
    const professorData = docSnap.data();
    if (professorData.userId !== userId) {
      throw new Error('No tienes permiso para eliminar este profesor');
    }
    await deleteDoc(professorRef);
  } catch (error) {
    console.error('Error eliminando profesor:', error);
    throw error;
  }
};