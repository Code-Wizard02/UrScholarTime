import { useEffect, useState } from "react";
import { Subject as Materia } from "../models/Subject";
import { ScheduleClass as HorarioClase } from "../models/ScheduleEntry";
import { HorarioForm } from "../components/form/ScheduleForm";
import { MateriaForm } from "../components/form/SubjectForm";
import { loadFromStorage, saveToStorage } from "../utils/storage";

export function HorarioPage() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [horarios, setHorarios] = useState<HorarioClase[]>([]);

  useEffect(() => {
    const storedHorarios = loadFromStorage<HorarioClase[]>(
      "horarios",
      [] as HorarioClase[]
    );
    setHorarios(storedHorarios);
  }, []);

  useEffect(() => {
    saveToStorage<HorarioClase[]>("horarios", horarios);
  }, [horarios]);

  const addHorario = (horario: HorarioClase) =>
    setHorarios((prev) => [...prev, horario]);

  const addMateria = (materia: Materia) => setMaterias([...materias, materia]);
  
  // const addHorario = (horario: HorarioClase) =>
  //   setHorarios([...horarios, horario]);

  const obtenerNombreMateria = (id: string) =>
    materias.find((m) => m.id === id)?.name || "Desconocido";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📅 Horario Semanal</h1>
      <MateriaForm onAdd={addMateria} />
      <hr className="my-6" />
      <HorarioForm materias={materias} onAdd={addHorario} />

      <ul className="mt-6 space-y-2">
        {horarios.map((h) => (
          <li key={h.id} className="border p-3 rounded shadow">
            <p className="font-bold">{obtenerNombreMateria(h.subjectId)}</p>
            <p>{h.day} — {h.startTime} a {h.endTime}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
