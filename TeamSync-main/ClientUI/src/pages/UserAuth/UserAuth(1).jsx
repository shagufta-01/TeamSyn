import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

function UserAuth() {
    return (
        <>
            <Outlet />
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
            </Routes>
        </>
    );
}

export default UserAuth;
