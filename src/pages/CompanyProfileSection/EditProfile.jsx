// your existing imports
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import {
  FiMail, FiPhone, FiGlobe, FiMapPin, FiBriefcase, FiCalendar,
  FiSave, FiFacebook, FiLinkedin, FiTwitter, FiUser, FiEdit3, FiImage,
  FiLink
} from 'react-icons/fi';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// options
const teamSizeOptions = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-100', label: '51-100' },
  { value: '101-500', label: '101-500' },
  { value: '501-1000', label: '501-1000' },
  { value: '1000+', label: '1000+' },
];

const industryOptions = [
  { value: 'Software', label: 'Software' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Education', label: 'Education' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Other', label: 'Other' },
];

const categoryOptions = [
  { value: 'Banking', label: 'Banking' },
  { value: 'Digital & Creative', label: 'Digital & Creative' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Management', label: 'Management' },
];

const EditCompanyProfile = () => {
  const [form, setForm] = useState({});
  const [socials, setSocials] = useState({});
  const [loading, setLoading] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(true);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/company/info');
      const data = res.data.companyInfo;

      if (data) {
        setForm(data);
        setSocials(data.socials || {});
        setIsNewProfile(false); // Existing profile
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.info("✅ No profile found. Ready to create a new one.");
        setIsNewProfile(true);
        setForm({}); // Start fresh
        setSocials({});
      } else {
        console.error("❌ Error fetching company profile:", err);
        setError('Failed to fetch company profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socials.')) {
      const key = name.split('.')[1];
      setSocials((prev) => ({ ...prev, [key]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const updated = { ...form, socials };
      if (isNewProfile) {
        await apiClient.post('/company/info', updated);
        toast.success('Company profile created successfully!');
        setIsNewProfile(false);
      } else {
        await apiClient.put('/company/info', updated);
        toast.success('Company profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to save profile');
    }
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    const name = e.target.name;
    formData.append(name, e.target.files[0]);

    try {
      await apiClient.patch('/company/info/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed');
    }
  };

 const renderInput = (label, name, icon, value, type = 'text', disabled = false) => (
  <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
    <div className="text-indigo-500 mt-1">{icon}</div>
    <div className="w-full">
      <p className="text-sm text-gray-600">{label}</p>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full mt-1 input bg-white text-gray-800 ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      />
    </div>
  </div>
);


  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-5">
      <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-xl space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={form.companyLogo || 'https://www.w3schools.com/howto/img_avatar.png'}
              alt="Company Logo"
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{form.name || 'Company Name'}</h2>
              <p className="text-sm text-gray-500">{form.email}</p>
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

        {/* Upload Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold">
              <FiImage className="text-xl" />
              Upload Company Logo
            </div>
            <input type="file" name="companyLogo" onChange={handleImageUpload} />
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold">
              <FiImage className="text-xl" />
              Upload Cover Image
            </div>
            <input type="file" name="coverImage" onChange={handleImageUpload} />
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            {renderInput('Company Name', 'name', <FiUser />, form.name)}
            <p className="text-xs text-indigo-500 italic ml-10">This information is visible publicly.</p>
          </div>
          <div className="flex flex-col gap-1">
           {renderInput('Email', 'email', <FiMail />, form.email, 'text', true)}
          </div>

          {renderInput('Phone', 'phone', <FiPhone />, form.phone)}
          {renderInput('Website', 'website', <FiGlobe />, form.website)}
          {renderInput('Location', 'location', <FiMapPin />, form.location)}
          {renderInput('About Company', 'about', <FiEdit3 />, form.about)}

          <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
            <div className="text-indigo-500 mt-1"><FiCalendar /></div>
            <div className="w-full">
              <p className="text-sm text-gray-600">Company Since</p>
              <input
                type="date"
                name="since"
                value={form.since?.substring(0, 10) || ''}
                onChange={handleChange}
                className="w-full mt-1 input bg-white text-gray-800"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
            <div className="text-indigo-500 mt-1"><FiBriefcase /></div>
            <div className="w-full">
              <p className="text-sm text-gray-600">Primary Industry</p>
              <Select
                name="primaryIndustry"
                options={industryOptions}
                value={industryOptions.find(opt => opt.value === form.primaryIndustry)}
                onChange={(selected) => setForm((prev) => ({ ...prev, primaryIndustry: selected.value }))}
              />
            </div>
          </div>

          {/* Team Size & Categories */}
          <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
            <div className="text-indigo-500 mt-1"><FiUser /></div>
            <div className="w-full">
              <p className="text-sm text-gray-600">Team Size</p>
              <Select
                name="teamSize"
                options={teamSizeOptions}
                value={teamSizeOptions.find(opt => opt.value === form.teamSize)}
                onChange={(selected) => setForm((prev) => ({ ...prev, teamSize: selected.value }))}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
            <div className="text-indigo-500 mt-1"><FiBriefcase /></div>
            <div className="w-full">
              <p className="text-sm text-gray-600">Categories</p>
              <Select
                isMulti
                options={categoryOptions}
                value={(form.categories || []).map(cat => ({ value: cat, label: cat }))}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    categories: selected.map(opt => opt.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('Facebook', 'socials.facebook', <FiFacebook />, socials.facebook)}
              {renderInput('LinkedIn', 'socials.linkedIn', <FiLinkedin />, socials.linkedIn)}
              {renderInput('Twitter', 'socials.twitter', <FiTwitter />, socials.twitter)}
             {renderInput('Google Plus', 'socials.googlePlus', <FiLink />, socials.googlePlus)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyProfile;
