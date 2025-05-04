import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { LogOut } from "lucide-react";

export const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <Link 
            to="/login" 
            onClick={handleLogout} 
            className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-sm">Cerrar sesión</span>
        </Link>
    );
};