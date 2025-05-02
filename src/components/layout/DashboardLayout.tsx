import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { LogoutButton } from "../ui/LogoutButton";
import {
  BarChart,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  return (
    <div className="max-w-screen min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="mr-3 md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <Link to="/dashboard">
              <img
              id="theme-logo"
              src={document.documentElement.classList.contains("dark") ? "/images/logo-dark.png" : "/images/logo.png"}
              alt="Logo"
              className="h-15 w-15 mr-2 rounded-r-2xl rounded-l-2xl"
              />
            </Link>

            <div className="padding-2 flex items-center space-x-4">
            <button
              onClick={() => {
              const isDark = document.documentElement.classList.toggle("dark");
              const logo = document.getElementById("theme-logo") as HTMLImageElement;
              if (logo) {
              logo.src = isDark ? "/images/logo-dark.png" : "/images/logo.png";
              }
              setIsDarkMode(isDark);
              }}
              
              className="p-2 rounded-md"
              aria-label="Cambiar tema"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-200" />}
              
            </button>

            <button 
              className="relative ml-auto p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              3
              </span>
            </button>
            </div>
            
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-20"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar */}
        <aside 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:sticky top-0 md:top-[60px] z-30 md:z-0 h-screen md:h-[calc(100vh-60px)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out md:block`}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.png" // Replace with the actual path to the user's avatar
                alt="User Avatar"
                className="h-10 w-10 rounded-full"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Nombre del Usuario
              </span>
            </div>
            <nav className="space-y-1">
              {/* Sidebar items */}
              <Link 
                to="/dashboard" 
                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setSidebarOpen(false)}
                >
                <BarChart className="h-5 w-5 mr-3" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <Link 
                to="/tasks" 
                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setSidebarOpen(false)}
                >
                <CheckCircle className="h-5 w-5 mr-3" />
                <span className="text-sm">Tareas</span>
              </Link>
              <Link 
                to="/subjects" 
                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setSidebarOpen(false)}
                >
                <Clock className="h-5 w-5 mr-3" />
                <span className="text-sm">Materias</span>
              </Link>
              <Link 
                to="/teachers"
                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setSidebarOpen(false)}
                >
                <User className="h-5 w-5 mr-3" />
                <span className="text-sm">Profesores</span>
              </Link>
              <Link to="/schedule" 
                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setSidebarOpen(false)}
                >
                <Calendar className="h-5 w-5 mr-3" />
                <span className="text-sm">Horario</span>
              </Link>
              <Link to="/profile" 
              className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setSidebarOpen(false)}>
                <User className="h-5 w-5 mr-3" />
                <span className="text-sm">Perfil</span>
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </aside>
    
        {/* Main content area - donde se mostrarán todas las rutas */}
        <main className="container mx-auto px-2  sm:px-4 py-4 md:py-6 w-full">
            <header className="mb-4 shadow-sm p-4 bg-white dark:bg-gray-800 rounded-md">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
            </header>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
              <Outlet context={{setPageTitle}}/>
            </div>
        </main>
      </div>
    </div>
  );
};