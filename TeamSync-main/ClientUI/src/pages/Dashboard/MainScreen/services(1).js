
import baseApi from '../../../services/baseApi';

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        Dashboardstats: builder.query({
            query: () => ({
                url: "/dashboard/dashboardstats",
                method: "GET",
                credentials: "include"
            }),
        }),
        createnote: builder.mutation({
            query: (data) => ({
                url: "/dashboard/createnote",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),
        deletenote: builder.mutation({
            query: (id) => ({
                url: `/dashboard/deletenote?id=${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        TaskUpdate: builder.mutation({
            query: ({ id, status }) => ({
                url: `/dashboard/updatetask`,
                method: "PUT",
                credentials: "include",
                body: { id, status },
            }),
        }),
        startAttendance: builder.mutation({
            query: () => ({
                url: '/dashboard/startattendance',
                method: 'PUT',
            }),
        }),
        startBreak: builder.mutation({
            query: () => ({
                url: '/dashboard/startbreak',
                method: 'PUT',
            }),
        }),
        endBreak: builder.mutation({
            query: () => ({
                url: '/dashboard/endbreak',
                method: 'PUT',
            }),
        }),
        endAttendance: builder.mutation({
            query: () => ({
                url: '/dashboard/endattendance',
                method: 'PUT',
            }),
        }),
        ProfileStats: builder.query({
            query: () => ({
                url: "/dashboard/user/profilestats",
                method: "GET",
                credentials: "include"
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: "/dashboard/user/update-profile",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
        }),
        updateEmployment: builder.mutation({
            query: (data) => ({
                url: "/dashboard/user/update-employment",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
        }),
        updateContact: builder.mutation({
            query: (data) => ({
                url: "/dashboard/user/update-contact",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
        }),

        // ✅ Admin Routes
        createTeam: builder.mutation({
            query: (data) => ({
                url: "/admin/createteam",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),
        deleteTeam: builder.mutation({
            query: () => ({
                url: `/admin/deleteteam`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        addUserToTeam: builder.mutation({
            query: (data) => ({
                url: "/admin/team/addUser",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),
        removeUserFromTeam: builder.mutation({
            query: (data) => ({
                url: "/admin/team/deleteUser",
                method: "DELETE",
                credentials: "include",
                body: data,
            }),
        }),
        getTeamDetails: builder.query({
            query: () => ({
                url: "/admin/teamdetails",
                method: "GET",
                credentials: "include",
            }),
        }),
        createTask: builder.mutation({
            query: (data) => ({
                url: "/admin/createtask",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),
        AdminupdateTask: builder.mutation({
            query: (data) => ({
                url: "/admin/updatetask",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
        }),
        deleteTask: builder.mutation({
            query: ({ taskId }) => ({
                url: `/admin/deletetask`,
                method: "DELETE",
                credentials: "include",
                body: { taskId },
            }),
        }),
        createNotice: builder.mutation({
            query: (data) => ({
                url: "/admin/createnotice",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),
        getNotices: builder.query({
            query: () => ({
                url: `/admin/notices`,
                method: "GET",
                credentials: "include",
            }),
        }),
        deleteNotice: builder.mutation({
            query: (noticeId) => ({
                url: `/admin/deletenotice`,
                method: "DELETE",
                credentials: "include",
                body: { id: noticeId },
            }),
        }),
        getViewTasks: builder.query({
            query: () => ({
                url: "/admin/viewtasks",
                method: "GET",
                credentials: "include",
            }),
        }),
        AdminDashboard: builder.query({
            query: () => ({
                url: "/admin/dashboard",
                method: "GET",
                credentials: "include",
            }),
        }),
        Logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                credentials: "include",
            }),
        }),

    }),
});

export const {
    // Dashboard Stats & Profile
    useDashboardstatsQuery,
    useProfileStatsQuery,


    // Notes Management
    useCreatenoteMutation,
    useDeletenoteMutation,

    // Task Management
    useCreateTaskMutation,
    useTaskUpdateMutation,
    useDeleteTaskMutation,
    useGetViewTasksQuery,
    useAdminupdateTaskMutation,

    // Attendance & Break Management
    useStartAttendanceMutation,
    useStartBreakMutation,
    useEndBreakMutation,
    useEndAttendanceMutation,

    // User Management
    useUpdateUserMutation,
    useUpdateEmploymentMutation,
    useUpdateContactMutation,

    // Team Management (Admin)
    useCreateTeamMutation,
    useDeleteTeamMutation,
    useAddUserToTeamMutation,
    useRemoveUserFromTeamMutation,
    useGetTeamDetailsQuery,

    // Notice Management (Admin)
    useCreateNoticeMutation,
    useGetNoticesQuery,
    useDeleteNoticeMutation,



    //dashbaod qyry for admin 
    useAdminDashboardQuery,
    useLogoutMutation

} = dashboardApi;


export default dashboardApi;
