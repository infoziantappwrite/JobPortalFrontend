import React, { useEffect, useState } from 'react';

import { Mail, User, ShieldCheck } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const About = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser(); // Get user from context
 setUserInfo(user);
 

  if (loading) return <div className="p-6 font-jost text-gray-700">Loading user details...</div>;
  if (error) return <div className="p-6 font-jost text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden font-jost max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-teal-500 to-indigo-600 px-6 py-4">
        <h2 className="text-white text-2xl font-bold">About Your Profile</h2>
        <p className="text-indigo-100 text-sm mt-1">User information overview</p>
      </div>

      <div className="p-6 space-y-5 text-gray-800">
        <div className="flex items-center space-x-3">
          <User className="text-indigo-600" />
          <p><span className="font-semibold">Name:</span> {userInfo.name}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="text-indigo-600" />
          <p><span className="font-semibold">Email:</span> {userInfo.email}</p>
        </div>

        <div className="flex items-center space-x-3">
          <ShieldCheck className="text-indigo-600" />
          <p>
            <span className="font-semibold">Role:</span>{' '}
            <span className="capitalize">{userInfo.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
