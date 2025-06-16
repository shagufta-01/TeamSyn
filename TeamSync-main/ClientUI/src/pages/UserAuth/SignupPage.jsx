import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LoginBg from "./assests/LoginPageBg.png";
import LogindevBg from "./assests/LogindevBg.png";
import { useSignupMutation, useOtpGeneratorMutation } from "./services/userAuth";
import { useNavigate } from "react-router-dom";

function SignupPage() {
    const navigate = useNavigate();
    const [signup, { isLoading, error: apiError }] = useSignupMutation();
    const [generateOtp] = useOtpGeneratorMutation();
    const [otpSent, setOtpSent] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [otpButtonDisabled, setOtpButtonDisabled] = useState(false);
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
        role: "user" // Default role is 'user'
    });

    const handleNavigation = () => {
        navigate("/UserAuth/login");
    };

    // Check if email is valid
    useEffect(() => {
        if (formData.email && formData.email.includes('@') && formData.email.includes('.')) {
            setOtpSent(true);
        } else {
            setOtpSent(false);
            setOtpMessage("");
        }
    }, [formData.email]);

    // Check if password and confirm_password match
    useEffect(() => {
        if (formData.password || formData.confirm_password) {
            if (formData.password !== formData.confirm_password) {
                setPasswordError("Passwords do not match");
            } else {
                setPasswordError("");
            }
        }
    }, [formData.password, formData.confirm_password]);

    // Check password requirements
    useEffect(() => {
        const password = formData.password;
        if (password) {
            const rules = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };

            setPasswordRules(rules);

            if (!rules.length || !rules.uppercase || !rules.lowercase || !rules.number || !rules.special) {
                setPasswordError("Password does not meet requirements");
            } else if (formData.password === formData.confirm_password || !formData.confirm_password) {
                setPasswordError("");
            }
        }
    }, [formData.password]);

    // Age validation
    useEffect(() => {
        if (formData.date_of_birth) {
            const birthDate = new Date(formData.date_of_birth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            // If birth month is later in the year or same month but birth day is later
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                if (age - 1 < 18) {
                    setAgeError("You must be at least 18 years old to register");
                } else {
                    setAgeError("");
                }
            } else {
                if (age < 18) {
                    setAgeError("You must be at least 18 years old to register");
                } else {
                    setAgeError("");
                }
            }
        }
    }, [formData.date_of_birth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendOtp = async () => {
        if (formData.email) {
            // Disable the OTP button for 7 seconds
            setOtpButtonDisabled(true);
            setTimeout(() => {
                setOtpButtonDisabled(false);
            }, 7000);

            try {
                await generateOtp(formData.email).unwrap();
                setOtpMessage("OTP sent successfully! Please check your email.");
                setTimeout(() => {
                    setOtpMessage("");
                }, 5000);
            } catch (err) {
                setOtpMessage("Failed to send OTP. Please try again.");
                console.error("Failed to send OTP:", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");
    
        // Final validation checks
        if (formData.password !== formData.confirm_password) {
            setPasswordError("Passwords do not match");
            return;
        }
    
        if (ageError) {
            return;
        }
    
        if (!passwordRules.length || !passwordRules.uppercase || !passwordRules.lowercase ||
            !passwordRules.number || !passwordRules.special) {
            setPasswordError("Password does not meet requirements");
            return;
        }
    
        // Disable button for 7 seconds
        setButtonDisabled(true);
        setTimeout(() => {
            setButtonDisabled(false);
        }, 7000);
    
        try {
            const { confirm_password, ...dataToSend } = formData;
            const response = await signup({ ...dataToSend, otp }).unwrap();
            console.log("Signup successful:", response);
    
            if (response.status === "success") {
                navigate("/UserAuth/login");
            }
        } catch (err) {
            console.error("Signup failed:", err);
            setGeneralError(err.data?.message || "Signup failed. Please check your information and try again.");
            setTimeout(() => {
                setGeneralError("");
            }, 5000);
        }
    };

    return (
        <>
            <Navbar />
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 py-12"
                style={{ backgroundImage: `url(${LoginBg})` }}
            >
                <div className="w-full max-w-5xl relative">
                    <div
                        className="absolute inset-0 rounded-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${LogindevBg})` }}
                    ></div>

                    {/* Main container with split layout */}
                    <div className="relative flex flex-col md:flex-row bg-black/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl overflow-hidden">

                        {/* LEFT SIDE - Signup Form */}
                        <div className="w-full md:w-3/5 border-r-0 md:border-r border-white/10">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-2xl font-bold text-white text-center">
                                    Create Your Account
                                </h2>
                                <p className="text-white/60 text-center mt-1">
                                    Join our platform to get started
                                </p>
                            </div>

                            {/* General error message */}
                            {generalError && (
                                <div className="mx-6 mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 text-sm">{generalError}</p>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="col-span-1 md:col-span-2 mt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.role === "admin"}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    role: e.target.checked ? "admin" : "user"
                                                }));
                                            }}
                                            className="rounded bg-white/5 border-white/20 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-white/70">
                                            Create account as admin
                                        </span>
                                    </label>
                                </div>
                                <form autoComplete="off" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            First Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="Enter first name"
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            Last Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Enter last name"
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            Date of Birth*
                                        </label>
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
                                            className={`w-full bg-white/5 border ${ageError ? 'border-red-500' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                            required
                                        />
                                        {ageError && (
                                            <p className="mt-2 text-sm text-red-400">
                                                {ageError}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            Gender*
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        >
                                            <option value="" disabled className="bg-gray-800">Select gender</option>
                                            <option value="Male" className="bg-gray-800">Male</option>
                                            <option value="Female" className="bg-gray-800">Female</option>
                                            <option value="Other" className="bg-gray-800">Other</option>
                                        </select>
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            Email Address*
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@company.com"
                                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                required
                                            />
                                            {formData.email && (
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={otpButtonDisabled}
                                                    className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-0.5 px-1.5 text-sm rounded-md transition-all duration-300 shadow-md shadow-indigo-500/30
                                                        ${otpButtonDisabled
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : 'hover:from-indigo-700 hover:to-purple-700'
                                                        }`}
                                                >
                                                    {otpButtonDisabled ? 'Wait...' : 'Send OTP'}
                                                </button>
                                            )}
                                        </div>
                                        {otpMessage && (
                                            <p className={`mt-2 text-sm ${otpMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                                {otpMessage}
                                            </p>
                                        )}
                                    </div>

                                    {/* OTP Input */}
                                    {otpSent && (
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-medium mb-1 text-white/80">
                                                OTP*
                                            </label>
                                            <input
                                                type="text"
                                                name="otp"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter OTP"
                                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            Phone Number*
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            Password*
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a strong password"
                                            className={`w-full bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                            required
                                        />

                                        {/* Password requirements */}
                                        {formData.password && (
                                            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                                                <p className={`text-xs ${passwordRules.length ? 'text-green-400' : 'text-white/50'}`}>
                                                    <span className={passwordRules.length ? 'text-green-400' : 'text-red-400'}>✓</span> At least 8 characters
                                                </p>
                                                <p className={`text-xs ${passwordRules.uppercase ? 'text-green-400' : 'text-white/50'}`}>
                                                    <span className={passwordRules.uppercase ? 'text-green-400' : 'text-red-400'}>✓</span> At least 1 uppercase letter
                                                </p>
                                                <p className={`text-xs ${passwordRules.lowercase ? 'text-green-400' : 'text-white/50'}`}>
                                                    <span className={passwordRules.lowercase ? 'text-green-400' : 'text-red-400'}>✓</span> At least 1 lowercase letter
                                                </p>
                                                <p className={`text-xs ${passwordRules.number ? 'text-green-400' : 'text-white/50'}`}>
                                                    <span className={passwordRules.number ? 'text-green-400' : 'text-red-400'}>✓</span> At least 1 number
                                                </p>
                                                <p className={`text-xs ${passwordRules.special ? 'text-green-400' : 'text-white/50'}`}>
                                                    <span className={passwordRules.special ? 'text-green-400' : 'text-red-400'}>✓</span> At least 1 special character
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium mb-1 text-white/80">
                                            Confirm Password*
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={formData.confirm_password}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            className={`w-full bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                            required
                                        />
                                        {passwordError && formData.confirm_password && formData.password !== formData.confirm_password && (
                                            <p className="mt-2 text-sm text-red-400">
                                                Passwords do not match
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-1 md:col-span-2 mt-2">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                required
                                                className="rounded bg-white/5 border-white/20 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-white/70">
                                                I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
                                            </span>
                                        </label>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 mt-4">
                                        <button
                                            type="submit"
                                            disabled={!!passwordError || !!ageError || buttonDisabled}
                                            className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 
                                                ${(!!passwordError || !!ageError || buttonDisabled)
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:from-indigo-700 hover:to-purple-700'
                                                }`}
                                        >
                                            {buttonDisabled ? 'Processing...' : 'Create Account'}
                                        </button>
                                        {buttonDisabled && (
                                            <p className="text-center text-white/50 text-xs mt-2">
                                                Please wait while we process your request...
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="p-4 bg-black/40 border-t border-white/10 text-center md:hidden">
                                <p className="text-white/60 text-sm">
                                    Already have an account?{" "}
                                    <button onClick={handleNavigation} className="text-indigo-400 hover:text-indigo-300 font-medium">
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE - Community Info */}
                        <div className="hidden md:flex md:w-2/5 flex-col justify-center items-center p-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
                            <div className="max-w-md text-center">
                                <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4">Join Our Community</h3>

                                <p className="text-white/80 mb-6">
                                    Create your account to access exclusive features and personalized experiences.
                                </p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-start text-left space-x-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="text-white font-medium">Secure Access</h4>
                                            <p className="text-white/60 text-sm">Your data is encrypted and protected with enterprise-grade security</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start text-left space-x-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="text-white font-medium">Streamlined Experience</h4>
                                            <p className="text-white/60 text-sm">Access all your tools and resources in one place</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start text-left space-x-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="text-white font-medium">Collaboration</h4>
                                            <p className="text-white/60 text-sm">Connect with team members for better productivity</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-4 border-t border-white/10">
                                    <p className="text-white/60 text-sm">
                                        Already have an account?{" "}
                                        <button onClick={handleNavigation} className="text-indigo-400 hover:text-indigo-300 font-medium">
                                            Sign in
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default SignupPage;