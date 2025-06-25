import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { X, AlertTriangle } from 'lucide-react';
import InternalLoader from '../components/InternalLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../contexts/UserContext';
import { HiOutlineDocumentText } from 'react-icons/hi';
import {
  FiPhone, FiMapPin, FiHome, FiBriefcase, FiBookOpen,
  FiDollarSign, FiGlobe, FiLinkedin, FiTwitter,
  FiFacebook, FiInstagram, FiUser, FiGithub, FiMail
} from 'react-icons/fi';
import SectionTimeline from '../candidate/jobs/SectionTimeline';

const ApplicantDetailView = () => {
  const { jobID, applicationID } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user?.userType?.toLowerCase();

  const [application, setApplication] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);

  const [applicationLoading, setApplicationLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      setApplicationLoading(true);
      setError('');
      try {
        const res = await apiClient.post(
          `/${role}/job/get-detail`,
          { IDs: [applicationID], jobID, type: 'jobApplication' },
          { withCredentials: true }
        );
        const app = res.data.jobApplications?.[0] || null;
        if (!app) throw new Error('Application details not found');
        setApplication(app);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setApplicationLoading(false);
      }
    };
    if (jobID && applicationID) fetchApp();
  }, [jobID, applicationID, role]);

  useEffect(() => {
    const fetchProfile = async (candidateID) => {
      setProfileLoading(true);
      setError('');
      try {
        const res = await apiClient.get(`/employee/job/applicant/get-profile/${candidateID}`);
        const info = res.data.candidateInfo;
        if (!info) throw new Error('Candidate info not found');
        setCandidateInfo(info);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setProfileLoading(false);
      }
    };

    if (application?.userID?._id) {
      fetchProfile(application.userID._id);
    }
  }, [application]);

  if (applicationLoading || profileLoading) {
    return <InternalLoader text="Loading Applicant Details" />;
  }

  if (error || !application || !candidateInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded shadow text-center max-w-md">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  const {
    name, profileDescription, email, phone, age,
    country, city, fullAddress, jobTitle,
    currentSalary, expectedSalary, education,
    yearsOfExp, languages = [], categories = [],
    socials = {}, educationHistory = [], workExperience = [], awards = []
  } = candidateInfo;

  const { status, resumeURL } = application;

  const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];
  const getColor = (n) => (n ? colors[n.charCodeAt(0) % colors.length] : 'bg-gray-500');

  const SocialLink = ({ href, icon: Icon, label, color }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${color} flex items-center gap-2 hover:underline`}>
      <Icon className="text-lg" /> {label}
    </a>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow space-y-10">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
          <X size={24} />
        </button>

        {/* Resume UI Section */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="flex justify-center items-center gap-2 text-3xl font-bold text-blue-700">
              <HiOutlineDocumentText className="text-blue-600 text-4xl" />
              Candidate Profile
            </h2>
            <div className="h-1 w-24 mx-auto bg-blue-600 mt-2 rounded-full" />
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className={`w-24 h-24 rounded-full ${getColor(name)} text-white flex items-center justify-center text-3xl font-bold border-4 border-white`}>
              {name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{name}</h1>
              <h2 className="text-lg text-blue-600 font-medium">{jobTitle}</h2>
              <p className="text-sm text-gray-600 border-l-4 border-indigo-500 pl-4 mt-2">{profileDescription}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { Icon: FiPhone, label: "Phone", value: phone },
              { Icon: FiMail, label: "Email", value: email },
              { Icon: FiUser, label: "Age", value: age },
              { Icon: FiMapPin, label: "Location", value: `${city}, ${country}` },
              { Icon: FiHome, label: "Address", value: fullAddress },
              { Icon: FiDollarSign, label: "Current Salary", value: currentSalary },
              { Icon: FiDollarSign, label: "Expected Salary", value: expectedSalary },
              { Icon: FiBookOpen, label: "Education", value: education },
              { Icon: FiBriefcase, label: "Experience", value: `${yearsOfExp} years` },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <item.Icon className="text-blue-600" />
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>

          {/* Languages & Categories */}
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
              {socials.github && <SocialLink href={socials.github} icon={FiGithub} label="GitHub" color="text-gray-600" />}
            </div>
          </div>

          {/* Timeline Sections */}
          <div className="space-y-10 bg-white p-6 rounded-xl shadow">
            <SectionTimeline title="Education" items={educationHistory} type="education" fetchData={() => {}} />
            <SectionTimeline title="Experience" items={workExperience} type="experience" fetchData={() => {}} />
            <SectionTimeline title="Awards" items={awards} type="awards" fetchData={() => {}} />
          </div>
        </div>

        {/* Resume PDF */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Resume PDF</h3>
          {resumeURL ? (
            <a href={resumeURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View/Download Resume
            </a>
          ) : (
            <p className="text-gray-500 italic">No resume available</p>
          )}
        </div>

        {/* Application Timeline */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">Application Timeline</h3>
          <ol className="relative border-l border-indigo-300 pl-4">
            {status && status.length ? status
              .filter(s => ['applied', 'shortlisted'].includes(s.stage))
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map(entry => (
                <li key={entry.stage + entry.createdAt} className="mb-6 relative pl-6">
                  <div className="absolute w-3 h-3 rounded-full left-0 top-2 transform -translate-x-1/2 bg-indigo-500 border border-white"></div>
                  <time className="block mb-1 text-sm text-gray-400">{new Date(entry.createdAt).toLocaleString()}</time>
                  <p className="text-base font-semibold text-indigo-700 capitalize">{entry.stage}</p>
                  {entry.remarks && <p className="text-sm text-gray-600 italic mt-1">Remarks: {entry.remarks}</p>}
                </li>
              ))
            : <p className="text-gray-500 italic">No timeline data.</p>}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailView;
