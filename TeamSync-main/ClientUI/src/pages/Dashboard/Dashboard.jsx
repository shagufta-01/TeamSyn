import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import DashboardNavbar from "./DashboardNavbar/DashboardNavbar";
import DashboardHome from "./MainScreen/DashboardHome";
import UserProfilePage from "./MainScreen/UserProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTeam from './MainScreen/AdminminScreen/CreateTeam';
import Notices from './MainScreen/AdminminScreen/Notices';
import Taskmanagement from './MainScreen/AdminminScreen/Tasskmanagement';
import TaskManager from './MainScreen/TaskManager';
import AdminaDashboard from './MainScreen/AdminminScreen/Admin_Dashboard';

function Dashboard() {
    return (
        <ProtectedRoute>
            <div className="h-screen flex flex-col">
                {/* Navbar */}
                <div className="w-full">
                    <DashboardNavbar />
                </div>

                <div className="flex flex-1">
                    <Sidebar />
                    <div className="p-4 flex-1 overflow-auto mt-10 md:mt-0">
                        <Routes>
                            <Route index element={<DashboardHome />} />
                            {/* User Routes */}
                            <Route path="taskmanager" element={<TaskManager />} />
                            <Route path="userprofile" element={<UserProfilePage />} />

                            {/* Admin Routes */}
                            <Route path="admin/dashboard" element={<AdminaDashboard />} />
                            <Route path="admin/createteam" element={<CreateTeam />} />
                            <Route path="admin/taskmanagement" element={<Taskmanagement />} />
                            <Route path="admin/notices" element={<Notices />} />
                            <Route path="admin/profile" element={<UserProfilePage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default Dashboard;
