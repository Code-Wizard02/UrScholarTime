import { useState } from "react";
import { ScheduleClass as HorarioClase } from "../../models/ScheduleEntry";
import { Subject as Materia } from "../../models/Subject";
import { v4 as uuidv4 } from "uuid";

interface Props {
    materias: Materia[];
    onAdd: (nuevo: HorarioClase) => void;
}

export function HorarioForm({ materias, onAdd }: Props) {
    const [materiaId, setMateriaId] = useState("");
    const [dia, setDia] = useState("Lunes");
    const [horaInicio, setHoraInicio] = useState("08:00");
    const [horaFin, setHoraFin] = useState("09:00");

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiaId) return;

    onAdd({
        id: uuidv4(),
        subjectId: materiaId,
        day:dia,
        startTime:horaInicio,
        endTime:horaFin,
    });

    setMateriaId("");
    setDia("Lunes");
    setHoraInicio("08:00");
    setHoraFin("09:00");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <select
        value={materiaId}
        onChange={(e) => setMateriaId(e.target.value)}
        className="w-full border rounded p-2"
        required
      >
        <option value="">Selecciona una materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <select
        value={dia}
        onChange={(e) => setDia(e.target.value)}
        className="w-full border rounded p-2"
      >
        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          className="border p-2 rounded w-1/2"
          required
        />
        <input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
          className="border p-2 rounded w-1/2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Agregar al horario
      </button>
    </form>
  );
}
