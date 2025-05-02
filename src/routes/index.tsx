import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./PrivateRoute";

import LoginPage from "./../pages/LoginPage";
import Dashboard from "./../pages/Dashboard";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import WelcomePage from "../pages/WelcomePage";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { HorarioPage } from "./../pages/SchedulePage";
import { MateriasPage } from "../pages/SubjectsPage";
import { TeachersPage } from "@/pages/TeacherPage";
import { TareasPage } from "../pages/TareasPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>

                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/teachers" element={<TeachersPage />} />
                    <Route path="/subjects" element={<MateriasPage />} />
                    <Route path="/schedule" element={<HorarioPage />} />
                    <Route path="/tasks" element={<TareasPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
