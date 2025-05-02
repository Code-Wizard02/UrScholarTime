import React from "react";
import { useEffect, useState } from "react";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  BarChart,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  PieChartIcon
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tarea } from "../types/tarea";
import { Button } from "../components/ui/button";

const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: "Tarea 1", fecha: new Date(), leido: false },
    { id: 2, mensaje: "Tarea 2", fecha: new Date(), leido: false },
    { id: 3, mensaje: "Tarea 3", fecha: new Date(), leido: false },
  ]);

  useEffect(() => {
    const data = localStorage.getItem("tareas");
    if (data) setTareas(JSON.parse(data));
  }, []);

  const tareasPendientes = tareas.filter((t) => !t.completada).length;
  const tareasCompletadas = tareas.filter((t) => t.completada).length;

  const pieData = [
    { name: "Completadas", value: tareasCompletadas },
    { name: "Pendientes", value: tareasPendientes },
  ];

  const dificultadLabels = {
    1: "Fácil",
    2: "Media",
    3: "Difícil",
  };

  const tareasPorDificultad = [1, 2, 3].map((nivel) => {
    return {
      name: dificultadLabels[nivel as 1 | 2 | 3],
      value: tareas.filter((t) => t.dificultad === nivel).length,
    };
  });

  const ahora = new Date();

  const tareasUrgentes = [...tareas]
    .filter((t) => new Date(t.fechaLimite) > ahora)
    .sort(
      (a, b) =>
        new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()
    )
    .slice(0, 5); // Solo las 5 más próximas

  const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24", "#a78bfa"];

  const tareasEntregadas = tareas.filter((t) => t.fechaEntrega);

  const entregasStats = tareasEntregadas.reduce(
    (acc, tarea) => {
      const limite = new Date(tarea.fechaLimite).getTime();
      const entrega = new Date(tarea.fechaEntrega as string).getTime();

      if (entrega <= limite) {
        acc.aTiempo += 1;
      } else {
        acc.tarde += 1;
      }

      return acc;
    },
    { aTiempo: 0, tarde: 0 }
  );

  const data = [
    { tipo: "A tiempo", cantidad: entregasStats.aTiempo },
    { tipo: "Tarde", cantidad: entregasStats.tarde },
  ];

  const marcarNotificacionComoLeida = (id: number) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
    );
  };

  // const BuzonNotificaciones: React.FC<{
  //     notificaciones: typeof notificaciones;
  //     onMarcarLeido: (id: number) => void;
  // }> = ({ notificaciones, onMarcarLeido }) => {
  //     return (
  //         <div className="bg-gray-500 p-4 rounded shadow max-w-md">
  //             <h2 className="text-xl font-semibold mb-3">🔔 Notificaciones</h2>
  //             <ul className="space-y-2 max-h-64 overflow-y-auto">
  //                 {notificaciones.length === 0 ? (
  //                     <p className="text-gray-500">No hay notificaciones.</p>
  //                 ) : (
  //                     notificaciones.map((n) => (
  //                         <li
  //                             key={n.id}
  //                             className={`p-3 rounded border ${
  //                                 n.leido ? "bg-gray-100" : "bg-yellow-50"
  //                             }`}
  //                         >
  //                             <p className="text-sm">{n.mensaje}</p>
  //                             <p className="text-xs text-gray-500">
  //                                 {new Date(n.fecha).toLocaleString()}
  //                             </p>
  //                             {!n.leido && (
  //                                 <button
  //                                     onClick={() => onMarcarLeido(n.id)}
  //                                     className="text-blue-500 text-xs mt-1"
  //                                 >
  //                                     Marcar como leído
  //                                 </button>
  //                             )}
  //                         </li>
  //                     ))
  //                 )}
  //             </ul>
  //         </div>
  //     );
  // };

  return (
    <div className="max-w-screen min-h-screen bg-gray-50 dark:bg-gray-900">
      
      

  
      <main className="container mx-auto px-2 sm:px-4 py-4 md:py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
          <Card>
            <CardHeader className="pb-1 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                Total de tareas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold">{tareas.length}</div>
                <PieChartIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader className="pb-1 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                Tareas completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600">
                  {tareasCompletadas}
                </div>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
  
          <Card className="sm:col-span-2 md:col-span-1">
            <CardHeader className="pb-1 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                Tareas pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold text-amber-600">
                  {tareasPendientes}
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Progress Chart */}
          <Card>
            <CardHeader className="pb-1 md:pb-3">
              <CardTitle className="text-base md:text-lg">Progreso de Tareas</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Distribución de tareas completadas y pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 768 ? 70 : 100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        window.innerWidth < 640 
                          ? `${(percent * 100).toFixed(0)}%`
                          : `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={window.innerWidth >= 640}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? COLORS[0] : COLORS[1]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tareas`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
  
          {/* Difficulty Chart */}
          <Card>
            <CardHeader className="pb-1 md:pb-3">
              <CardTitle className="text-base md:text-lg">Tareas por Dificultad</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Distribución según nivel de dificultad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tareasPorDificultad}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 768 ? 70 : 100}
                      label={({ name, percent }) =>
                        window.innerWidth < 640 
                          ? `${(percent * 100).toFixed(0)}%`
                          : `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={window.innerWidth >= 640}
                    >
                      {tareasPorDificultad.map((_, index) => (
                        <Cell
                          key={`cell-difficulty-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tareas`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Urgent Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2">
              <div>
                <CardTitle className="text-base md:text-lg">Tareas Urgentes</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Las 5 tareas más próximas a vencer
                </CardDescription>
              </div>
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              {tareasUrgentes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
                  <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-emerald-500 mb-2" />
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                    No hay tareas urgentes por ahora.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {tareasUrgentes.map((tarea) => (
                    <div
                      key={tarea.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1 min-w-0 mb-1 sm:mb-0">
                        <p className="text-sm md:text-base font-medium truncate">{tarea.nombre}</p>
                        <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                          <Badge className="text-xs px-1 py-0 md:px-2 md:py-0.5">
                            {String(tarea.materiaId)}
                          </Badge>
                          <Badge
                            className={`text-xs px-1 py-0 md:px-2 md:py-0.5 ${
                              tarea.dificultad === 1
                                ? "bg-gray-200 text-gray-800"
                                : tarea.dificultad === 2
                                ? "bg-blue-200 text-blue-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {dificultadLabels[tarea.dificultad as 1 | 2 | 3]}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap sm:ml-2 md:ml-4">
                        {new Date(tarea.fechaLimite).toLocaleDateString()}&nbsp;
                        {new Date(tarea.fechaLimite).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
  
          {/* Delivery History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2">
              <div>
                <CardTitle className="text-base md:text-lg">Historial de Entregas</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Entregas a tiempo vs. entregas tardías
                </CardDescription>
              </div>
              <BarChart className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              {tareasEntregadas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
                  <Clock className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-2" />
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                    Aún no has entregado ninguna tarea.
                  </p>
                </div>
              ) : (
                <div className="h-[200px] md:h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={data}
                      margin={{ 
                        top: 20, 
                        right: window.innerWidth < 768 ? 10 : 30, 
                        left: window.innerWidth < 768 ? 10 : 20, 
                        bottom: 5 
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="tipo" tick={{fontSize: window.innerWidth < 768 ? 10 : 12}} />
                      <YAxis tick={{fontSize: window.innerWidth < 768 ? 10 : 12}} />
                      <Tooltip />
                      <Bar
                        dataKey="cantidad"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
  
        {/* Notifications */}
        <div className="mt-4 md:mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2">
              <div>
                <CardTitle className="text-base md:text-lg">Notificaciones</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Últimas actualizaciones y recordatorios
                </CardDescription>
              </div>
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              {notificaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
                  <Bell className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-2" />
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                    No hay notificaciones.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {notificaciones.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 md:p-3 rounded-lg border ${
                        n.leido
                          ? "bg-gray-50 dark:bg-gray-800"
                          : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      <p className="text-xs md:text-sm">{n.mensaje}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">
                          {new Date(n.fecha).toLocaleString()}
                        </p>
                        {!n.leido && (
                          <Button
                            onClick={() => marcarNotificacionComoLeida(n.id)}
                            className="h-6 md:h-7 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            Marcar como leído
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

//     return (
//         <div style={{ padding: "20px" }}>
//             <Link to="/profile">Editar Perfil</Link>
//             <LogoutButton />

//             <h1>Dashboard</h1>
//             <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//                 <div
//                     style={{
//                         padding: "20px",
//                         border: "1px solid #ccc",
//                         borderRadius: "8px",
//                     }}
//                 >
//                     <h2>Progreso de Tareas</h2>
//                     <ResponsiveContainer width="100%" height={250}>
//                         <PieChart>
//                             <Pie
//                                 data={pieData}
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={80}
//                                 fill="#8884d8"
//                                 dataKey="value"
//                                 label
//                             >
//                                 {pieData.map((_, index) => (
//                                     <Cell
//                                         key={`cell-${index}`}
//                                         fill={COLORS[index % COLORS.length]}
//                                     />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//                 <div
//                     style={{
//                         flex: "1 1 300px",
//                         padding: "20px",
//                         border: "1px solid #ccc",
//                         borderRadius: "8px",
//                     }}
//                 >
//                     <h2>Resumen</h2>
//                     <p>Total de tareas: {tareas.length}</p>
//                     <p>Completadas: {tareasCompletadas}</p>
//                     <p>Pendientes: {tareasPendientes}</p>
//                 </div>
//                 <div className="bg-white shadow rounded-xl p-4">
//                     <h2 className="text-xl font-semibold mb-2">Tareas por Dificultad</h2>
//                     <ResponsiveContainer width="100%" height={250}>
//                         <PieChart>
//                             <Pie
//                                 data={tareasPorDificultad}
//                                 dataKey="value"
//                                 nameKey="name"
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={80}
//                                 label
//                             >
//                                 {tareasPorDificultad.map((_, index) => (
//                                     <Cell
//                                         key={`cell-difficulty-${index}`}
//                                         fill={COLORS[index % COLORS.length]}
//                                     />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//                 <div className="bg-white shadow rounded-xl p-4 mt-4">
//                     <h2 className="text-xl font-semibold mb-2">⚠️ Tareas Urgentes</h2>
//                     {tareasUrgentes.length === 0 ? (
//                         <p className="text-gray-500">No hay tareas urgentes por ahora.</p>
//                     ) : (
//                         <ul className="space-y-2">
//                             {tareasUrgentes.map((tarea) => (
//                                 <li
//                                     key={tarea.id}
//                                     className="flex justify-between items-center bg-yellow-100 text-yellow-800 p-3 rounded-lg"
//                                 >
//                                     <div>
//                                         <p className="font-medium">{tarea.nombre}</p>
//                                         <p className="text-sm">Materia: {String(tarea.materiaId)}</p>
//                                     </div>
//                                     <span className="text-sm">
//                                         {new Date(tarea.fechaLimite).toLocaleDateString()}&nbsp;
//                                         {new Date(tarea.fechaLimite).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//                 <article className="bg-white shadow rounded-xl p-4 mt-4">
//                     <h2 className="text-xl font-semibold mb-2">📈 Historial de Entregas</h2>
//                     {tareasEntregadas.length === 0 ? (
//                         <p className="text-gray-500">Aún no has entregado ninguna tarea.</p>
//                     ) : (
//                         <ResponsiveContainer width="100%" height={250}>
//                             <BarChart data={data}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="tipo" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Bar dataKey="cantidad" fill="#60a5fa" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     )}
//                 </article>
//             </div>
//             <div className="mt-8">
//                 <BuzonNotificaciones
//                     notificaciones={notificaciones}
//                     onMarcarLeido={marcarNotificacionComoLeida}
//                 />
//             </div>
//         </div>
//     );
// };

export default Dashboard;
