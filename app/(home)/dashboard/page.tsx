"use client";

import useSidebar from "@/utils/useSidebar";
import AdminDashboard from "./components/AdminDashboard";

const DashboardPage = () => {
  const { data, isLoading } = useSidebar();
  const role = data?.data.role;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // if (role === "ADMIN") {
  return <AdminDashboard role={role} />;
  // }
};

export default DashboardPage;
