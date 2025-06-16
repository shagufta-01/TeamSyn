import React from "react";
import { useAdminDashboardQuery } from "../services";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const { data, error, isLoading } = useAdminDashboardQuery();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h1 className="text-xl font-bold text-red-700">Error loading dashboard</h1>
        <p className="mt-2 text-gray-700">{error.message}</p>
      </div>
    </div>
  );

  // Prepare data for task status pie chart
  const taskStatusData = [
    { name: "Completed", value: data.completedTasks },
    { name: "In Progress", value: data.inProgressTasks },
    { name: "Pending", value: data.pendingTasks },
  ];
  
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];
  
  // Prepare data for team members' attendance
  const teamMembersWithAttendance = data.teamMembers.filter(member => member.attendance && member.attendance.length > 0);
  const attendanceData = teamMembersWithAttendance.map(member => {
    // Calculate average hours for each member
    const totalHours = member.attendance.reduce((sum, record) => sum + record.totalHours, 0);
    const avgHours = member.attendance.length > 0 ? totalHours / member.attendance.length : 0;
    
    return {
      name: member.name,
      hours: parseFloat(avgHours.toFixed(2))
    };
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <h1 className=" text-3xl  mt-2">Team: {data.latestTeamName}</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Team Members</h2>
                <p className="text-2xl font-bold text-gray-800 mt-1">{data.totalTeamMembers}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Total Tasks</h2>
                <p className="text-2xl font-bold text-gray-800 mt-1">{data.totalTasks}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Notices</h2>
                <p className="text-2xl font-bold text-gray-800 mt-1">{data.notices.length}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-full">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Task Charts and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-green-700">Completed</h3>
                <p className="text-2xl font-bold text-green-700">{data.completedTasks}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-blue-700">In Progress</h3>
                <p className="text-2xl font-bold text-blue-700">{data.inProgressTasks}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-amber-700">Pending</h3>
                <p className="text-2xl font-bold text-amber-700">{data.pendingTasks}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">Recent Tasks</h3>
              <ul className="space-y-2">
                {data.tasks.slice(0, 3).map((task) => (
                  <li key={task._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      task.taskstatus === "Completed" ? "bg-green-500" : 
                      task.taskstatus === "In Progress" ? "bg-blue-500" : "bg-amber-500"
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.taskstatus === "Completed" ? "bg-green-100 text-green-800" : 
                      task.taskstatus === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {task.taskstatus}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Attendance Chart */}
        {attendanceData.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Attendance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Average Daily Hours']} />
                  <Legend />
                  <Bar dataKey="hours" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Notices Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Notices</h2>
            {data.notices.length > 0 && (
              <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                {data.notices.length} Notice{data.notices.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {data.notices.length > 0 ? (
            <ul className="space-y-3">
              {data.notices.map((notice) => (
                <li key={notice._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-start">
                    <div className="p-2 bg-amber-100 rounded-full mr-3">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{notice.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notice.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>Posted by: {notice.createdBy.first_name} {notice.createdBy.last_name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-gray-500">No notices available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;