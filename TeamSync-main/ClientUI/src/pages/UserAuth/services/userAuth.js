import baseApi from '../../../services/baseApi';

const homeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.status === "success") {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        localStorage.setItem('token', data.token);
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                }
            }
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: "/auth/signup",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: userData,
            }),
        }),
        otpGenerator: builder.mutation({
            query: (email) => ({
                url: "/auth/generateotp",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: { email },
            }),
        }),
    }),
});

export const { useLoginMutation, useSignupMutation, useOtpGeneratorMutation } = homeApi;
export default homeApi;
