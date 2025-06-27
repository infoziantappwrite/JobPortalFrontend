import { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { FiFileText, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const labelMap = {
  specialisms: 'Skills (Comma separated)',
  keyResponsibilities: 'Key Responsibilities (Comma separated)',
  description: 'Job Description',
};

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: 'Remote',
    jobType: 'Full-time',
    emailAddress: '',
    username: '',
    specialisms: '',
    keyResponsibilities: '',
    offeredSalary: '',
    careerLevel: '',
    experience: '',
    gender: '',
    industry: '',
    qualification: '',
    applicationDeadline: '',
    country: '',
    city: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'title',
      'description',
      'company',
      'emailAddress',
      'jobType',
      'specialisms',
      'keyResponsibilities',
      'careerLevel',
      'experience',
      'gender',
      'industry',
      'qualification',
      'applicationDeadline',
      'country',
      'city',
      'address',
    ];

    for (let field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        const prettyField = labelMap[field] || field.replace(/([A-Z])/g, ' $1').toLowerCase();
        toast.error(`Please fill the ${prettyField} field.`);
        return;
      }
    }

    try {
      await apiClient.post('/employee/job/postjob', {
        ...form,
        specialisms: form.specialisms.split(',').map((s) => s.trim()),
        keyResponsibilities: form.keyResponsibilities.split(',').map((k) => k.trim()),
      });

      toast.success('Job posted successfully!');
      setForm({
        title: '',
        description: '',
        company: '',
        location: 'Remote',
        jobType: 'Full-time',
        emailAddress: '',
        username: '',
        specialisms: '',
        keyResponsibilities: '',
        offeredSalary: '',
        careerLevel: '',
        experience: '',
        gender: '',
        industry: '',
        qualification: '',
        applicationDeadline: '',
        country: '',
        city: '',
        address: '',
      });
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.error || 'Failed to post job');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-xl space-y-10"
      >
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Post a New Job!</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Kindly provide detailed job info ✨</p>

          <div className="flex justify-center gap-10">
            {[
              { icon: <FiFileText size={20} />, label: 'Job Detail' },
              { icon: <FiCreditCard size={20} />, label: 'Package & Payments' },
              { icon: <FiCheckCircle size={20} />, label: 'Confirmation' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow">
                  {step.icon}
                </div>
                <span className="text-sm mt-2 font-medium text-gray-600">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        {[
          {
            title: 'Job Details',
            fields: ['title', 'specialisms', 'keyResponsibilities', 'description'],
          },
          {
            title: 'Company Information',
            fields: ['company', 'emailAddress', 'username'],
          },
          {
            title: 'Salary & Experience',
            fields: ['offeredSalary', 'careerLevel', 'experience', 'jobType'],
          },
          {
            title: 'Requirements',
            fields: ['gender', 'industry', 'qualification', 'applicationDeadline'],
          },
          {
            title: 'Job Location',
            fields: ['country', 'city', 'address', 'location'],
          },
        ].map((section, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">{section.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => {
                const isTextarea = field === 'description';
                const isSelect = [
                  'gender',
                  'location',
                  'jobType',
                  'careerLevel',
                  'qualification',
                  'industry',
                  'experience',
                  'offeredSalary',
                ].includes(field);
                const isDate = field === 'applicationDeadline';

                const label =
                  labelMap[field] ||
                  field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

                return isSelect ? (
                  <select
                    key={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="input bg-indigo-50"
                  >
                    <option value="">{label}</option>

                    {field === 'gender' &&
                      ['Any', 'Male', 'Female', 'Other'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {field === 'location' &&
                      ['Remote', 'In-person', 'Hybrid'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {field === 'jobType' &&
                      ['Full-time', 'Part-time', 'Contract', 'Internship'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {field === 'careerLevel' &&
                      [
                        'Entry Level',
                        'Mid-Level (Experienced)',
                        'Senior-Level',
                        'Manager',
                        'Executive (C-Level)',
                      ].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {field === 'qualification' &&
                      [
                        'Bachelor’s Degree',
                        'Master’s Degree',
                        'Doctorate (Ph.D.)',
                        'Professional Certification',
                        'Associate Degree',
                      ].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {field === 'industry' &&
                      [
                        'Information Technology',
                        'Healthcare',
                        'Finance/Banking',
                        'Education',
                        'Manufacturing',
                        'Retail',
                        'Telecommunications',
                        'Construction',
                        'Energy',
                        'Transportation/Logistics',
                      ].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {field === 'experience' &&
                      ['0-1 Years', '1-2 Years', '5-10 Years', '10+ Years'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {field === 'offeredSalary' &&
                      ['<30k', '30-40k', '40-50k', '50-70k', '70k+'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                ) : isTextarea ? (
                  <div className="md:col-span-2" key={field}>
                    <textarea
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={label}
                      className="input h-32 resize-none w-full bg-indigo-50"
                    />
                  </div>
                ) : (
                  <input
                    key={field}
                    name={field}
                    type={isDate ? 'date' : 'text'}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={label}
                    className="input bg-indigo-50"
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="py-3 px-6 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-indigo-700 transition duration-300"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
