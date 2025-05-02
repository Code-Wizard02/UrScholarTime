import { useEffect, useState } from "react";
import { Tarea } from "../types/tarea"; 
import { calcularPrioridad } from "../utils/priorizar";

export const useNotificacionesDesdeTareas = (tareas: Tarea[]) => {
  const [notificaciones, setNotificaciones] = useState<{
    id: string;
    mensaje: string;
    tipo: string;
    fecha: string;
    leido: boolean;
  }[]>([]);

  useEffect(() => {
    const ahora = new Date();
    const nuevas: {
      id: string;
      mensaje: string;
      tipo: string;
      fecha: string;
      leido: boolean;
    }[] = [];

    tareas.forEach((tarea) => {
      const fechaLimite = new Date(tarea.fechaLimite);
      const horasRestantes =
        (fechaLimite.getTime() - ahora.getTime()) / (1000 * 60 * 60);

      // Notificación por urgencia (alta prioridad)
      const prioridad = calcularPrioridad(tarea);
      if (prioridad > 0.6) {
        nuevas.push({
          id: `urgente-${tarea.id}`,
          mensaje: `⚠️ Tarea urgente: '${tarea.nombre}' requiere atención.`,
          tipo: "urgente",
          fecha: ahora.toISOString(),
          leido: false,
        });
      }

      // Notificación por entrega próxima (menos de 24 horas)
      if (horasRestantes < 24 && horasRestantes > 0) {
        nuevas.push({
          id: `vence-${tarea.id}`,
          mensaje: `⏳ '${tarea.nombre}' vence en menos de 24 horas.`,
          tipo: "tiempo",
          fecha: ahora.toISOString(),
          leido: false,
        });
      }
    });

    setNotificaciones(nuevas);
  }, [tareas]);

  return [notificaciones, setNotificaciones];
};
