// src/pages/TareasPage.tsx
import { Tarea } from "../types/tarea";
import { useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { Subject as Materia } from "../models/Subject";
import { TareaForm } from "../components/form/TareaForm";
import { ordenarPorPrioridad } from "../utils/priorizar";
import { useOutletContext } from "react-router-dom";

type DashboardContextType={
  setPageTitle: (title: string) => void;
}

export function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const { setPageTitle } = useOutletContext<DashboardContextType>();
  
  useEffect(() => {
    setPageTitle("📝 Tareas");
    return() => setPageTitle("Dashboard");
  }, [setPageTitle]);

  useEffect(() => {
    setTareas(loadFromStorage<Tarea[]>("tareas", []));
    setMaterias(loadFromStorage<Materia[]>("materias", []));
  }, []);

  useEffect(() => {
    saveToStorage("tareas", tareas);
  }, [tareas]);

  const handleAdd = (nueva: Tarea) => {
    setTareas((prev) => [...prev, nueva]);
  };

  const [tareasOrdenadas, setTareasOrdenadas] = useState<Tarea[]>([]);

  useEffect(() => {
    const actualizar = () => {
      setTareasOrdenadas(ordenarPorPrioridad(tareasFiltradas));
    };

    actualizar();
    const intervalo = setInterval(actualizar, 1000 * 60); // Cada minuto
    return () => clearInterval(intervalo); // Limpiar el intervalo al desmontar
  }, [tareas]);

  const calcularPrioridad = (tarea: Tarea) => {
    const ahora = new Date().getTime();
    const tiempoRestante = new Date(tarea.fechaLimite).getTime() - ahora;
    const prioridad = Math.max(
      0,
      Math.min(1, 1 - tiempoRestante / (1000 * 60 * 60 * 24 * 7))
    ); // Prioridad basada en 7 días
    return prioridad;
  };

  const [filtro, setFiltro] = useState<
    "todas" | "urgentes" | "dificiles" | "baja"
  >("todas");

  const tareasFiltradas = tareas.filter((t) => {
    const horasRestantes =
      (new Date(t.fechaLimite).getTime() - Date.now()) / 3600000;
    if (filtro === "urgentes") return horasRestantes < 24;
    if (filtro === "dificiles") return t.dificultad >= 4;
    return true;
  });

  const marcarComoCompletada = (id: string) => {
    const tareasActualizadas = tareas.map((t) =>
      t.id === id ? { ...t, completada: true, fechaCompletada: new Date() } : t
    );
    setTareas(tareasActualizadas);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TareaForm materias={materias} onAdd={handleAdd} />
      <div className="flex gap-3 mt-4">
        <button onClick={() => setFiltro("todas")} className="btn">
          Todas
        </button>
        <button
          onClick={() => setFiltro("urgentes")}
          className="btn text-red-600"
        >
          Urgentes
        </button>
        <button
          onClick={() => setFiltro("dificiles")}
          className="btn text-yellow-600"
        >
          Difíciles
        </button>
      </div>
      <ul className="mt-6 space-y-3">
        {ordenarPorPrioridad(tareasOrdenadas).map((t) => (
          <li key={t.id} className="border p-4 rounded shadow">
            <div className="font-bold">{t.nombre}</div>
            <div className="text-sm text-gray-600">
              Materia: {t.materiaId.name} | Dificultad: {t.dificultad}
            </div>
            <div className="text-sm">
              Entregar antes del{" "}
              <span className="text-red-500">
                {new Date(t.fechaLimite).toLocaleString()}
              </span>
            </div>

            <div className="h-2 w-full bg-gray-200 rounded mt-2">
              <div
                className="h-2 rounded"
                style={{
                  width: `${Math.min(calcularPrioridad(t) * 100, 100)}%`,
                  backgroundColor:
                    calcularPrioridad(t) > 0.6
                      ? "#dc2626"
                      : calcularPrioridad(t) > 0.3
                      ? "#facc15"
                      : "#10b981",
                }}
              />
            </div>

            {t.fechaEntrega ? (
              <p className="text-green-600 text-sm mt-2">
                ✅ Entregada el{" "}
                {new Date(t.fechaEntrega.toString()).toLocaleString()}
              </p>
            ) : (
              <button
                onClick={() => marcarComoCompletada(t.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 mt-2 rounded"
              >
                Marcar como entregada
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
