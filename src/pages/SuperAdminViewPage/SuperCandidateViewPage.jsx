import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    FiPhone, FiMapPin, FiHome, FiBriefcase, FiBookOpen,
    FiDollarSign, FiGlobe, FiLinkedin, FiTwitter,
    FiFacebook, FiInstagram, FiUser, FiGithub, FiMail
} from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import apiClient from '../../api/apiClient';

// Reusable Read-only Timeline Section
const ReadOnlySectionTimeline = ({ title, items = [], type }) => {
    const getInitial = (text) => text?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6">{title}</h2>
            <div className="border-l-2 border-dashed border-red-200 ml-5 pl-5 space-y-8">
                {items.length > 0 ? (
                    items.map((item, index) => {
                        const heading =
                            type === 'education' ? item.degree :
                                type === 'experience' ? item.jobTitle :
                                    item.title;

                        const subHeading =
                            type === 'education' ? item.institution :
                                type === 'experience' ? item.company :
                                    `${item.year}`;

                        const badge =
                            type === 'awards' ? item.year : `${item.startYear} - ${item.endYear}`;

                        const initial = getInitial(subHeading);

                        return (
                            <div key={index} className="relative group">
                                <span className="absolute -left-9 top-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                                    {initial}
                                </span>
                                <h3 className="text-lg font-semibold">
                                    {heading}
                                    <span className="inline-block bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full ml-2">
                                        {badge}
                                    </span>
                                </h3>
                                <h4 className="text-red-600 text-md">{subHeading}</h4>
                                <p className="text-gray-500 mt-2">{item.description}</p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">No {title.toLowerCase()} information available.</p>
                )}
            </div>
        </div>
    );
};

const SuperCandidateViewPage = () => {
    const [candidateInfo, setCandidateInfo] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiClient.get(`/superadmin/candidate/candidate-info/${id}`);
                setCandidateInfo(res.data.candidateInfo);
            } catch (error) {
                console.error('Error fetching candidate profile:', error);
            }
        };

        fetchProfile();
    }, [id]);

    if (!candidateInfo) return <div className="text-center p-10">Loading profile...</div>;

    const {
        name, profileImageURL, profileDescription, email, phone, age, country, city, fullAddress,
        jobTitle, currentSalary, expectedSalary, education, yearsOfExp,
        languages = [], categories = [], socials = {}, educationHistory = [],
        workExperience = [], awards = []
    } = candidateInfo;

    return (
        <div className="bg-blue-100 min-h-screen p-10">
            <div className="p-6 bg-white rounded-2xl shadow-lg max-w-6xl mx-auto space-y-10">
                <h2 className="flex items-center justify-center gap-3 text-3xl font-semibold text-gray-800 mb-8">
                    <HiOutlineDocumentText className="text-blue-600 text-3xl" />
                    <span className="border-b-2 border-blue-600 pb-1">My Resume</span>
                </h2>

                {/* Profile Header */}
                <div className="flex items-center gap-6 bg-blue-100 p-6 rounded-xl shadow-lg">
                    {profileImageURL ? (
                        <img
                            src={profileImageURL}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-2 border-blue-500">
                            {name?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                        <h2 className="text-lg font-semibold text-blue-600">{jobTitle}</h2>
                        <div className="mt-2 border-l-4 border-indigo-400 pl-2">
                            <p className="text-gray-600 text-sm">{profileDescription}</p>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-800">
                    <div className="flex items-center gap-2"><FiPhone className="text-teal-600" /><strong>Phone:</strong> {phone || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiMail className="text-blue-600" /><strong>Email:</strong> {email || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiUser className="text-blue-600" /><strong>Age:</strong> {age || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiMapPin className="text-teal-600" /><strong>Location:</strong> {city && country ? `${city}, ${country}` : "N/A"}</div>
                    <div className="flex items-center gap-2"><FiHome className="text-blue-600" /><strong>Address:</strong> {fullAddress || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiDollarSign className="text-teal-600" /><strong>Current Salary:</strong> {currentSalary || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiDollarSign className="text-blue-600" /><strong>Expected Salary:</strong> {expectedSalary || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiBookOpen className="text-teal-600" /><strong>Education:</strong> {education || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiBriefcase className="text-blue-600" /><strong>Experience:</strong> {yearsOfExp ? `${yearsOfExp} years` : "N/A"}</div>
                </div>

                {/* Skills and Socials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-100 p-6 rounded-lg mt-8">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                        <div className="flex gap-2 flex-wrap">
                            {languages.length > 0 ? (
                                languages.map((lang, idx) => (
                                    <span key={idx} className="bg-white px-3 py-1 rounded-full shadow text-sm">{lang}</span>
                                ))
                            ) : (
                                <span className="text-gray-500">N/A</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Categories</h3>
                        <div className="flex gap-2 flex-wrap">
                            {categories.length > 0 ? (
                                categories.map((cat, idx) => (
                                    <span key={idx} className="bg-white px-3 py-1 rounded-full shadow text-sm">{cat}</span>
                                ))
                            ) : (
                                <span className="text-gray-500">N/A</span>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-800 mb-2">Social Links</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            {socials.linkedin && (
                                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline">
                                    <FiLinkedin className="text-xl" /> LinkedIn
                                </a>
                            )}
                            {socials.twitter && (
                                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-500 hover:underline">
                                    <FiTwitter className="text-xl" /> Twitter
                                </a>
                            )}
                            {socials.facebook && (
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                    <FiFacebook className="text-xl" /> Facebook
                                </a>
                            )}
                            {socials.instagram && (
                                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-500 hover:underline">
                                    <FiInstagram className="text-xl" /> Instagram
                                </a>
                            )}
                            {socials.website && (
                                <a href={socials.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-teal-600 hover:underline">
                                    <FiGlobe className="text-xl" /> Website
                                </a>
                            )}
                            {socials.github && (
                                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:underline">
                                    <FiGithub className="text-xl" /> GitHub
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Timeline Sections */}
                <ReadOnlySectionTimeline title="Education" items={educationHistory} type="education" />
                <hr />
                <ReadOnlySectionTimeline title="Experience" items={workExperience} type="experience" />
                <hr />
                <ReadOnlySectionTimeline title="Awards" items={awards} type="awards" />
            </div>
        </div>
    );
};

export default SuperCandidateViewPage;
