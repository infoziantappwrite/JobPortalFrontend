/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  FiMail, FiPhone, FiUser, FiCheckCircle, FiMapPin, FiBook, FiBriefcase, FiDollarSign,
  FiGithub, FiGlobe, FiLinkedin, FiFacebook, FiTwitter, FiLink
} from 'react-icons/fi';
import apiClient from '../../api/apiClient';

const defaultProfileImage = 'https://www.w3schools.com/howto/img_avatar.png';

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/company/info');
        setProfile(res.data.companyInfo);
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

  const Section = ({ title, fields }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-indigo-700 border-b pb-1 border-indigo-300">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ label, value, icon, isLink }) => (
          <div key={label} className="flex items-start gap-3 bg-indigo-100/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-indigo-200">
            <div className="text-indigo-600 text-xl mt-1">{icon}</div>
            <div>
              <p className="text-xs text-indigo-700 font-medium mb-1 uppercase tracking-wide">{label}</p>
              {isLink && value ? (
                <a
                  href={value.startsWith('http') ? value : `https://${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-900 font-semibold hover:underline break-words"
                >
                  {value}
                </a>
              ) : (
                <p className="text-indigo-950 font-semibold break-words">{value || '-'}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200/30 via-white to-indigo-200/30 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-xl space-y-12 border border-indigo-100">
        <div className="text-center">
          <img
            src={profile.companyLogo || defaultProfileImage}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-300 object-cover shadow-lg mb-4"
          />
          <h2 className="text-3xl font-bold text-indigo-900">{profile.name}</h2>
          <p className="text-sm text-indigo-600">{profile.email}</p>
        </div>

        <Section
          title="Company Details"
          fields={[
            { label: 'Phone', value: profile.phone, icon: <FiPhone /> },
            { label: 'Website', value: profile.website, icon: <FiGlobe />, isLink: true },
            { label: 'Location', value: profile.location, icon: <FiMapPin /> },
            { label: 'Founded On', value: profile.since?.substring(0, 10), icon: <FiBriefcase /> },
            { label: 'Team Size', value: profile.teamSize, icon: <FiUser /> },
            { label: 'Industry', value: profile.primaryIndustry, icon: <FiBriefcase /> },
            { label: 'Categories', value: profile.categories?.join(', '), icon: <FiBook /> },
            { label: 'Listed in Search', value: profile.allowInSearch ? 'Yes' : 'No', icon: <FiCheckCircle /> },
            { label: 'About', value: profile.about, icon: <FiBook /> }
          ]}
        />

        <Section
          title="Social Profiles"
          fields={[
            { label: 'Facebook', value: profile.socials?.facebook, icon: <FiFacebook className="text-[#1877F2]" />, isLink: true },
            { label: 'LinkedIn', value: profile.socials?.linkedIn, icon: <FiLinkedin className="text-[#0A66C2]" />, isLink: true },
            { label: 'Twitter', value: profile.socials?.twitter, icon: <FiTwitter className="text-[#1DA1F2]" />, isLink: true },
            { label: 'Google Plus', value: profile.socials?.googlePlus, icon: <FiLink className="text-[#DB4437]" />, isLink: true }
          ]}
        />
      </div>
    </div>
  );
};

export default ViewProfile;
