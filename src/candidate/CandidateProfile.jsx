import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import {
  FiMail, FiPhone, FiUser, FiMapPin, FiBook, FiBriefcase, FiDollarSign,
  FiGlobe, FiLinkedin, FiFacebook, FiTwitter, FiLink, FiSave
} from 'react-icons/fi';

const defaultProfileImage = 'https://www.w3schools.com/howto/img_avatar.png';

const CandidateProfile = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/get-profile');
        setForm({ ...res.data.profile });
      } catch (err) {
        setMessage('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await apiClient.put('/edit-profile', form);
      setMessage('Profile saved successfully!');
    } catch (err) {
      setMessage('Failed to save profile.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!form) return <p className="text-center text-red-600">{message || 'No profile data found.'}</p>;

  const renderInput = (label, name, icon, isLink = false) => (
    <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg shadow-sm">
      <div className="text-indigo-600 mt-1">{icon}</div>
      <div className="w-full">
        <p className="text-sm text-gray-600">{label}</p>
        <input
          type="text"
          name={name}
          value={form[name] || ''}
          onChange={handleChange}
          className="w-full mt-1 input bg-white text-gray-800"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-5">
      <div className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-xl space-y-8">
        <div className="flex items-center gap-6">
          <img
            src={form.profileImageURL || defaultProfileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border shadow"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{form.name || 'Candidate Name'}</h2>
            <p className="text-sm text-gray-500">{form.jobTitle}</p>
          </div>
        </div>

        {message && <p className="text-center text-green-600">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Email', 'email', <FiMail />)}
          {renderInput('Phone', 'phone', <FiPhone />)}
          {renderInput('Age', 'age', <FiUser />)}
          {renderInput('City', 'city', <FiMapPin />)}
          {renderInput('Country', 'country', <FiMapPin />)}
          {renderInput('Full Address', 'fullAddress', <FiMapPin />)}
          {renderInput('Profile Description', 'profileDescription', <FiBook />)}
          {renderInput('Job Title', 'jobTitle', <FiBriefcase />)}
          {renderInput('Education', 'education', <FiBook />)}
          {renderInput('Years of Experience', 'yearsOfExp', <FiBriefcase />)}
          {renderInput('Current Salary', 'currentSalary', <FiDollarSign />)}
          {renderInput('Expected Salary', 'expectedSalary', <FiDollarSign />)}
          {renderInput('Website', 'website', <FiLink />)}
          {renderInput('LinkedIn', 'linkedin', <FiLinkedin className="text-blue-600" />)}
          {renderInput('Facebook', 'facebook', <FiFacebook className="text-blue-700" />)}
          {renderInput('Twitter', 'twitter', <FiTwitter className="text-sky-400" />)}
          {renderInput('Google+', 'googleplus', <FiGlobe className="text-red-500" />)}
        </div>

        {/* Languages and Categories as tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Languages</p>
            <input
              type="text"
              name="languages"
              value={form.languages?.join(', ') || ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  languages: e.target.value.split(',').map((lang) => lang.trim()),
                }))
              }
              className="input bg-indigo-50 w-full"
              placeholder="e.g. English, Tamil"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <input
              type="text"
              name="categories"
              value={form.categories?.join(', ') || ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  categories: e.target.value.split(',').map((cat) => cat.trim()),
                }))
              }
              className="input bg-indigo-50 w-full"
              placeholder="e.g. Retail, Banking"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg shadow hover:from-teal-600 hover:to-indigo-700 transition"
          >
            <FiSave />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
