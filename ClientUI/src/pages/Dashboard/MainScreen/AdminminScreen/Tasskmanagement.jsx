import React, { useState, useEffect } from 'react';
import {
    PlusCircle, Trash2, ChevronDown, Loader2,
    AlertCircle, CheckCircle, Search, Edit2, X
} from 'lucide-react';
import {
    useCreateTaskMutation,
    useAdminupdateTaskMutation,
    useDeleteTaskMutation,
    useGetViewTasksQuery,
} from '../services';

const TaskManagement = () => {
    // State for task operations
    const [title, setTitle] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [view, setView] = useState('list'); // list, create
    const [editingTask, setEditingTask] = useState(null);
    const [openAccordion, setOpenAccordion] = useState(null);
    

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // RTK Query hooks
    const {
        data: taskResponse,
        isLoading,
        isError,
        refetch
    } = useGetViewTasksQuery();

    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [updateTask, { isLoading: isUpdating }] = useAdminupdateTaskMutation();
    const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

    // Extract tasks from API response
    const teamMembers = taskResponse?.tasks?.teamMembers || [];

    // Reset success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Handle task creation
    const handleCreateTask = async (memberId) => {
        if (!title.trim()) {
            setError('Task title is required');
            return;
        }

        if (!taskStatus) {
            setError('Task status is required');
            return;
        }

        if (!dueDate) {
            setError('Due date is required');
            return;
        }

        setError('');

        try {
            await createTask({
                title,
                taskstatus: taskStatus,
                dueDate,
                assignedTo: memberId
            }).unwrap();

            // Reset form
            setTitle('');
            setTaskStatus('');
            setDueDate('');
            setSelectedMemberId(null);
            setSuccessMessage('Task created successfully!');
            setView('list');
            refetch();
        } catch (err) {
            setError(err.data?.message || 'Failed to create task');
        }
    };

    const handleUpdateTask = async (taskId) => {
        if (!editingTask.title.trim()) {
            setError('Task title is required');
            return;
        }

        const payload = {
            taskId,
            title: editingTask.title,
            taskstatus: editingTask.taskstatus,
            dueDate: editingTask.dueDate,
        };

        try {
            await updateTask(payload).unwrap();
            setEditingTask(null);
            setSuccessMessage('Task updated successfully!');
            refetch();
        } catch (err) {
            setError(err.data?.message || 'Failed to update task');
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (memberId, taskId) => {
        if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteTask({ userId: memberId, taskId }).unwrap();
            setSuccessMessage('Task deleted successfully!');
            refetch();
        } catch (err) {
            setError(err.data?.message || 'Failed to delete task');
        }
    };

    // Filter tasks
    const getFilteredTasks = (tasks) => {
        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterStatus === '' || task.taskstatus === filterStatus)
        );
    };
    

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Render loading state
    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-64">
            <Loader2 size={32} className="text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Loading tasks...</h3>
        </div>
    );

    // Render task creation form
    const renderCreateTaskForm = () => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Create New Task</h2>
                    <p className="text-blue-100 mt-1 text-sm">Assign a task to a team member</p>
                </div>
                <button
                    onClick={() => {
                        setView('list');
                        setError('');
                    }}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="p-6 space-y-4">
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                        <AlertCircle size={16} className="text-red-500" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to Team Member
                        </label>
                        <select
                            value={selectedMemberId || ''}
                            onChange={(e) => setSelectedMemberId(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a team member</option>
                            {teamMembers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.email} ({member.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Status
                        </label>
                        <select
                            value={taskStatus}
                            onChange={(e) => setTaskStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => {
                                setView('list');
                                setError('');
                            }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleCreateTask(selectedMemberId)}
                            disabled={isCreating}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium ${isCreating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                } transition-colors flex items-center justify-center gap-2`}
                        >
                            {isCreating ? 'Creating...' : 'Create Task'}
                            {isCreating && <Loader2 size={16} className="animate-spin" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render task list
    const renderTaskList = () => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Team Tasks</h2>
                    <p className="text-blue-100 mt-1 text-sm">Manage and track team tasks</p>
                </div>
                <button
                    onClick={() => {
                        setView('create');
                        setError('');
                    }}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                    <PlusCircle size={16} />
                    New Task
                </button>
            </div>

            <div className="p-6">
                {successMessage && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <CheckCircle size={16} className="text-green-500" />
                        <p className="text-green-600 text-sm">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <AlertCircle size={16} className="text-red-500" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-4 flex gap-3">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {teamMembers.map((member) => (
                    <div key={member.id} className="mb-4 border rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition"
                            onClick={() => setOpenAccordion(openAccordion === member.id ? null : member.id)}
                        >
                            <div>
                                <span className="font-semibold">{member.email}</span>
                                <span className="ml-2 text-sm text-gray-600">({member.role})</span>
                            </div>
                            <ChevronDown className={`transform transition-transform ${openAccordion === member.id ? 'rotate-180' : ''}`} />
                        </div>

                        {openAccordion === member.id && (
                            <div className="p-4 space-y-4">
                                {getFilteredTasks(member.tasks || []).length === 0 ? (
                                    <div className="text-center text-gray-500 py-4">
                                        No tasks found
                                    </div>
                                ) : (
                                    getFilteredTasks(member.tasks || []).map((task) => (
                                        <div
                                            key={task._id}
                                            className="bg-white border rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition"
                                        >
                                            {editingTask && editingTask.taskId === task._id ? (
                                                <div className="w-full space-y-3">
                                                    <input
                                                        type="text"
                                                        value={editingTask.title}
                                                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                                        className="w-full p-2 border rounded-lg"
                                                        placeholder="Task title"
                                                    />
                                                    <select
                                                        value={editingTask.taskstatus}
                                                        onChange={(e) => setEditingTask({ ...editingTask, taskstatus: e.target.value })}
                                                        className="w-full p-2 border rounded-lg"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                    <input
                                                        type="date"
                                                        value={editingTask.dueDate}
                                                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                                                        className="w-full p-2 border rounded-lg"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateTask(task._id)}
                                                            className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingTask(null)}
                                                            className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium">{task.title}</span>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.taskstatus)}`}
                                                            >
                                                                {task.taskstatus}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEditingTask({
                                                                taskId: task._id,
                                                                title: task.title,
                                                                taskstatus: task.taskstatus,
                                                                dueDate: task.dueDate
                                                            })}
                                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTask(member.id, task._id)}
                                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Main render method
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {isLoading ? renderLoading() : (
                isError ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <AlertCircle size={32} className="text-red-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">
                            Failed to load tasks. Please try again later.
                        </h3>
                    </div>
                ) : (
                    view === 'create' ? renderCreateTaskForm() : renderTaskList()
                )
            )}
        </div>
    );
};

export default TaskManagement;