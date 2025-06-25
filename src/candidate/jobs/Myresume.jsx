/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  FiPhone, FiMapPin, FiHome, FiBriefcase, FiBookOpen, FiDollarSign,
  FiGlobe, FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiUser,
  FiGithub, FiMail
} from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import SectionTimeline from './SectionTimeline';
import apiClient from '../../api/apiClient';
import InternalLoader from '../../components/InternalLoader';
import { AlertTriangle } from "lucide-react";
import CVManager from './CVManager';
import { fetchCurrentUser } from '../../api/fetchuser';

const Myresume = () => {
const [candidateInfo, setCandidateInfo] = useState(null);
const [error, setError] = useState('');

  const fetchProfile = async (userId) => {
    try {
      const res = await apiClient.get('/candidate/info/get-profile');
      setCandidateInfo(res.data.candidateInfo);
      setError('');
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
      setError('Something went wrong while loading your Page.');
    }
  };


  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user && user.id) {
          await fetchProfile(user.id);
        } else {
          setError('User ID not found');
        }
      } catch (err) {
        console.error('Error loading user/profile:', err);
        setError('Failed to load user data.');
      }
    };

    loadData();
  }, []);


  const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];
  const getColorFromName = (name) => name ? colors[name.charCodeAt(0) % colors.length] : 'bg-gray-500';

  if (!candidateInfo) {
  return <InternalLoader text="Loading Resume" />
}
if (error) {
    return (
     
        <EmptyState
          icon={AlertTriangle}
          title="Oops! Something Went Wrong"
          message={error}
        />
    );
  }


  const {
    name, profileDescription, email, phone, age, country, city, fullAddress,
    jobTitle, currentSalary, expectedSalary, education, yearsOfExp,
    languages, categories, socials
  } = candidateInfo;

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6 sm:p-6 ">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="flex justify-center items-center gap-2 text-3xl font-bold text-blue-700">
            <HiOutlineDocumentText className="text-blue-600 text-4xl" />
            My Resume
          </h2>
          <div className="h-1 w-24 mx-auto bg-blue-600 mt-2 rounded-full" />
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className={`w-24 h-24 rounded-full ${getColorFromName(name)} text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md`}>
            {name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
            <h2 className="text-lg text-blue-600 font-medium">{jobTitle}</h2>
            <p className="text-sm text-gray-600 border-l-4 border-indigo-500 pl-4 mt-2">{profileDescription}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          {[
            { icon: FiPhone, label: "Phone", value: phone },
            { icon: FiMail, label: "Email", value: email },
            { icon: FiUser, label: "Age", value: age },
            { icon: FiMapPin, label: "Location", value: `${city}, ${country}` },
            { icon: FiHome, label: "Address", value: fullAddress },
            { icon: FiDollarSign, label: "Current Salary", value: currentSalary },
            { icon: FiDollarSign, label: "Expected Salary", value: expectedSalary },
            { icon: FiBookOpen, label: "Education", value: education },
            { icon: FiBriefcase, label: "Experience", value: `${yearsOfExp} years` },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <item.icon className="text-blue-600" />
              <strong>{item.label}:</strong> {item.value}
            </div>
          ))}
        </div>

        {/* Skills & Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{lang}</span>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Social Links</h3>
          <div className="flex flex-wrap gap-4">
            {socials.linkedin && <SocialLink href={socials.linkedin} icon={FiLinkedin} label="LinkedIn" color="text-blue-700" />}
            {socials.twitter && <SocialLink href={socials.twitter} icon={FiTwitter} label="Twitter" color="text-sky-500" />}
            {socials.facebook && <SocialLink href={socials.facebook} icon={FiFacebook} label="Facebook" color="text-blue-600" />}
            {socials.instagram && <SocialLink href={socials.instagram} icon={FiInstagram} label="Instagram" color="text-pink-500" />}
            {socials.website && <SocialLink href={socials.website} icon={FiGlobe} label="Website" color="text-teal-600" />}
            {socials.github && <SocialLink href={socials.github} icon={FiGithub} label="Github" color="text-gray-600" />}
          </div>
        </div>

        {/* Timeline Sections */}
        <div className="space-y-10 bg-white p-6 rounded-xl shadow">
          <SectionTimeline title="Education" items={candidateInfo.educationHistory} type="education" fetchData={fetchProfile} />
          <SectionTimeline title="Experience" items={candidateInfo.workExperience} type="experience" fetchData={fetchProfile} />
          <SectionTimeline title="Awards" items={candidateInfo.awards} type="awards" fetchData={fetchProfile} />
        </div>
        <CVManager/>
      </div>
    </div>
  );
};

// Reusable social link component
const SocialLink = ({ href, icon: Icon, label, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-2 ${color} hover:underline text-sm sm:text-base`}
  >
    <Icon className="text-lg" /> {label}
  </a>
);

export default Myresume;
