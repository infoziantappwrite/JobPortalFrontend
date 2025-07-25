import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiMapPin, FiClock, FiBriefcase, FiUser,
  FiCalendar, FiBookmark
} from 'react-icons/fi';
import { Banknote } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ApplyButton from '../candidate/jobs/ApplyButton';
import apiClient from '../api/apiClient';
import InternalLoader from '../components/InternalLoader';

const JobDetails = () => {
  const location = useLocation();
  const { jobid, jobdetails: jobFromState } = location?.state || {};
  const { user } = useUser();

  const [jobdetails, setJobdetails] = useState(jobFromState || null);
  const [loading, setLoading] = useState(!jobFromState);

  useEffect(() => {
    const fetchJob = async () => {
      if (jobFromState) {
        setJobdetails(jobFromState);
        return;
      }

      if (!jobid) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get(`/employee/job/${jobid}`);
        setJobdetails(res.data.job);
      } catch (err) {
        console.error('Failed to fetch job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobFromState, jobid]);

  if (loading) {
    return (
      <InternalLoader text='Loading Job Details'/>
    );
  }

  if (!jobdetails) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Job details not found.
      </div>
    );
  }

  const {
    _id,
    title,
    location: jobLocation,
    jobType,
    company,
    offeredSalary,
    description,
    specialisms,
    keyResponsibilities,
    careerLevel,
    experience,
    gender,
    industry,
    qualification,
    applicationDeadline,
    country,
    city,
    applicants,
  } = jobdetails;

  const initial = title?.trim()?.charAt(0)?.toUpperCase() || 'J';

  return (
    <div className='p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen'>
      <div className="bg-blue-100 p-10 mx-auto shadow rounded-xl space-y-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
              {initial}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2 text-sm">
                <span className="flex items-center gap-1"><FiBriefcase /> {company}</span>
                <span className="flex items-center gap-1"><FiMapPin /> {jobLocation || 'Remote'}</span>
                <span className="flex items-center gap-1"><Banknote className="w-4 h-4" /> ₹{offeredSalary}</span>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-200 text-indigo-800">{jobType}</span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800">{careerLevel}</span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-200 text-orange-800">{experience}</span>
              </div>
            </div>
          </div>

          {/* Right - Apply Button only for candidates */}
          {user?.userType?.toLowerCase() === 'candidate' && (
            <ApplyButton jobId={_id} jobTitle={title} applications={applicants} />
          )}
        </div>
      </div>

      <div className="container mx-auto px-0 py-10 grid md:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8 bg-white p-8 rounded-lg shadow-lg">
          {/* Job Description */}
          <div>
            <h2 className="text-xl font-bold mb-2">Job Description</h2>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
{/* Key Responsibilities */}
{keyResponsibilities?.length > 0 && (
  <div className="px-4 my-4">
    <h2 className="text-xl font-bold mb-3 border-l-4 border-indigo-600 pl-3 text-gray-800">
      Key Responsibilities
    </h2>
    <ul className="space-y-2 ml-2 text-gray-700">
      {keyResponsibilities.map((item, i) => (
        <li
          key={i}
          className="relative pl-5 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-indigo-600 before:rounded-full"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
)}

{/* Skills Required */}
{specialisms?.length > 0 && (
  <div className="px-4 my-4">
    <h2 className="text-xl font-bold mb-3 text-gray-800 border-l-4 border-blue-600 pl-3">
      Skills Required
    </h2>
    <div className="flex flex-wrap gap-2">
      {specialisms.map((skill, i) => (
        <span
          key={i}
          className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm shadow hover:bg-blue-200 transition"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}

          
        </div>

        {/* Right Column */}
        <div className="bg-blue-100 rounded-2xl p-6 shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Job Overview</h3>
          <div className="space-y-4 text-gray-700 text-sm">
            {[
              { label: 'Expiration Date', value: new Date(applicationDeadline).toLocaleDateString(), icon: <FiCalendar /> },
              { label: 'Location', value: `${city}, ${country}`, icon: <FiMapPin /> },
              { label: 'Job Type', value: jobType, icon: <FiClock /> },
              { label: 'Salary', value: `₹${offeredSalary}`, icon: <Banknote className="w-4 h-4" /> },
              { label: 'Career Level', value: careerLevel, icon: <FiUser /> },
              { label: 'Experience', value: experience, icon: <FiBookmark /> },
              { label: 'Qualification', value: qualification, icon: <FiBookmark /> },
              { label: 'Industry', value: industry, icon: <FiBookmark /> },
              { label: 'Gender', value: gender, icon: <FiUser /> },
            ].map(({ label, value, icon }, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 text-blue-600">{icon}</div>
                <div>
                  <div className="font-medium">{label}:</div>
                  <div>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
