import ProfileForm from "@/components/form/ProfileForm";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

type DashboardContextType = {
  setPageTitle: (title: string) => void;
};

export default function ProfilePage() {
  const { setPageTitle } = useOutletContext<DashboardContextType>();
  useEffect(() => {
    setPageTitle("👤 Perfil");
    return () => setPageTitle("Dashboard");
  }, [setPageTitle]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ProfileForm/>
    </div>
  );
}