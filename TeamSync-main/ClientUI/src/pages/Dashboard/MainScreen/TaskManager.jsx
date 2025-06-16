import React, { useState, useEffect } from "react";
import { CheckCircle, Search, ChevronDown } from "lucide-react";
import {
    useDashboardstatsQuery, useCreatenoteMutation, useDeletenoteMutation, useTaskUpdateMutation,
    useStartAttendanceMutation, useStartBreakMutation, useEndBreakMutation, useEndAttendanceMutation,
} from "./services";
const TaskManager = () => {
    // State for search, filter, and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [taskFilter, setTaskFilter] = useState("All");
    const [showAllTasks, setShowAllTasks] = useState(false);

    // Fetch tasks using the API hook
    const { data: tasksData, isLoading, isError, refetch } = useDashboardstatsQuery();
    const [updateTask] = useUpdateTaskMutation();

    // Extract tasks from the API response
    const tasks = tasksData?.tasks || [];

    // Handle task status update
    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            await updateTask({ id: taskId, status: newStatus }).unwrap();
            refetch(); // Refetch tasks after updating
        } catch (err) {
            console.error("Failed to update task status:", err);
        }
    };

    // Filter tasks based on search term and filter
    const filteredTasks = tasks.filter((task) => {
        if (!task || !task.title) return false;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase() || "");
        const matchesFilter =
            taskFilter === "All" ||
            (task.taskstatus && task.taskstatus.toLowerCase().trim() === taskFilter.toLowerCase().trim());
        return matchesSearch && matchesFilter;
    });

    // Display only 5 tasks initially
    const displayedTasks = showAllTasks ? filteredTasks : filteredTasks.slice(0, 5);
    const hasMoreTasks = filteredTasks.length > 5;

    // Get task status color
    const getTaskStatusColor = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";

        switch (status.trim()) {
            case "Completed":
                return "bg-emerald-100 text-emerald-800";
            case "In Progress":
                return "bg-blue-100 text-blue-800";
            case "Pending":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="ml-3 text-gray-700">Loading tasks...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center text-red-600">
                    <p>Failed to load tasks. Please try again.</p>
                    <button
                        onClick={refetch}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" /> Tasks Overview
                </h2>
            </div>
            <div className="p-6">
                {/* Search and Filter Section */}
                <div className="mb-4 flex justify-between items-center">
                    <div className="relative w-full max-w-xs">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="ml-2 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                        value={taskFilter}
                        onChange={(e) => setTaskFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Tasks Container with Scroll */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {displayedTasks.map((task) => (
                        <div
                            key={task._id}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${getTaskStatusColor(task.taskstatus)}`}>
                                    {task.taskstatus || "Unknown"}
                                </span>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <select
                                    className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                                    value={task.taskstatus || ""}
                                    onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                >
                                    <option value="">Update Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More / Show Less Button */}
                {hasMoreTasks && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setShowAllTasks(!showAllTasks)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mx-auto"
                        >
                            {showAllTasks ? "Show Less" : "Show All Tasks"}
                            <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${showAllTasks ? "transform rotate-180" : ""}`} />
                        </button>
                    </div>
                )}

                {/* No Tasks Message */}
                {filteredTasks.length === 0 && (
                    <div className="py-8 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                            {searchTerm || taskFilter !== "All"
                                ? "No tasks match your search or filter"
                                : "No tasks available"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskManager;