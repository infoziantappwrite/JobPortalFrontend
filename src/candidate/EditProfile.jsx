/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import {
  FiMail, FiPhone, FiUser, FiMapPin, FiBook, FiBriefcase, FiDollarSign,
  FiGlobe, FiLinkedin, FiFacebook, FiTwitter, FiLink, FiSave, FiUserCheck, FiGithub, FiX
} from 'react-icons/fi';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectCategory from './SelectCategory';
import InternalLoader from '../components/InternalLoader';


const defaultProfileImage = 'https://www.w3schools.com/howto/img_avatar.png';

const EditProfile = () => {
  const [form, setForm] = useState({});
  const [socials, setSocials] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
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
        //console.log(res.data)
        const data = res.data;
        //console.log(data);
        const {workExperience,awards,educationHistory, _id, createdAt, updatedAt, __v, ...filteredCandidateInfo } = data.candidateInfo;

        setForm({
          ...filteredCandidateInfo,
          email: data.candidateInfo.email, // this line is optional if already in filteredCandidateInfo
        });

        setSocials(data.candidateInfo.socials || {});
      } catch (err) {
        setMessage('Error loading profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'languages') {
      setForm((prev) => ({ ...prev, languages: value }));
    } else if (name === 'categories') {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      setForm((prev) => ({ ...prev, categories: selected }));
    } else if (name.startsWith('socials.')) {
      const key = name.split('.')[1];
      setSocials((prev) => ({ ...prev, [key]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


 const handleSave = async () => {
  try {
    const { email, languages, ...formData } = form;

    const updated = {
      ...formData,
      languages:
        typeof languages === 'string'
          ? languages.split(',').map((lang) => lang.trim()).filter(Boolean)
          : Array.isArray(languages)
          ? languages
          : [],
      socials
    };

    console.log('Final payload sent to backend:', updated); // Debug log

    await apiClient.put('/candidate/info/edit-profile', updated);
    toast.success('Profile updated successfully!');
  } catch (err) {
    console.error('Error saving profile:', err?.response?.data || err.message); // 👈 LOG the backend's error
    toast.error('Failed to save profile.');
  }
};




 if (loading) return <InternalLoader text="Loading Profile" />;
  const renderInput = (label, name, icon, value, isLink = false, disabled = false) => (
    <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
      <div className="text-indigo-500 mt-1">{icon}</div>
      <div className="w-full">
        <p className="text-sm text-gray-600">{label}</p>
        {isLink && value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline break-words"
          >
            {value}
          </a>
        ) : (
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full mt-1 input bg-white text-gray-800 ${disabled ? 'cursor-not-allowed opacity-60' : ''
              }`}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-5">
      <div className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-xl space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
                className={`w-28 h-28 rounded-full ${getColorFromName(form.name)} text-white flex items-center justify-center text-3xl font-bold border shadow`}
              >
                {form.name?.charAt(0).toUpperCase() || "?"}
              </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{form.name || 'Candidate Name'}</h2>
              <p className="text-sm text-gray-500">{form.jobTitle}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg shadow hover:from-teal-600 hover:to-indigo-700 transition"
          >
            <FiSave />
            Save
          </button>
        </div>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Name', 'name', <FiPhone />, form.name)}
          {renderInput('Email', 'email', <FiMail />, form.email, false, true)}
          {renderInput('Phone', 'phone', <FiPhone />, form.phone)}
          {renderInput('Age', 'age', <FiUser />, form.age)}
          {renderInput('City', 'city', <FiMapPin />, form.city)}
          {renderInput('Country', 'country', <FiMapPin />, form.country)}
          {renderInput('Full Address', 'fullAddress', <FiMapPin />, form.fullAddress)}
          {renderInput('Profile Description', 'profileDescription', <FiBook />, form.profileDescription)}
          {renderInput('Job Title', 'jobTitle', <FiBriefcase />, form.jobTitle)}
          {renderInput('Education', 'education', <FiBook />, form.education)}
          {renderInput('Years of Experience', 'yearsOfExp', <FiBriefcase />, form.yearsOfExp)}
          {renderInput('Current Salary', 'currentSalary', <FiDollarSign />, form.currentSalary)}
          {renderInput('Expected Salary', 'expectedSalary', <FiDollarSign />, form.expectedSalary)}
          {renderInput('Website', 'socials.website', <FiLink />, socials.website)}
          {renderInput('LinkedIn', 'socials.linkedin', <FiLinkedin className="text-blue-600" />, socials.linkedin)}
          {renderInput('Facebook', 'socials.facebook', <FiFacebook className="text-blue-700" />, socials.facebook)}
          {renderInput('X', 'socials.twitter', <FiX className="text-sky-400" />, socials.twitter)}
          {renderInput('Github', 'socials.github', <FiGithub className="text-gray-500" />, socials.github)}
          {/* {renderInput('Profile Image', 'profileImageURL', <FiUserCheck className="text-green-500" />, form.profileImageURL)} */}
          {renderInput('Languages (comma-separated)', 'languages', <FiGlobe />, Array.isArray(form.languages) ? form.languages.join(', ') : form.languages)}

          <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
            <div className="text-indigo-500 mt-1"><FiBook /></div>
            <div className="w-full">
              <p className="text-sm text-gray-600">Categories</p>
              <SelectCategory form={form} setForm={setForm} />
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default EditProfile;
