import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../MainScreen/services";

function TeamSyncNavbar() {
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutMutation(); // Use mutation instead of query

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap(); // Ensure the API call completes
      navigate("/UserAuth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">TeamSync</div>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

export default TeamSyncNavbar;
