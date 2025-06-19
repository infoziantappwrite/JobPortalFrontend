import React, { useEffect, useState } from 'react';
import {
  FiUser, FiMail, FiBriefcase, FiCalendar
} from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';

const defaultProfileImage = 'https://www.w3schools.com/howto/img_avatar.png';

const EmployeeProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUserInfo(user);
      setLoading(false);
    } else {
      setError('User data not found');
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p className="text-center mt-10 text-sm text-gray-600">Loading profile...</p>;
  if (error) return <p className="text-red-600 text-center text-sm">{error}</p>;
  if (!userInfo) return <p className="text-center text-sm">No user data found.</p>;

  const fields = [
    { label: 'Name', value: userInfo.name, icon: <FiUser /> },
    { label: 'Email', value: userInfo.email, icon: <FiMail /> },
    { label: 'Position', value: userInfo.position || '-', icon: <FiBriefcase /> },
    { label: 'Joined On', value: userInfo.createdAt?.substring(0, 10), icon: <FiCalendar /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200/30 via-white to-indigo-200/30 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-8 border border-indigo-100">
        <div className="text-center">
          <img
            src={defaultProfileImage}
            alt="User Avatar"
            className="w-28 h-28 mx-auto rounded-full border-4 border-indigo-300 object-cover shadow-lg mb-4"
          />
          <h2 className="text-2xl font-bold text-indigo-900">{userInfo.name}</h2>
          <p className="text-sm text-indigo-700 font-medium capitalize mt-1">{userInfo.userType || 'N/A'}</p>
          <p className="text-sm text-indigo-600">{userInfo.email}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-700 border-b pb-1 border-indigo-300">Employee Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, value, icon }) => (
              <div
                key={label}
                className="flex items-start gap-3 bg-indigo-100/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-indigo-200"
              >
                <div className="text-indigo-600 text-xl mt-1">{icon}</div>
                <div>
                  <p className="text-xs text-indigo-700 font-medium mb-1 uppercase tracking-wide">{label}</p>
                  <p className="text-indigo-950 font-semibold break-words text-sm">{value || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
