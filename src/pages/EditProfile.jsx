import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const yearsOfExpOptions = [
  '0-1', '1-2', '2-3', '3-4', '4-5', '5+',
];

const categoriesOptions = [
  'Banking',
  'Digital & Creative',
  'Retail',
  'Human Resources',
  'Management',
];

const EditProfile = () => {
  const [formData, setFormData] = useState({
    profileImageURL: '',
    fullName: '',
    email: '',
    profileDescription: '',
    phone: '',
    age: 18,
    country: '',
    city: '',
    fullAddress: '',
    jobTitle: '',
    currentSalary: '0-1K',
    expectedSalary: '0-1K',
    education: '',
    yearsOfExp: '0-1',
    languages: [],
    categories: [],
    allowProfileListing: true,
    socials: {
      linkedin: '',
      facebook: '',
      twitter: '',
      googleplus: '',
    },
    website: '',
  });

  const [categoriesInput, setCategoriesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/get-profile');
        const { user, profile } = res.data;

        setFormData((prev) => ({
          ...prev,
          profileImageURL: profile.profileImageURL || '',
          fullName: profile.name || user.fullName || '',
          email: user.email || '',
          profileDescription: profile.profileDescription || '',
          phone: profile.phone || '',
          age: profile.age || 18,
          country: profile.country || '',
          city: profile.city || '',
          fullAddress: profile.fullAddress || '',
          jobTitle: profile.jobTitle || '',
          currentSalary: profile.currentSalary || '0-1K',
          expectedSalary: profile.expectedSalary || '0-1K',
          education: profile.education || '',
          yearsOfExp: profile.yearsOfExp || '0-1',
          languages: profile.languages || [],
          categories: profile.categories || [],
          allowProfileListing: profile.allowProfileListing ?? true,
          socials: {
            linkedin: profile.socials?.linkedin || '',
            facebook: profile.socials?.facebook || '',
            twitter: profile.socials?.twitter || '',
            googleplus: profile.socials?.googleplus || '',
          },
          website: profile.website || '',
        }));

        setCategoriesInput((profile.categories || []).join(', '));
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Failed to load profile data.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.socials) {
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [name]: value,
        },
      }));
    } else if (name === 'allowProfileListing') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'languages') {
      setFormData((prev) => ({
        ...prev,
        languages: value.split(',').map(lang => lang.trim()),
      }));
    } else if (name === 'categories') {
      setCategoriesInput(value);
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const rawCategories = categoriesInput.split(',').map(cat => cat.trim());
    const validCategories = rawCategories.filter(cat =>
      categoriesOptions.includes(cat)
    );

    if (rawCategories.length !== validCategories.length) {
      setError(
        `Invalid categories found. Allowed: ${categoriesOptions.join(', ')}`
      );
      setLoading(false);
      return;
    }

    const payload = {
      profileImageURL: formData.profileImageURL,
      name: formData.fullName,
      phone: formData.phone,
      profileDescription: formData.profileDescription,
      age: formData.age,
      country: formData.country,
      city: formData.city,
      fullAddress: formData.fullAddress,
      jobTitle: formData.jobTitle,
      currentSalary: formData.currentSalary,
      expectedSalary: formData.expectedSalary,
      education: formData.education,
      yearsOfExp: formData.yearsOfExp,
      languages: formData.languages,
      categories: validCategories,
      allowProfileListing: formData.allowProfileListing,
      socials: formData.socials,
      website: formData.website,
    };

    try {
      const res = await apiClient.put('/edit-profile', payload);
      setSuccess(res.data.message || 'Profile updated successfully!');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-50 flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-xl space-y-10"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Edit Profile</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Update your personal and professional information ✨
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-center font-semibold">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center font-semibold">{success}</p>
        )}

        {/* Profile Info Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="url"
              name="profileImageURL"
              value={formData.profileImageURL}
              onChange={handleChange}
              placeholder="Profile Image URL"
              className="input bg-indigo-50"
            />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name *"
              required
              className="input bg-indigo-50"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              placeholder="Email"
              className="input bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="input bg-indigo-50"
            />
            <textarea
              name="profileDescription"
              value={formData.profileDescription}
              onChange={handleChange}
              placeholder="Profile Description"
              className="input bg-indigo-50 h-32 resize-none md:col-span-2"
            />
            <input
              type="number"
              name="age"
              min="18"
              max="65"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="input bg-indigo-50"
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="input bg-indigo-50"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="input bg-indigo-50"
            />
            <input
              type="text"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder="Full Address"
              className="input bg-indigo-50 md:col-span-2"
            />
          </div>
        </div>

        {/* Professional Info Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Job Title"
              className="input bg-indigo-50"
            />
            <input
              type="text"
              name="currentSalary"
              value={formData.currentSalary}
              onChange={handleChange}
              placeholder="Current Salary"
              className="input bg-indigo-50"
            />
            <input
              type="text"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              placeholder="Expected Salary"
              className="input bg-indigo-50"
            />
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Education"
              className="input bg-indigo-50 md:col-span-2"
            />
            <select
              name="yearsOfExp"
              value={formData.yearsOfExp}
              onChange={handleChange}
              className="input bg-indigo-50"
            >
              {yearsOfExpOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="text"
              name="languages"
              value={formData.languages.join(', ')}
              onChange={handleChange}
              placeholder="Languages (comma separated)"
              className="input bg-indigo-50"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
          <input
            type="text"
            name="categories"
            value={categoriesInput}
            onChange={handleChange}
            placeholder={`Categories (comma separated, allowed: ${categoriesOptions.join(', ')})`}
            className="input bg-indigo-50"
          />
        </div>

        {/* Profile Listing Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="allowProfileListing"
            checked={formData.allowProfileListing}
            onChange={handleChange}
            id="allowProfileListing"
            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <label htmlFor="allowProfileListing" className="text-gray-700 font-semibold">
            Allow my profile to be listed
          </label>
        </div>

        {/* Social Links Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="url"
              name="linkedin"
              value={formData.socials.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              className="input bg-indigo-50"
            />
            <input
              type="url"
              name="facebook"
              value={formData.socials.facebook}
              onChange={handleChange}
              placeholder="Facebook URL"
              className="input bg-indigo-50"
            />
            <input
              type="url"
              name="twitter"
              value={formData.socials.twitter}
              onChange={handleChange}
              placeholder="Twitter URL"
              className="input bg-indigo-50"
            />
            <input
              type="url"
              name="googleplus"
              value={formData.socials.googleplus}
              onChange={handleChange}
              placeholder="Google Plus URL"
              className="input bg-indigo-50"
            />
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website URL"
              className="input bg-indigo-50 md:col-span-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-700 hover:bg-indigo-900 text-white font-bold py-3 rounded-full w-full transition-colors duration-300"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
