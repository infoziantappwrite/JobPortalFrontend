/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    FiMail, FiPhone, FiUser, FiCheckCircle, FiMapPin, FiBook, FiBriefcase,
    FiGlobe, FiLinkedin, FiFacebook, FiTwitter, FiLink
} from 'react-icons/fi';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom'; // ⬅️ Import this
import { useParams } from 'react-router-dom';

const defaultProfileImage = 'https://www.w3schools.com/howto/img_avatar.png';
const defaultCoverImage = 'https://via.placeholder.com/1200x300.png?text=Company+Cover+Image';

const SuperCompanyViewPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // ⬅️ Initialize navigate
    const { id } = useParams(); // 👈 get companyId from route

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/superadmin/company/${id}`);
        setProfile(res.data.company);
       // console.log('Fetched Company Profile:', res.data);
        
      } catch (err) {
        setError('Failed to fetch company profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);
    if (loading) return <p className="text-center mt-10">Loading profile...</p>;
    if (error) return <p className="text-red-600 text-center">{error}</p>;
    if (!profile) return <p className="text-center">No profile data found.</p>;

    const Section = ({ title, fields }) => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-700 border-b pb-1 border-indigo-300">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ label, value, icon, isLink }) => (
                    <div
                        key={label}
                        className="flex items-start gap-3 bg-indigo-100/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-indigo-200"
                    >
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

                {/* Cover Image Banner */}
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow border border-indigo-200">
                    <img
                        src={profile.coverImage || defaultCoverImage}
                        alt="Company Cover"
                        className="w-full h-full object-cover"
                    />
                    {/* Logo and Name Overlay */}
                    <div className="absolute bottom-0 left-0 w-full flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 pl-6">
                        <img
                            src={profile.companyLogo || defaultProfileImage}
                            alt="Company Logo"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-900">{profile.name}</h2>
                            <p className="text-sm text-indigo-600">{profile.email}</p>
                        </div>
                    </div>
                </div>

                {/* Main Sections */}
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

export default SuperCompanyViewPage;
