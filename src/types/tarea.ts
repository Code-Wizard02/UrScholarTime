import { Subject } from "../models/Subject";

export type Tarea = {
    id: string;
    nombre: string;
    materiaId: Subject;
    dificultad: number; // 1 a 5
    fechaLimite: Date;
    fechaCreacion: Date;
    fechaEntrega: String;
    completada: boolean;
};