import React, { useState, useEffect } from "react";
import {
    useDashboardstatsQuery, useCreatenoteMutation, useDeletenoteMutation, useTaskUpdateMutation,
    useStartAttendanceMutation, useStartBreakMutation, useEndBreakMutation, useEndAttendanceMutation,
} from "./services";
import {
    Calendar, Bell, CheckCircle, Clock, Search, Trash, ChevronDown, Play,
    Pause, StopCircle, Menu, X, User, Briefcase, FileText, BarChart2, ArrowLeft, ArrowRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

function DashboardHome() {
    const { data, error, isLoading, refetch } = useDashboardstatsQuery();
    const [tasks, setTasks] = useState([]);
    const [personalnotes, setPersonalNotes] = useState([]);
    const [notes, setNotes] = useState({ title: '', text: '' });
    const [createNote, { isLoading: isCreatingNote }] = useCreatenoteMutation();
    const [deleteNote] = useDeletenoteMutation();
    const [updateTask] = useTaskUpdateMutation();
    const [performanceData, setPerformanceData] = useState([]);
    const [notices, setNotices] = useState([]);
    const [workLogData, setWorkLogData] = useState({});
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isNavOpen, setIsNavOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [searchTerm, setSearchTerm] = useState("");
    const [taskFilter, setTaskFilter] = useState("All");
    const [showAllTasks, setShowAllTasks] = useState(false);

    const [attendanceStatus, setAttendanceStatus] = useState('not_started');
    const [startAttendance] = useStartAttendanceMutation();
    const [startBreak] = useStartBreakMutation();
    const [endBreak] = useEndBreakMutation();
    const [endAttendance] = useEndAttendanceMutation();
    const [attendanceDisabled, setAttendanceDisabled] = useState(false);
    const [hasStartedToday, setHasStartedToday] = useState(false);
    const [hasEndedToday, setHasEndedToday] = useState(false);

    const firstname = data ? data.dashboardstats.user.first_name : "Loading...";
    const lastname = data ? data.dashboardstats.user.last_name : "Loading...";

    const formatHours = (hours) => {
        if (hours < 0.01) {
            const minutes = Math.round(hours * 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            return `${hours.toFixed(2)} hour${hours !== 1 ? 's' : ''}`;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toISOString().split('T')[0];
    };
    const calculateTotalHours = (workLog) => {
        if (!workLog.startTime) return 0;

        // Convert times consistently
        const startTime = new Date(workLog.startTime);
        const endTime = workLog.endTime ? new Date(workLog.endTime) : new Date();

        // Calculate total break time in milliseconds
        let totalBreakTime = 0;
        if (workLog.breakTimes && workLog.breakTimes.length > 0) {
            workLog.breakTimes.forEach(breakPeriod => {
                if (breakPeriod.start && breakPeriod.end) {
                    const breakStart = new Date(breakPeriod.start);
                    const breakEnd = new Date(breakPeriod.end);
                    totalBreakTime += (breakEnd - breakStart);
                }
            });
        }

        // Calculate total hours (excluding breaks)
        const totalTimeMs = endTime - startTime - totalBreakTime;
        return totalTimeMs / (1000 * 60 * 60); // Convert ms to hours
    };

    // Handle attendance actions
    const handleAttendanceAction = async () => {
        try {
            switch (attendanceStatus) {
                case 'not_started':
                    if (!hasStartedToday) {
                        await startAttendance().unwrap();
                        setAttendanceStatus('started');
                        setHasStartedToday(true);
                    }
                    break;
                case 'started':
                    await startBreak().unwrap();
                    setAttendanceStatus('on_break');
                    break;
                case 'on_break':
                    await endBreak().unwrap();
                    setAttendanceStatus('started');
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error('Failed to update attendance:', err);
        }
    };

    // Handle end day action
    const handleEndDay = async () => {
        try {
            if (!hasEndedToday) {
                await endAttendance().unwrap();
                setAttendanceStatus('not_started');
                setHasEndedToday(true);
                setAttendanceDisabled(true);
            }
        } catch (err) {
            console.error('Failed to end attendance:', err);
        }
    };

    // Get button text based on attendance status
    const getButtonText = () => {
        switch (attendanceStatus) {
            case 'not_started':
                return 'Start Work Day';
            case 'started':
                return 'Take Break';
            case 'on_break':
                return 'End Break';
            default:
                return 'Start Work Day';
        }
    };

    // Get button icon based on attendance status
    const getButtonIcon = () => {
        switch (attendanceStatus) {
            case 'not_started':
                return <Play className="h-4 w-4 mr-2" />;
            case 'started':
                return <Pause className="h-4 w-4 mr-2" />;
            case 'on_break':
                return <Play className="h-4 w-4 mr-2" />;
            default:
                return <Play className="h-4 w-4 mr-2" />;
        }
    };

    // Get button color based on attendance status
    const getButtonColor = () => {
        switch (attendanceStatus) {
            case 'not_started':
                return 'bg-emerald-600 hover:bg-emerald-700';
            case 'started':
                return 'bg-blue-600 hover:bg-blue-700';
            case 'on_break':
                return 'bg-amber-600 hover:bg-amber-700';
            default:
                return 'bg-emerald-600 hover:bg-emerald-700';
        }
    };


    const convertUTCDateToLocalDate = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    };
    // Updated checkCurrentDayAttendance function
    const checkCurrentDayAttendance = (workLog) => {
        if (!workLog) return;

        // Format dates consistently to compare only the date portion (not time)
        const today = new Date().toISOString().split('T')[0];
        const workLogDate = new Date(workLog.date).toISOString().split('T')[0];

        if (workLogDate === today) {
            if (workLog.startTime) {
                setHasStartedToday(true);

                if (workLog.endTime) {
                    setHasEndedToday(true);
                    setAttendanceDisabled(true);
                    setAttendanceStatus('not_started');
                } else {
                    // Day started but not ended
                    const lastBreak = workLog.breakTimes && workLog.breakTimes.length > 0
                        ? workLog.breakTimes[workLog.breakTimes.length - 1]
                        : null;

                    if (lastBreak && lastBreak.start && !lastBreak.end) {
                        setAttendanceStatus('on_break');
                    } else {
                        setAttendanceStatus('started');
                    }
                }
            }
        }
    };



    // Load data when available
    useEffect(() => {
        if (data && data.dashboardstats) {
            if (Array.isArray(data.dashboardstats.tasks)) {
                setTasks(data.dashboardstats.tasks);
            }

            if (Array.isArray(data.performanceData)) {
                setPerformanceData(data.performanceData);
            }

            if (data.dashboardstats.personalnotes && Array.isArray(data.dashboardstats.personalnotes)) {
                setPersonalNotes(data.dashboardstats.personalnotes);
            } else {
                setPersonalNotes([]);
            }

            if (data.dashboardstats.notices && Array.isArray(data.dashboardstats.notices)) {
                setNotices(data.dashboardstats.notices);
            }

            if (data.dashboardstats.workLog) {
                const workLog = data.dashboardstats.workLog;
                const dateKey = convertUTCDateToLocalDate(workLog.date).toISOString().split('T')[0];

                checkCurrentDayAttendance(workLog);

                const totalHoursWorked = calculateTotalHours(workLog);

                const newWorkLogData = {
                    [dateKey]: {
                        totalHours: totalHoursWorked || 0,
                        breakCount: workLog.breakTimes ? workLog.breakTimes.length : 0,
                        status: workLog.endTime ? 'completed' : 'active'
                    }
                };

                setWorkLogData(newWorkLogData);
            }
        }
    }, [data]);

    // Calculate total hours worked from work log entry


    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const daysInMonth = Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => i + 1);

    // Get day of week
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Handle task filtering and searching
    const filteredTasks = tasks.filter(task => {
        if (!task || !task.title) return false;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase() || "");
        const matchesFilter = taskFilter === "All" ||
            (task.taskstatus && task.taskstatus.toLowerCase().trim() === taskFilter.toLowerCase().trim());
        return matchesSearch && matchesFilter;
    });

    // Display only 5 tasks initially
    const displayedTasks = showAllTasks ? filteredTasks : filteredTasks.slice(0, 5);
    const hasMoreTasks = filteredTasks.length > 5;

    const handleSaveNotes = async () => {
        if (notes.title.trim() && notes.text.trim()) {
            try {
                await createNote(notes).unwrap();
                setNotes({ title: '', text: '' });
                refetch();
            } catch (err) {
                console.error('Failed to create note:', err);
            }
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id).unwrap();
            refetch();
        } catch (err) {
            console.error('Failed to delete note:', err);
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            await updateTask({ id: taskId, status: newStatus }).unwrap();
            refetch();
        } catch (err) {
            console.error('Failed to update task status:', err);
        }
    };
    const capitalize = (name) => name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';


    const changeMonth = (delta) => {
        let newMonth = currentMonth + delta;
        let newYear = currentYear;

        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const getTaskStatusColor = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";

        switch (status.trim()) {
            case "Completed": return "bg-emerald-100 text-emerald-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "Pending": return "bg-amber-100 text-amber-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const unreadNotices = notices.filter(notice => !notice.read).length;
    const currentDate = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Loading your dashboard...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
            </div>
        </div>
    );

    if (error && error.status !== 401) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="p-8 bg-white border border-red-200 rounded-xl shadow-lg max-w-md">
                <h2 className="text-xl font-bold mb-4 text-red-600">Something went wrong</h2>
                <p className="text-gray-600 mb-6">Error: {error.message || "Unknown error occurred"}</p>
                <button
                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors"
                    onClick={() => refetch()}
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        {/* Mobile View - Centered */}
                        <div className="flex-shrink-0 md:hidden flex flex-col items-center space-y-1">
                            <h1 className="text-2xl font-extrabold text-gray-800">Welcome</h1>
                            <h3 className="text-lg font-semibold text-indigo-600">
                                {capitalize(firstname)} {capitalize(lastname)}
                            </h3>
                        </div>

                        <div className="flex-shrink-0 hidden md:flex items-center space-x-3">
                            <h1 className="text-3xl font-extrabold text-gray-900">Welcome</h1>
                            <h3 className="text-2xl font-semibold text-indigo-600">
                                {capitalize(firstname)} {capitalize(lastname)}
                            </h3>
                        </div>

                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsNavOpen(!isNavOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            >
                                <ChevronDown className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="hidden md:flex md:space-x-8 md:ml-10">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${activeTab === "dashboard" ? "border-b-2 border-indigo-500 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Briefcase className="h-5 w-5 mr-2" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab("tasks")}
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${activeTab === "tasks" ? "border-b-2 border-indigo-500 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Tasks
                            </button>
                            <button
                                onClick={() => setActiveTab("calendar")}
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${activeTab === "calendar" ? "border-b-2 border-indigo-500 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Calendar className="h-5 w-5 mr-2" />
                                Calendar
                            </button>
                            <button
                                onClick={() => setActiveTab("notes")}
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${activeTab === "notes" ? "border-b-2 border-indigo-500 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <FileText className="h-5 w-5 mr-2" />
                                Notes
                            </button>
                            <button
                                onClick={() => setActiveTab("performance")}
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${activeTab === "performance" ? "border-b-2 border-indigo-500 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <BarChart2 className="h-5 w-5 mr-2" />
                                Performance
                            </button>
                            <button
                                onClick={() => { setActiveTab("notices"); setIsNavOpen(false); }}
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${activeTab === "notices" ? "border-b-2 border-indigo-500 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Bell className="h-5 w-5 mr-2" />
                                Notices
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isNavOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <button
                                onClick={() => { setActiveTab("dashboard"); setIsNavOpen(false); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === "dashboard" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                                <Briefcase className="h-5 w-5 inline-block mr-2" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => { setActiveTab("tasks"); setIsNavOpen(false); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === "tasks" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                                <CheckCircle className="h-5 w-5 inline-block mr-2" />
                                Tasks
                            </button>
                            <button
                                onClick={() => { setActiveTab("calendar"); setIsNavOpen(false); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === "calendar" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                                <Calendar className="h-5 w-5 inline-block mr-2" />
                                Calendar
                            </button>
                            <button
                                onClick={() => { setActiveTab("notes"); setIsNavOpen(false); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === "notes" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                                <FileText className="h-5 w-5 inline-block mr-2" />
                                Notes
                            </button>
                            <button
                                onClick={() => { setActiveTab("performance"); setIsNavOpen(false); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === "performance" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                                <BarChart2 className="h-5 w-5 inline-block mr-2" />
                                Performance
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Attendance Card - Always visible */}
                <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-indigo-600" /> Attendance Tracker
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {attendanceStatus === 'not_started' ?
                                        hasEndedToday ? 'You have completed your work day' : 'Start your day to track your working hours' :
                                        attendanceStatus === 'started' ?
                                            'Currently working' :
                                            'Currently on break'}
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleAttendanceAction}
                                    disabled={attendanceDisabled}
                                    className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center transition-colors ${getButtonColor()} ${attendanceDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {getButtonIcon()}
                                    {getButtonText()}
                                </button>

                                {attendanceStatus !== 'not_started' && (
                                    <button
                                        onClick={handleEndDay}
                                        disabled={hasEndedToday}
                                        className={`px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center transition-colors ${hasEndedToday ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <StopCircle className="h-4 w-4 mr-2" />
                                        End Day
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Work stats summary */}
                        {Object.keys(workLogData).length > 0 && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(workLogData).map(([date, data]) => (
                                    <div key={date} className="bg-indigo-50 rounded-lg p-4">
                                        <p className="text-sm text-indigo-700 font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                        <div className="mt-2 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-600">Hours worked:</p>
                                                <p className="text-sm font-medium">{formatHours(data.totalHours)}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-600">Breaks taken:</p>
                                                <p className="text-sm font-medium">{data.breakCount}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-600">Status:</p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${data.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {data.status === 'completed' ? 'Completed' : 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Content */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tasks Overview Card */}
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
                                    {(showAllTasks ? filteredTasks : filteredTasks.slice(0, 5)).map((task) => (
                                        <div key={task._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
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
                                {filteredTasks.length > 5 && (
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
                        {/* Performance Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <BarChart2 className="h-5 w-5 mr-2" /> Performance Overview
                                </h2>
                            </div>
                            <div className="p-6">
                                {performanceData && performanceData.length > 0 ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={performanceData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {performanceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">No performance data available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FileText className="h-5 w-5 mr-2" /> Quick Notes
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                                        placeholder="Note title"
                                        value={notes.title}
                                        onChange={(e) => setNotes({ ...notes, title: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 h-24 resize-none"
                                        placeholder="Write your note here..."
                                        value={notes.text}
                                        onChange={(e) => setNotes({ ...notes, text: e.target.value })}
                                    ></textarea>
                                    <button
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                                        onClick={handleSaveNotes}
                                        disabled={isCreatingNote || !notes.title || !notes.text}
                                    >
                                        {isCreatingNote ? "Saving..." : "Save Note"}
                                    </button>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {personalnotes.length > 0 ? (
                                        personalnotes.map((note) => (
                                            <div key={note._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{note.title}</h3>
                                                        <p className="text-sm text-gray-600 mt-1">{note.text}</p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteNote(note._id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-6 text-center bg-gray-50 rounded-lg">
                                            <p className="text-gray-600">No notes available</p>
                                            <p className="text-sm text-gray-500 mt-1">Add a new note to see it here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "calendar" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 sm:p-6">
                            {/* Month Navigation */}
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    {monthNames[currentMonth - 1]} {currentYear}
                                </h2>
                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {/* Day Labels */}
                                {dayLabels.map((day) => (
                                    <div key={day} className="text-center p-1 sm:p-2 text-xs sm:text-sm font-medium text-gray-600">
                                        {day}
                                    </div>
                                ))}

                                {/* Empty Cells for Days Before the First Day of the Month */}
                                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                                    <div key={`empty-${i}`} className="h-12 sm:h-16 border border-gray-100 rounded-lg bg-gray-50 opacity-50"></div>
                                ))}

                                {/* Calendar Days */}
                                {daysInMonth.map((day) => {
                                    const date = new Date(Date.UTC(currentYear, currentMonth - 1, day)); // Use UTC to avoid timezone issues
                                    const dateKey = date.toISOString().split('T')[0]; // Consistent YYYY-MM-DD format

                                    const hasWorkLog = workLogData[dateKey];

                                    // Check if the date is today
                                    const today = new Date();
                                    const isToday =
                                        date.getUTCFullYear() === today.getUTCFullYear() &&
                                        date.getUTCMonth() === today.getUTCMonth() &&
                                        date.getUTCDate() === today.getUTCDate();

                                    return (
                                        <div
                                            key={day}
                                            className={`h-12 sm:h-16 p-1 sm:p-2 border ${isToday ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'
                                                } rounded-lg hover:border-indigo-300 transition-colors ${selectedDate === dateKey ? 'ring-2 ring-indigo-500' : ''
                                                }`}
                                            onClick={() => setSelectedDate(dateKey)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span
                                                    className={`inline-block rounded-full h-5 w-5 sm:h-6 sm:w-6 text-center text-xs sm:text-sm ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'
                                                        }`}
                                                >
                                                    {day}
                                                </span>
                                                {hasWorkLog && (
                                                    <span
                                                        className={`inline-block h-2 w-2 rounded-full ${hasWorkLog.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                                                            }`}
                                                    ></span>
                                                )}
                                            </div>

                                            {/* Work Log Details (Hidden on Mobile) */}
                                            {hasWorkLog && (
                                                <div className="mt-1 text-xs text-gray-600 hidden sm:block">
                                                    {formatHours(hasWorkLog.totalHours)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Selected Date Details */}
                            {selectedDate && (
                                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <p className="font-semibold text-indigo-800 text-sm sm:text-base">
                                        {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>

                                    {/* Tasks for the Selected Date */}

                                    {tasks
                                        .filter((task) => {
                                            const taskDate = new Date(task.dueDate).toLocaleDateString('en-US');
                                            const selectedDateFormatted = new Date(selectedDate).toLocaleDateString('en-US');
                                            return taskDate === selectedDateFormatted;
                                        })
                                        .map((task) => (
                                            <div key={task._id} className="mt-2">
                                                <div className="flex items-center">
                                                    <CheckCircle className="h-4 w-4 text-indigo-500 mr-1" />
                                                    <span className="text-sm">{task.title}</span>
                                                    <span
                                                        className={`ml-2 px-2 py-1 rounded-full text-xs ${getTaskStatusColor(
                                                            task.taskstatus
                                                        )}`}
                                                    >
                                                        {task.taskstatus || "Unknown"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    {/* Work Log for the Selected Date */}

                                    {workLogData[selectedDate] && (
                                        <div className="mt-2">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-indigo-500 mr-1" />
                                                <span className="text-sm">
                                                    Hours worked: <span className="font-medium">{formatHours(workLogData[selectedDate].totalHours)}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Pause className="h-4 w-4 text-indigo-500 mr-1" />
                                                <span className="text-sm">
                                                    Breaks taken: <span className="font-medium">{workLogData[selectedDate].breakCount}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === "notes" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Note</h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                                        placeholder="Note title"
                                        value={notes.title}
                                        onChange={(e) => setNotes({ ...notes, title: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 h-32 resize-none"
                                        placeholder="Write your detailed note here..."
                                        value={notes.text}
                                        onChange={(e) => setNotes({ ...notes, text: e.target.value })}
                                    ></textarea>
                                    <button
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                        onClick={handleSaveNotes}
                                        disabled={isCreatingNote || !notes.title || !notes.text}
                                    >
                                        {isCreatingNote ? "Saving..." : "Save Note"}
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Notes</h2>

                                {personalnotes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {personalnotes.map((note) => (
                                            <div key={note._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{note.title}</h3>
                                                        <p className="text-sm text-gray-600 mt-2">{note.text}</p>
                                                        <p className="text-xs text-gray-500 mt-3">
                                                            Created: {new Date(note.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteNote(note._id)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">No notes available</p>
                                        <p className="text-sm text-gray-500 mt-1">Create a new note to see it here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === "tasks" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="mb-6 flex justify-between items-center">
                                <div className="relative max-w-md w-full">
                                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        placeholder="Search tasks by title..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="ml-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                                    value={taskFilter}
                                    onChange={(e) => setTaskFilter(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            {filteredTasks.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredTasks.map((task) => (
                                        <div key={task._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center">
                                                <div className="mb-3 md:mb-0">
                                                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                                    <div className="flex items-center mt-2">
                                                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                                        <p className="text-xs text-gray-500">
                                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.taskstatus)}`}>
                                                        {task.taskstatus || "Pending"}
                                                    </span>
                                                    <select
                                                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
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
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-gray-50 rounded-lg">
                                    <p className="text-gray-600">
                                        {searchTerm || taskFilter !== "All"
                                            ? "No tasks match your search or filter"
                                            : "No tasks available"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {searchTerm || taskFilter !== "All"
                                            ? "Try adjusting your search terms or filter"
                                            : "Tasks assigned to you will appear here"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Notices Tab */}
                {activeTab === "notices" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Notices</h2>

                            {notices.length > 0 ? (
                                <div className="space-y-4">
                                    {notices.map((notice) => (
                                        <div
                                            key={notice.id}
                                            className={`p-4 rounded-lg border-l-4 ${notice.read ? "border-gray-300 bg-gray-50" : "border-indigo-500 bg-indigo-50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{notice.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{notice.description}</p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Posted: {new Date(notice.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {!notice.read && (
                                                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center bg-gray-50 rounded-lg">
                                    <p className="text-gray-600">No notices available</p>
                                    <p className="text-sm text-gray-500 mt-1">New notices will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Performance Tab */}
                {activeTab === "performance" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Performance Metrics</h2>

                            {performanceData && performanceData.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={performanceData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={90}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {performanceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-800 mb-4">Task Completion Summary</h3>
                                        <div className="space-y-4">
                                            {performanceData.map((item, index) => (
                                                <div key={index} className="flex items-center">
                                                    <div
                                                        className="h-3 w-3 rounded-full mr-2"
                                                        style={{ backgroundColor: item.color || `#${Math.floor(Math.random() * 16777215).toString(16)}` }}
                                                    ></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium">{item.name}</span>
                                                            <span className="text-sm text-gray-600">{item.value} tasks</span>
                                                        </div>
                                                        <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${(item.value / performanceData.reduce((acc, curr) => acc + curr.value, 0)) * 100}%`,
                                                                    backgroundColor: item.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-gray-50 rounded-lg">
                                    <p className="text-gray-600">No performance data available</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Complete tasks to see your performance metrics
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default DashboardHome;