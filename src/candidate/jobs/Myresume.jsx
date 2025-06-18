import React, { useEffect, useState } from 'react';
import {
    FiPhone, FiMapPin, FiHome, FiBriefcase, FiBookOpen,
    FiDollarSign, FiGlobe, FiLinkedin, FiTwitter,
    FiFacebook, FiInstagram, FiUser, FiGithub, FiMail
} from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import SectionTimeline from './SectionTimeline'; // Adjust path if needed
import apiClient from '../../api/apiClient';


const Myresume = () => {
    const [candidateInfo, setCandidateInfo] = useState(null);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get('/candidate/info/get-profile');
            setCandidateInfo(res.data.candidateInfo);
        } catch (error) {
            console.error('Error fetching candidate profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);
    const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];

    const getColorFromName = (name) => {
        if (!name) return 'bg-gray-500';
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };



    if (!candidateInfo) return <div className="text-center p-10">Loading profile...</div>;

    const {
        name, profileDescription, email, phone, age, country, city, fullAddress,
        jobTitle, currentSalary, expectedSalary, education, yearsOfExp,
        languages, categories, socials
    } = candidateInfo;

    return (
        <div className="bg-blue-50 min-h-screen p-10">
            <div className="p-6 bg-white rounded-2xl shadow-lg max-w-6xl mx-auto space-y-10">
                <h2 className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
                    <HiOutlineDocumentText className="text-blue-600 text-3xl" />
                    <span className="border-b-2 border-blue-600 pb-1">My Resume</span>
                </h2>

                {/* Profile Header */}
                <div className="flex items-center gap-6 bg-blue-100 p-6 rounded-xl shadow-lg">

                    <div className={`w-24 h-24 rounded-full ${getColorFromName(name)} text-white flex items-center justify-center text-3xl font-bold border-2`}>
                        {name?.charAt(0).toUpperCase() || "?"}
                    </div>



                    {/* Name, Job Title & Description */}
                    <div className="flex-1">
                        {/* Name + Job Title */}

                        <h1 className="text-2xl font-bold text-gray-800 ">{name}</h1>
                        <h2 className="text-lg font-semibold text-blue-600">{jobTitle}</h2>
                        <div className="md:col-span-2 mt-2 border-l-4 border-indigo-400 pl-2">
                            <p className="text-gray-600 text-sm">{profileDescription}</p>
                        </div>


                        {/* Description */}

                    </div>
                </div>

                <hr />

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-800">

                    {/* Phone */}
                    <div className="flex items-center gap-2">
                        <FiPhone className="text-teal-600" />
                        <strong>Phone:</strong> {phone}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2">
                        <FiMail className="text-blue-600" />
                        <strong>Email:</strong> {email}
                    </div>

                    {/* Age */}
                    <div className="flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        <strong>Age:</strong> {age}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                        <FiMapPin className="text-teal-600" />
                        <strong>Location:</strong> {city}, {country}
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2">
                        <FiHome className="text-blue-600" />
                        <strong>Address:</strong> {fullAddress}
                    </div>

                    {/* Current Salary */}
                    <div className="flex items-center gap-2">
                        <FiDollarSign className="text-teal-600" />
                        <strong>Current Salary:</strong> {currentSalary}
                    </div>

                    {/* Expected Salary */}
                    <div className="flex items-center gap-2">
                        <FiDollarSign className="text-blue-600" />
                        <strong>Expected Salary:</strong> {expectedSalary}
                    </div>

                    {/* Education */}
                    <div className="flex items-center gap-2">
                        <FiBookOpen className="text-teal-600" />
                        <strong>Education:</strong> {education}
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-2">
                        <FiBriefcase className="text-blue-600" />
                        <strong>Experience:</strong> {yearsOfExp} years
                    </div>

                    {/* Profile Description */}


                </div>


                {/* Skills and Socials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-100 p-6 rounded-lg mt-8">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                        <div className="flex gap-2 flex-wrap">
                            {languages.map((lang, idx) => (
                                <span key={idx} className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">{lang}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Categories</h3>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat, idx) => (
                                <span key={idx} className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">{cat}</span>
                            ))}
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
                                <a href={socials.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:underline">
                                    <FiGithub className="text-xl" /> Github
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Education, Experience, Awards */}
                <SectionTimeline
                    title="Education"
                    items={candidateInfo.educationHistory}
                    type="education"
                    fetchData={fetchProfile}
                />
                <hr />
                <SectionTimeline
                    title="Experience"
                    items={candidateInfo.workExperience}
                    type="experience"
                    fetchData={fetchProfile}
                />
                <hr />
                <SectionTimeline
                    title="Awards"
                    items={candidateInfo.awards}
                    type="awards"
                    fetchData={fetchProfile}
                />

            </div>

        </div>
    );
};

export default Myresume;
