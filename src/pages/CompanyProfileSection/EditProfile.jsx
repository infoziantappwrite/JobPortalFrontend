import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import {
  FiMail, FiPhone, FiGlobe, FiMapPin, FiBriefcase, FiCalendar,
  FiSave, FiFacebook, FiLinkedin, FiTwitter, FiUser, FiImage, FiEdit3
} from 'react-icons/fi';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          setIsNewProfile(false); // Means update existing profile
        }

      } catch (err) {
        toast.error('Error loading company profile');
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
      await apiClient.post('/company/info', updated); // create
      toast.success('Company profile created successfully!');
      setIsNewProfile(false); // Switch to update mode
    } else {
      await apiClient.put('/company/info', updated); // update
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

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  const renderInput = (label, name, icon, value, type = 'text') => (
    <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
      <div className="text-indigo-500 mt-1">{icon}</div>
      <div className="w-full">
        <p className="text-sm text-gray-600">{label}</p>
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          className="w-full mt-1 input bg-white text-gray-800"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-5">
      <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-xl space-y-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Company Name', 'name', <FiUser />, form.name)}
          {renderInput('Email', 'email', <FiMail />, form.email)}
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

          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Categories</p>
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

          {/* Social Links */}
          {renderInput('Facebook', 'socials.facebook', <FiFacebook />, socials.facebook)}
          {renderInput('LinkedIn', 'socials.linkedIn', <FiLinkedin />, socials.linkedIn)}
          {renderInput('Twitter', 'socials.twitter', <FiTwitter />, socials.twitter)}

          {/* Uploads */}
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Company Logo</p>
            <input type="file" name="companyLogo" onChange={handleImageUpload} className="mb-4" />
            <p className="text-sm text-gray-600">Cover Image</p>
            <input type="file" name="coverImage" onChange={handleImageUpload} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyProfile;
