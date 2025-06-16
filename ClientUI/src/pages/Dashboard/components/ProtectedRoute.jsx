import React from "react";
import { Navigate } from "react-router-dom";
import { useDashboardstatsQuery } from "../MainScreen/services";

const ProtectedRoute = ({ children }) => {
    const { error, isLoading } = useDashboardstatsQuery();

    if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-lg font-medium">Loading, please wait...</p>
        </div>
    </div> ;

    if (error?.status === 401) {
        console.log("Unauthorized! Redirecting to login...");
        return <Navigate to="/UserAuth/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
