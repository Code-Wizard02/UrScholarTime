import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded hover:bg-gray-200 transition ${
      isActive ? "bg-gray-300 font-bold" : ""
    }`;

  return (
    <nav className="bg-white shadow p-4 flex gap-4">
      <NavLink to="/" className={linkClasses}>
        Dashboard
      </NavLink>
      <NavLink to="/tasks" className={linkClasses}>
        Tareas
      </NavLink>
      <NavLink to="/subjects" className={linkClasses}>
        Materias
      </NavLink>
      <NavLink to="/notifications" className={linkClasses}>
        Notificaciones
      </NavLink>
    </nav>
  );
};

export default Navbar;
