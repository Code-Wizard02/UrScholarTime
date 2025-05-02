// src/components/TareaForm.tsx
import { Subject as Materia } from "../../models/Subject";
import { Tarea } from "../../types/tarea";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  materias: Materia[];
  onAdd: (tarea: Tarea) => void;
};

export function TareaForm({ materias, onAdd }: Props) {
  const [nombre, setNombre] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [dificultad, setDificultad] = useState(3);
  const [fechaLimite, setFechaLimite] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const materia = materias.find((m) => m.id === materiaId);
    if (!materia) return;

    const nuevaTarea: Tarea = {
      id: uuidv4(),
      nombre,
      materiaId: materia,
      dificultad,
      fechaLimite: new Date(fechaLimite),
      fechaCreacion: new Date(),
      fechaEntrega: "", // Assuming null as default for fechaEntrega
      completada: false, // Assuming false as default for completada
    };

    onAdd(nuevaTarea);
    setNombre("");
    setMateriaId("");
    setDificultad(3);
    setFechaLimite("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nombre de la tarea"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={materiaId}
        onChange={(e) => setMateriaId(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Selecciona una materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <input
        type="range"
        min={1}
        max={5}
        value={dificultad}
        onChange={(e) => setDificultad(Number(e.target.value))}
        className="w-full"
      />
      <input
        type="datetime-local"
        value={fechaLimite}
        onChange={(e) => setFechaLimite(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Agregar Tarea
      </button>
    </form>
  );
}
