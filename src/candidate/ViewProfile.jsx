/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  FiMail, FiPhone, FiUser, FiCheckCircle, FiMapPin, FiBook, FiBriefcase, FiDollarSign, FiGithub, FiGlobe, FiX, FiLinkedin, FiFacebook, FiTwitter, FiLink,
} from 'react-icons/fi';
import apiClient from '../api/apiClient';
 // Use your own fallback image

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];

  const getColorFromName = (name) => {
    if (!name) return 'bg-gray-500';
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/candidate/info/get-profile');
        //console.log('Profile data:', res.data.candidateInfo); 
        setProfile(res.data.candidateInfo);
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!profile) return <p className="text-center">No profile data found.</p>;
  //console.log(profile)

  const Section = ({ title, fields }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ label, value, icon, isLink }) => (
          <div key={label} className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
            <div className="text-indigo-500 mt-1">{icon}</div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              {isLink && value ? (
                <a
                  href={value.startsWith('http') ? value : `https://${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline break-words"
                >
                  {value}
                </a>

              ) : (
                <p className="font-medium text-gray-800 break-words">{value || '-'}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-5">
      <div className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-xl space-y-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">User Profile</h2>
          <p className="text-center text-gray-500 text-sm mb-6">All your personal and professional info ✨</p>

          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-28 h-28 rounded-full ${getColorFromName(profile.name)} text-white flex items-center justify-center text-3xl font-bold border shadow`}
              >
                {profile.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="text-gray-700 font-semibold">{profile.name}</span>
            </div>
          </div>

        </div>

        <Section
          title="Basic Information"
          fields={[
            { label: 'Email', value: profile.email, icon: <FiMail /> },
            { label: 'Phone', value: profile.phone, icon: <FiPhone /> },
            { label: 'Age', value: profile.age, icon: <FiUser /> },
            { label: 'Location', value: `${profile.city}, ${profile.country}`, icon: <FiMapPin /> },
            { label: 'Full Address', value: profile.fullAddress, icon: <FiMapPin /> },
            { label: 'Profile Description', value: profile.profileDescription, icon: <FiBook /> },
          ]}
        />

        <Section
          title="Job & Education"
          fields={[
            { label: 'Job Title', value: profile.jobTitle, icon: <FiBriefcase /> },
            { label: 'Education', value: profile.education, icon: <FiBook /> },
            { label: 'Experience', value: profile.yearsOfExp, icon: <FiBriefcase /> },
            { label: 'Current Salary', value: profile.currentSalary, icon: <FiDollarSign /> },
            { label: 'Expected Salary', value: profile.expectedSalary, icon: <FiDollarSign /> },
          ]}
        />

        <Section
          title="Preferences"
          fields={[
            { label: 'Languages', value: profile.languages.join(', '), icon: <FiGlobe /> },
            { label: 'Categories', value: profile.categories.join(', '), icon: <FiBook /> },
            { label: 'Allow Profile Listing', value: profile.allowProfileListing ? 'Yes' : 'No', icon: <FiCheckCircle /> },
          ]}
        />

        <Section
          title="Online Presence"
          fields={[
            {
              label: 'LinkedIn',
              value: profile.socials.linkedin,
              icon: <FiLinkedin className="text-[#0A66C2]" />,
              isLink: true,
            },
            {
              label: 'Facebook',
              value: profile.socials.facebook,
              icon: <FiFacebook className="text-[#1877F2]" />,
              isLink: true,
            },
            {
              label: 'Twitter',
              value: profile.socials.twitter,
              icon: <FiTwitter className="text-[#1DA1F2]" />,
              isLink: true,
            },
            {
              label: 'Github',
              value: profile.socials.github,
              icon: <FiGithub className="text-red-500" />,
              isLink: true,
            },
            {
              label: 'Website',
              value: profile.socials.website,
              icon: <FiLink className="text-green-600" />,
              isLink: true,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ViewProfile;
