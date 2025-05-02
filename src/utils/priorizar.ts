// src/utils/priorizar.ts
import { Tarea } from "../types/tarea";

export function calcularPrioridad(tarea: Tarea): number {
  const ahora = new Date();
  const fechaLimite = new Date(tarea.fechaLimite);

  // Tiempo restante en horas
  const horasRestantes = Math.max(
    (fechaLimite.getTime() - ahora.getTime()) / (1000 * 60 * 60),
    1 // Para evitar dividir entre cero o negativos
  );

  // Fórmula: prioridad = (dificultad * peso) + (urgencia inversa * peso)
  // Más dificultad = mayor prioridad
  // Menos horas restantes = mayor prioridad

  const pesoDificultad = 0.6;
  const pesoUrgencia = 0.4;

  const dificultadNormalizada = tarea.dificultad / 5; // [0,1]
  const urgenciaInversa = 1 / horasRestantes; // Menos horas = más valor

  return dificultadNormalizada * pesoDificultad + urgenciaInversa * pesoUrgencia;
}

export function ordenarPorPrioridad(tareas: Tarea[]): Tarea[] {
  return [...tareas].sort((a, b) => {
    const prioA = calcularPrioridad(a);
    const prioB = calcularPrioridad(b);
    return prioB - prioA; // Mayor prioridad arriba
  });
}
