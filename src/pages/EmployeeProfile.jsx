import React, { useEffect, useState } from 'react';
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiXCircle,
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

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <FiXCircle />
          {error}
        </div>
      </div>
    );

  const fields = [
    { label: 'Name', value: userInfo.name, icon: <FiUser /> },
    { label: 'Email', value: userInfo.email, icon: <FiMail /> },
    { label: 'Position', value: userInfo.position || '-', icon: <FiBriefcase /> },
    { label: 'Joined On', value: userInfo.createdAt?.substring(0, 10), icon: <FiCalendar /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-start justify-center p-5">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl mt-5 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <img
            src={defaultProfileImage}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-indigo-300 object-cover shadow-md"
          />
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900">{userInfo.name}</h3>
            <p className="text-indigo-700 text-sm font-medium capitalize">
              <span className="text-gray-600 font-normal capitalize">
                {userInfo.company?.name || 'N/A'}
              </span>
            </p>
            <p className="text-indigo-700 text-sm font-medium capitalize">{userInfo.userType || 'N/A'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700 border-b pb-1 border-indigo-200">
            <FiUser className="text-gray-600" />
            Profile Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, value, icon }) => (
              <div
                key={label}
                className="flex items-start gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition"
              >
                <div className="text-indigo-600 text-lg mt-1">{icon}</div>
                <div>
                  <p className="text-xs text-indigo-700 font-medium uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-gray-800 font-semibold text-sm break-words">
                    {value || '-'}
                  </p>
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
