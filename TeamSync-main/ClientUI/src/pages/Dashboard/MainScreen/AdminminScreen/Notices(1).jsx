import React, { useState, useEffect } from 'react';
import {
    BellRing, Trash2, RefreshCw, AlertCircle, Plus, Clock,
    CheckCircle, Calendar, ChevronDown, ChevronUp, Search, Filter
} from 'lucide-react';
import {
    useCreateNoticeMutation,
    useGetNoticesQuery,
    useDeleteNoticeMutation,
} from '../services';

const Notices = () => {
    // Notice creation states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [view, setView] = useState('list'); // list, create

    // Filtering and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // RTK Query hooks
    const { data: noticesResponse, isLoading, isError, refetch } = useGetNoticesQuery();
    const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();
    const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();

    // Extract notices from the API response
    const notices = noticesResponse?.notices || []; // Updated to match the API response structure

    // Reset success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Handle notice creation
    const handleCreateNotice = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Notice title is required');
            return;
        }

        if (!description.trim()) {
            setError('Notice description is required');
            return;
        }

        setError('');

        try {
            await createNotice({
                title,
                description,
            }).unwrap();

            setTitle('');
            setDescription('');
            setSuccessMessage('Notice created successfully!');
            setView('list');
            refetch();
        } catch (err) {
            setError(err.data?.message || 'Failed to create notice');
        }
    };

    // Handle notice deletion
    const handleDeleteNotice = async (noticeId) => {
        console.log("Deleting notice with ID:", noticeId); // Debugging
        if (!window.confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteNotice(noticeId).unwrap();
            setSuccessMessage('Notice deleted successfully!');
            refetch();
        } catch (err) {
            setError(err.data?.message || 'Failed to delete notice');
        }
    };

    // Filter notices based on search query
    const getFilteredNotices = () => {
        return notices.filter(notice => {
            return notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notice.description.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    // Format date to human-readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render loading state
    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-64">
            <RefreshCw size={32} className="text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Loading notices...</h3>
        </div>
    );

    // Render notice creation form
    const renderCreateNoticeForm = () => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
                <h2 className="text-2xl font-bold">Create New Notice</h2>
                <p className="text-blue-100 mt-1 text-sm">Share important information with your team</p>
            </div>

            <div className="p-6">
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <AlertCircle size={16} className="text-red-500" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleCreateNotice} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Notice Title*
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="Enter a clear and concise title"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Notice Description*
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            rows="5"
                            placeholder="Provide detailed information about the notice"
                        />
                    </div>

                    <div className="flex gap-2 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                setView('list');
                                setError('');
                            }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className={`flex-1 py-2 px-3 rounded-lg text-white font-medium ${isCreating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                } transition-colors flex items-center justify-center gap-2 text-sm`}
                        >
                            {isCreating ? 'Creating...' : 'Publish Notice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Render notice list
    const renderNoticeList = () => {
        const filteredNotices = getFilteredNotices();

        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Notices</h2>
                            <p className="text-blue-100 mt-1 text-sm">All company announcements and important information</p>
                        </div>
                        <button
                            onClick={() => {
                                setView('create');
                                setError('');
                            }}
                            className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm"
                        >
                            <Plus size={16} />
                            New Notice
                        </button>
                    </div>
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

                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-2">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notices..."
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>

                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                >
                                    <Filter size={16} />
                                    Filters
                                    {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {filteredNotices.length > 0 ? (
                        <div className="space-y-4">
                            {filteredNotices.map((notice) => (
                                <div key={notice._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                                    </div>

                                    <p className="text-gray-600 mt-2 text-sm">{notice.description}</p>

                                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                                        <div className="flex items-center text-gray-500 text-xs">
                                            <Calendar size={14} className="mr-1" />
                                            {formatDate(notice.createdAt)}
                                        </div>

                                        <button
                                            onClick={() => handleDeleteNotice(notice._id)}
                                            disabled={isDeleting}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <BellRing size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">No notices found</p>
                            <p className="text-gray-400 text-xs mt-1">
                                {searchQuery
                                    ? 'Try changing your search query'
                                    : 'Create a new notice to get started'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-4xl relative">
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-lg opacity-10 transform rotate-12"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-indigo-500 rounded-full opacity-10"></div>

                {isLoading ? renderLoading() : (
                    view === 'create' ? renderCreateNoticeForm() : renderNoticeList()
                )}

                <div className="text-center mt-6 text-indigo-800 opacity-80 text-sm">
                    NoticeBoard • Keep your team informed
                </div>
            </div>
        </div>
    );
};

export default Notices;