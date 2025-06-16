import React, { useState, useEffect } from 'react';
import {
  useProfileStatsQuery,
  useUpdateUserMutation,
  useUpdateEmploymentMutation,
  useUpdateContactMutation,
} from "./services";

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // User data
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    email: '',

    // Employment data
    job_title: '',
    employee_id: '',
    department: '',
    employment_type: '',
    employee_status: '',
    work_location: '',
    shift_timing: '',
    work_email: '',

    // Contact data
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });

  // Fetch user profile data using RTK Query
  const { data: profileData, isLoading, isError, error } = useProfileStatsQuery();

  // RTK Query mutations
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateEmployment, { isLoading: isUpdatingEmployment }] = useUpdateEmploymentMutation();
  const [updateContact, { isLoading: isUpdatingContact }] = useUpdateContactMutation();

  // Set form data when profile data is loaded
  useEffect(() => {
    if (profileData?.userStats?.data) {
      const userData = profileData.userStats.data.user || {};
      const employmentData = profileData.userStats.data.employment || {};
      const contactData = profileData.userStats.data.contact || {};

      setFormData({
        // User data
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth).toISOString().split('T')[0] : '',
        gender: userData.gender || '',
        phone_number: userData.phone_number || '',
        email: userData.email || '',

        // Employment data
        job_title: employmentData.job_title || '',
        employee_id: employmentData.employee_id || '',
        department: employmentData.department || '',
        employment_type: employmentData.employment_type || '',
        employee_status: employmentData.employee_status || '',
        work_location: employmentData.work_location || '',
        shift_timing: employmentData.shift_timing || '',
        work_email: employmentData.work_email || '',

        // Contact data
        street: contactData.street || '',
        city: contactData.city || '',
        state: contactData.state || '',
        zip_code: contactData.zip_code || '',
        country: contactData.country || ''
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        phone_number: formData.phone_number,
        email: formData.email
      };

      const employmentData = {
        job_title: formData.job_title,
        employee_id: formData.employee_id,
        department: formData.department,
        employment_type: formData.employment_type,
        employee_status: formData.employee_status,
        work_location: formData.work_location,
        shift_timing: formData.shift_timing,
        work_email: formData.work_email
      };

      const contactData = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        phone_number: formData.phone_number
      };

      // Update all three collections
      await Promise.all([
        updateUser(userData),
        updateEmployment(employmentData),
        updateContact(contactData)
      ]);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original data
    if (profileData?.userStats?.data) {
      const userData = profileData.userStats.data.user || {};
      const employmentData = profileData.userStats.data.employment || {};
      const contactData = profileData.userStats.data.contact || {};

      setFormData({
        // User data
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth).toISOString().split('T')[0] : '',
        gender: userData.gender || '',
        phone_number: userData.phone_number || '',
        email: userData.email || '',

        // Employment data
        job_title: employmentData.job_title || '',
        employee_id: employmentData.employee_id || '',
        department: employmentData.department || '',
        employment_type: employmentData.employment_type || '',
        employee_status: employmentData.employee_status || '',
        work_location: employmentData.work_location || '',
        shift_timing: employmentData.shift_timing || '',
        work_email: employmentData.work_email || '',

        // Contact data
        street: contactData.street || '',
        city: contactData.city || '',
        state: contactData.state || '',
        zip_code: contactData.zip_code || '',
        country: contactData.country || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading profile data</p>
          <p>{error?.message || "An unexpected error occurred"}</p>
        </div>
      </div>
    );
  }

  if (!profileData?.userStats?.data) {
    return (
      <div className="p-8 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No profile data available. Please check your account status.</p>
        </div>
      </div>
    );
  }

  const userData = profileData.userStats.data.user || {};
  const employmentData = profileData.userStats.data.employment || {};
  const contactData = profileData.userStats.data.contact || {};

  const isSaving = isUpdatingUser || isUpdatingEmployment || isUpdatingContact;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and profile settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
        ) : (
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
          </div>
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                    {userData.first_name?.charAt(0)}{userData.last_name?.charAt(0)}
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">{userData.first_name} {userData.last_name}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userData.first_name} {userData.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userData.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{formatDate(userData.date_of_birth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{userData.gender}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employment Information Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Employment Information
            </h2>
          </div>
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className={`px-4 py-2 rounded-full ${employmentData.employee_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {employmentData.employee_status || 'Status Not Set'}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Job Title</p>
                    <p className="font-medium">{employmentData.job_title || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="font-medium">{employmentData.employee_id || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{employmentData.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="font-medium">{employmentData.employment_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Work Location</p>
                    <p className="font-medium">{employmentData.work_location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shift Timing</p>
                    <p className="font-medium">{employmentData.shift_timing || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Work Email</p>
                    <p className="font-medium">{employmentData.work_email || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Status</label>
                  <select
                    name="employee_status"
                    value={formData.employee_status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                  <input
                    type="text"
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Timing</label>
                  <input
                    type="text"
                    name="shift_timing"
                    value={formData.shift_timing}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    name="work_email"
                    value={formData.work_email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Contact Information
            </h2>
          </div>
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Street</p>
                    <p className="font-medium">{contactData.street || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{contactData.city || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium">{contactData.state || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zip Code</p>
                    <p className="font-medium">{contactData.zip_code || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium">{contactData.country || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;