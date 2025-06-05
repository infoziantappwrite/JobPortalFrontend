import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../api/apiClient';

const yearsOfExpOptions = [' ', '0-1', '2-3', '4-5', '6-10', '10+'];

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { state } = useLocation();
  const job = state?.job || {};
  const user = state?.user || {};

  // Initialize state with all required fields (except resumeURL, backend handles it)
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    profileDescription: '',
    phone: '',
    age: '',
    country: '',
    city: '',
    fullAddress: '',
    currentSalary: '',
    expectedSalary: '',
    education: '',
    yearsOfExp: '',
    languages: '',
    educationInstitution: '',
    degree: '',
    dept: '',
    eduStartYear: '',
    eduEndYear: '',
    companyName: '',
    designation: '',
    workStartYear: '',
    workEndYear: '',
    skills: '',
    messageToHR: '',
  });

  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      e.target.value = null;
      setResumeFile(null);
    } else {
      setResumeFile(file);
    }
  };

  // Helper to convert empty strings to undefined, else number
  const normalizeNumber = (value) => (value === '' ? undefined : Number(value));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert('Please upload your resume in PDF format.');
      return;
    }

    // Validate yearsOfExp is selected
    if (!yearsOfExpOptions.includes(form.yearsOfExp) || form.yearsOfExp === '') {
      alert('Please select your years of experience.');
      return;
    }

    try {
      const formData = new FormData();

      const normalizedData = {
        ...form,
        age: normalizeNumber(form.age),
        currentSalary: normalizeNumber(form.currentSalary),
        expectedSalary: normalizeNumber(form.expectedSalary),
        eduStartYear: normalizeNumber(form.eduStartYear),
        eduEndYear: normalizeNumber(form.eduEndYear),
        workStartYear: normalizeNumber(form.workStartYear),
        workEndYear: normalizeNumber(form.workEndYear),
        skills: form.skills.split(',').map((s) => s.trim()),
        languages: form.languages.split(',').map((l) => l.trim()),
        // resumeURL excluded — backend sets this from uploaded file
      };

      // Append all form fields to FormData
      Object.entries(normalizedData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Send arrays as JSON string
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, value);
        }
      });

      formData.append('resume', resumeFile);

      const res = await apiClient.post(`/jobs/${jobId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert(res.data.message || 'Application submitted!');
    } catch (err) {
      console.error('Application error:', err);
      if (err.response?.data?.error) {
        alert(JSON.stringify(err.response.data.error, null, 2));
      } else {
        alert('Failed to submit application');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Apply for: {job?.title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['fullName', 'Full Name'],
          ['email', 'Email', 'email'],
          ['profileDescription', 'Profile Description'],
          ['phone', 'Phone'],
          ['age', 'Age', 'number'],
          ['country', 'Country'],
          ['city', 'City'],
          ['fullAddress', 'Full Address'],
          ['currentSalary', 'Current Salary', 'number'],
          ['expectedSalary', 'Expected Salary', 'number'],
          ['education', 'Education'],
          ['educationInstitution', 'Institution'],
          ['degree', 'Degree'],
          ['dept', 'Department'],
          ['eduStartYear', 'Education Start Year', 'number'],
          ['eduEndYear', 'Education End Year', 'number'],
          ['companyName', 'Company Name'],
          ['designation', 'Designation'],
          ['workStartYear', 'Work Start Year', 'number'],
          ['workEndYear', 'Work End Year', 'number'],
          ['skills', 'Skills (comma-separated)'],
          ['languages', 'Languages (comma-separated)'],
          ['messageToHR', 'Message to HR'],
        ].map(([name, label, type = 'text']) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder={label}
              required
            />
          </div>
        ))}

        {/* yearsOfExp dropdown */}
        <div>
          <label className="block font-medium">Years of Experience</label>
          <select
            name="yearsOfExp"
            value={form.yearsOfExp}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            {yearsOfExpOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === '' ? 'Select years of experience' : opt}
              </option>
            ))}
          </select>
        </div>

        {/* Resume file input */}
        <div>
          <label className="block font-medium">Resume (PDF only)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
            required
          />
          {resumeFile && <p className="mt-1 text-sm text-green-600">{resumeFile.name}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
