import React, { useState } from 'react';
import {
  UserPlus, X, User, AlertCircle, Users, Briefcase, Check, ArrowRight,
  Trash2, UserMinus, Edit, Save, RefreshCw, ChevronLeft
} from 'lucide-react';
import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useAddUserToTeamMutation,
  useRemoveUserFromTeamMutation,
  useGetTeamDetailsQuery
} from '../services';

const TeamManagement = () => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [view, setView] = useState('loading');

  // States for team management
  const [emailToAdd, setEmailToAdd] = useState('');
  const [emailsToAdd, setEmailsToAdd] = useState([]);

  // RTK Query hooks
  const { data: teamDetails, isLoading, isError, refetch } = useGetTeamDetailsQuery();
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();
  const [addUser, { isLoading: isAddingUser }] = useAddUserToTeamMutation();
  const [removeUser, { isLoading: isRemovingUser }] = useRemoveUserFromTeamMutation();

  // Set the view based on API response
  React.useEffect(() => {
    if (isLoading) {
      setView('loading');
    } else if (isError || !teamDetails) {
      setView('create');
    } else {
      setView('manage');
    }
  }, [isLoading, isError, teamDetails]);

  // Team creation functions
  const addMember = () => {
    if (!memberEmail.trim()) return;
    if (members.some(m => m.email === memberEmail)) {
      setError('This member is already added');
      return;
    }

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setMembers([...members, {
      email: memberEmail,
      avatarColor: randomColor,
      initials: memberEmail.substring(0, 2).toUpperCase()
    }]);
    setMemberEmail('');
    setError('');
  };

  const removeMember = (email) => {
    setMembers(members.filter(member => member.email !== email));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    setError('');

    try {
      await createTeam({
        name: teamName,
        description,
        members: members.map(m => m.email)
      }).unwrap();

      setIsSuccess(true);
      setTimeout(() => {
        refetch();
        setView('manage');
      }, 2000);
    } catch (err) {
      setError(err.data?.message || 'Failed to create team');
    }
  };

  const nextStep = () => {
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
    setError('');
    setFormStep(2);
  };

  const prevStep = () => {
    setFormStep(1);
    setError('');
  };

  // Team management functions
  const handleAddUserToTeam = async () => {
    if (!emailToAdd.trim()) return;

    try {
      await addUser({ userEmails: [emailToAdd] }).unwrap();
      setEmailToAdd('');
      refetch();
    } catch (err) {
      setError(err.data?.message || 'Failed to add user to team');
    }
  };

  const handleRemoveUserFromTeam = async (email) => {
    if (!email) return;

    try {
      await removeUser({ userEmails: [email] }).unwrap();
      refetch();
    } catch (err) {
      setError(err.data?.message || 'Failed to remove user from team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteTeam().unwrap();
      setView('create');
      setTeamName('');
      setDescription('');
      setMembers([]);
      setFormStep(1);
    } catch (err) {
      setError(err.data?.message || 'Failed to delete team');
    }
  };

  // Add multiple emails to the list
  const addEmailToList = () => {
    if (!emailToAdd.trim()) return;
    if (emailsToAdd.includes(emailToAdd)) {
      setError('This email is already in the list');
      return;
    }
    setEmailsToAdd([...emailsToAdd, emailToAdd]);
    setEmailToAdd('');
  };

  const removeEmailFromList = (email) => {
    setEmailsToAdd(emailsToAdd.filter(e => e !== email));
  };

  const handleAddMultipleUsers = async () => {
    if (emailsToAdd.length === 0) return;

    try {
      await addUser({ userEmails: emailsToAdd }).unwrap();
      setEmailsToAdd([]);
      refetch();
    } catch (err) {
      setError(err.data?.message || 'Failed to add users to team');
    }
  };

  // Render loading view
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <RefreshCw size={32} className="text-blue-600 animate-spin mb-4" />
      <h3 className="text-lg font-medium text-gray-700">Loading team details...</h3>
    </div>
  );

  const renderCreateTeam = () => {
    if (isSuccess) {
      return (
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
            <h2 className="text-2xl font-bold">Team Created!</h2>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{teamName}</h3>
            <p className="text-gray-600 mb-4 text-sm">{description}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {members.map((member, idx) => (
                <div key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-xs">
                  {member.email}
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Your team is being set up...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
          <h2 className="text-2xl font-bold">Create a New Team</h2>
          <p className="text-blue-100 mt-1 text-sm">Build your dream team in TeamSync</p>

          {/* Progress indicator */}
          <div className="flex items-center mt-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formStep === 1 ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} font-bold text-xs`}>1</div>
            <div className="flex-1 h-1 mx-2 bg-blue-400">
              <div className={`h-full bg-white ${formStep === 1 ? 'w-0' : 'w-full'} transition-all duration-300`}></div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formStep === 2 ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} font-bold text-xs`}>2</div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateTeam}>
            {formStep === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start gap-2">
                  <Briefcase className="text-blue-600 mt-1" size={18} />
                  <div>
                    <h3 className="font-medium text-blue-800 text-sm">Team Information</h3>
                    <p className="text-blue-600 text-xs">Create your team with a unique name and purpose</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name*
                  </label>
                  <input
                    id="teamName"
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter a memorable team name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    rows="3"
                    placeholder="Describe your team's goals and purpose"
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start gap-2">
                  <Users className="text-blue-600 mt-1" size={18} />
                  <div>
                    <h3 className="font-medium text-blue-800 text-sm">Team Members</h3>
                    <p className="text-blue-600 text-xs">Add colleagues to collaborate with</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invite Members
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                      placeholder="Enter email address"
                    />
                    <button
                      type="button"
                      onClick={addMember}
                      className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Press Enter or click the button to add</p>
                </div>

                {members.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Team Members ({members.length})</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${member.avatarColor} flex items-center justify-center text-white font-medium text-xs`}>
                              {member.initials}
                            </div>
                            <span className="text-gray-800 text-sm">{member.email}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMember(member.email)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <Users size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">No members added yet</p>
                    <p className="text-gray-400 text-xs">Add team members to collaborate with</p>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className={`flex-1 py-2 px-3 rounded-lg text-white font-medium ${isCreating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      } transition-colors flex items-center justify-center gap-2 text-sm`}
                  >
                    {isCreating ? 'Creating...' : 'Create Team'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  // Render team management view
  const renderManageTeam = () => {
    if (!teamDetails) return null;

    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{teamDetails.name}</h2>
              <p className="text-blue-100 mt-1 text-sm">{teamDetails.description || 'No description provided'}</p>
            </div>
            <button
              onClick={handleDeleteTeam}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm"
            >
              <Trash2 size={16} />
              {isDeleting ? 'Deleting...' : 'Delete Team'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team Members */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                Team Members ({teamDetails.members?.length || 0})
              </h3>

              {teamDetails.members && teamDetails.members.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {teamDetails.members.map((member, index) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'];
                    const memberColor = colors[index % colors.length];
                    const initials = member.email ? member.email.substring(0, 2).toUpperCase() : 'ME';

                    return (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${memberColor} flex items-center justify-center text-white font-medium text-xs`}>
                            {initials}
                          </div>
                          <div>
                            <span className="text-gray-800 text-sm block">{member.email || 'Unknown Email'}</span>
                            {member.isAdmin && <span className="text-blue-600 text-xs">Admin</span>}
                          </div>
                        </div>
                        {!member.isAdmin && (
                          <button
                            onClick={() => handleRemoveUserFromTeam(member.email)}
                            disabled={isRemovingUser}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                          >
                            <UserMinus size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Users size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No members in this team yet</p>
                  <p className="text-gray-400 text-xs mt-1">Add members using the form</p>
                </div>
              )}
            </div>

            {/* Add Members */}
            <div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <UserPlus size={18} className="text-blue-600" />
                  Add Member
                </h3>

                <div className="flex mb-4">
                  <input
                    type="email"
                    value={emailToAdd}
                    onChange={(e) => setEmailToAdd(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUserToTeam())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter email address"
                  />
                  <button
                    onClick={handleAddUserToTeam}
                    disabled={isAddingUser || !emailToAdd.trim()}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center ${isAddingUser || !emailToAdd.trim() ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                  >
                    {isAddingUser ? <RefreshCw size={16} className="animate-spin" /> : 'Add'}
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <UserPlus size={18} className="text-blue-600" />
                  Bulk Add Members
                </h3>

                <div className="flex mb-3">
                  <input
                    type="email"
                    value={emailToAdd}
                    onChange={(e) => setEmailToAdd(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmailToList())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter email address"
                  />
                  <button
                    onClick={addEmailToList}
                    disabled={!emailToAdd.trim()}
                    className={`bg-gray-100 text-gray-700 px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center ${!emailToAdd.trim() ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'hover:bg-gray-200'
                      }`}
                  >
                    Add to List
                  </button>
                </div>

                {emailsToAdd.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                      {emailsToAdd.map((email, idx) => (
                        <div key={idx} className="bg-white px-2 py-1 rounded flex items-center gap-1 text-sm border border-gray-200">
                          <span className="text-gray-800">{email}</span>
                          <button
                            onClick={() => removeEmailFromList(email)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddMultipleUsers}
                      disabled={isAddingUser}
                      className={`w-full py-2 px-3 rounded-lg text-white font-medium ${isAddingUser ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        } transition-colors flex items-center justify-center gap-2 text-sm`}
                    >
                      {isAddingUser ? 'Adding...' : `Add ${emailsToAdd.length} Members to Team`}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-4">
                    <p className="text-gray-500 text-sm">No emails added to the list yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-700 text-sm">
              <span className="font-semibold">Remember:</span> Team members will need to accept their invitations to join your team.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
      <div className="w-full relative">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-lg opacity-10 transform rotate-12"></div>
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-indigo-500 rounded-full opacity-10"></div>

        {view === 'loading' && renderLoading()}
        {view === 'create' && renderCreateTeam()}
        {view === 'manage' && renderManageTeam()}

        <div className="text-center mt-6 text-indigo-800 opacity-80 text-sm">
          TeamSync • Build better teams together
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;