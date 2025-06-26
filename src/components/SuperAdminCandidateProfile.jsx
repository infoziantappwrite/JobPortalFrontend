import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import InternalLoader from '../components/InternalLoader';
import { AlertTriangle, X } from "lucide-react";
import EmptyState from '../components/EmptyState';
import {
  FiPhone, FiMapPin, FiHome, FiBriefcase, FiBookOpen, FiDollarSign,
  FiGlobe, FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiUser,
  FiGithub, FiMail
} from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import SectionTimeline from '../candidate/jobs/SectionTimeline';

const CandidateProfile = () => {
  const { candidateID, jobID } = useParams();
  const navigate = useNavigate();

  const [candidateInfo, setCandidateInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('Candidate ID:', candidateID); // ✅ Corrected here

  // Fetch candidate profile by ID
  const fetchProfile = useCallback(async (id) => {
    if (!id) {
      setError('Candidate ID is missing');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(`superadmin/candidate/${id}`, {
        withCredentials: true,
      });
      const info = res.data.candidateInfo;
      if (!info) throw new Error('Candidate info not found');
      setCandidateInfo(info);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setCandidateInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setError('');
      setCandidateInfo(null);
      setLoading(true);
      try {
        if (!candidateID) throw new Error('Candidate ID not provided');
        await fetchProfile(candidateID);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [candidateID, fetchProfile]);

  const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];
  const getColorFromName = (name) => name ? colors[name.charCodeAt(0) % colors.length] : 'bg-gray-500';

  if (loading) {
    return <InternalLoader text="Loading Full Profile" />;
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

  if (!candidateInfo) return null;

  const {
    name, profileDescription, email, phone, age, country, city, fullAddress,
    jobTitle, currentSalary, expectedSalary, education, yearsOfExp,
    languages = [], categories = [], socials = {},
    educationHistory = [], workExperience = [], awards = []
  } = candidateInfo;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black mb-4"
          aria-label="Go Back"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center">
          <h2 className="flex justify-center items-center gap-2 text-3xl font-bold text-blue-700">
            <HiOutlineDocumentText className="text-blue-600 text-4xl" />
            Applicant Profile
          </h2>
          <div className="h-1 w-24 mx-auto bg-blue-600 mt-2 rounded-full" />
        </div>

        {/* Profile Summary */}
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
          <SectionTimeline title="Education" items={educationHistory} type="education" fetchData={() => fetchProfile(candidateID)} />
          <SectionTimeline title="Experience" items={workExperience} type="experience" fetchData={() => fetchProfile(candidateID)} />
          <SectionTimeline title="Awards" items={awards} type="awards" fetchData={() => fetchProfile(candidateID)} />
        </div>
      </div>
    </div>
  );
};

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

export default CandidateProfile;
