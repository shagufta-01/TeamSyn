import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import teamsyclogo from "../../../assets/teamsyncLogo.png";

function Sidebar() {
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Check if screen is mobile size
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkIfMobile();

        // Add event listener for window resize
        window.addEventListener("resize", checkIfMobile);

        // Cleanup
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const user = JSON.parse(localStorage.getItem("user"));

    const usernavabr = [
        { path: "/dashboard", icon: "🏠", label: "Dashboard" },
        { path: "/dashboard/userprofile", icon: "👤", label: "Profile" },
    ];

    const adminnavbar = [
        { path: "/dashboard/admin/dashboard", icon: "🏠", label: "Dashboard Overview" },
        { path: "/dashboard/admin/createteam", icon: "👥", label: "Team" },
        { path: "/dashboard/admin/taskmanagement", icon: "📝", label: "Task Management" },
        { path: "/dashboard/admin/notices", icon: "📢", label: "Notices" },
        { path: "/dashboard/admin/profile", icon: "👤", label: "Profile" },
    ];

    const roles = user.role;
    const navItems = roles === "admin" ? adminnavbar : usernavabr;

    const HamburgerIcon = () => (
        <div
            className={`md:hidden fixed top-4 left-4 z-30 cursor-pointer p-2 bg-gray-200 text-gray-800 rounded-lg shadow-lg transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            onClick={() => setMobileMenuOpen(true)}
        >
            <div className="w-6 h-1 bg-gray-800 mb-1 rounded"></div>
            <div className="w-6 h-1 bg-gray-800 mb-1 rounded"></div>
            <div className="w-6 h-1 bg-gray-800 rounded"></div>
        </div>
    );

    if (isMobile) {
        return (
            <>
                {/* Hamburger icon - hidden when sidebar is open */}
                <HamburgerIcon />

                {/* Mobile Sidebar - opens from left */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div
                        className={`h-screen w-64 bg-white text-gray-800 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            ✕
                        </button>

                        {/* Sidebar Header */}
                        <div className="flex items-center p-6 border-b border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
                                <img
                                    src={teamsyclogo}
                                    alt="TeamSync Logo"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <h2 className="ml-3 font-bold text-xl">TeamSync</h2>
                        </div>

                        {/* Navigation Links */}
                        <nav className="mt-6 px-3">
                            <ul>
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <li key={item.path} className="mb-2">
                                            <Link
                                                to={item.path}
                                                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="ml-4">{item.label}</span>
                                                {isActive && (
                                                    <div className="ml-auto">
                                                        <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                                                    </div>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Bottom section */}
                        <div className="absolute bottom-4 w-full px-4">
                            <div className="text-center text-sm text-gray-500">Dashboard Pro v1.0</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Desktop version
    return (
        <div
            className={`h-full bg-white text-gray-800 transition-all duration-300 ease-in-out shadow-lg relative hidden md:block ${hovered ? "w-64" : "w-20"
                }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Sidebar Header */}
            <div className="flex items-center p-6 border-b border-gray-200">
                <img
                    src={teamsyclogo}
                    alt="TeamSync Logo"
                    className={` object-cover ${hovered ? "w-15 h-15  " : "w-full h-full "
                        }`}
                />

                <h2
                    className={`ml-3 font-bold text-xl transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ transitionDelay: hovered ? "100ms" : "0ms" }} // Smooth delay for title
                > 
                    TeamSync
                </h2>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 px-3">
                <ul>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path} className="mb-2">
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span
                                        className={`ml-4 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto">
                                            <div
                                                className={`w-2 h-2 rounded-full bg-blue-300 ${hovered ? "opacity-100" : "opacity-0"
                                                    }`}
                                            ></div>
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom section */}
            <div
                className={`absolute bottom-4 w-full px-3 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"
                    }`}
            >
                <div className="text-center text-sm text-gray-500">Dashboard Pro v1.0</div>
            </div>
        </div>
    );
}

export default Sidebar;