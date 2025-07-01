import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiUser,
  FiCalendar,
  FiBookmark,
} from 'react-icons/fi';
import { Banknote } from 'lucide-react';
import ApplyButton from '../candidate/jobs/ApplyButton';
import { useUser } from '../contexts/UserContext';

const Job = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobdetails, relatedJobs = [] } = location.state || {};
   const { user} = useUser();

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
  } = jobdetails;

  const initial = title?.trim()?.charAt(0)?.toUpperCase() || 'J';

  // When clicking on related job card
  const handleCardClick = (job) => {
   const formattedTitle = job.title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')   // Remove special characters like /, &, etc.
  .replace(/\s+/g, '-')           // Replace spaces with hyphens
  .trim();

    const newRelatedJobs = [jobdetails, ...relatedJobs].filter(
      (j) => j.company === job.company && j._id !== job._id
    );

    navigate(`/job/${formattedTitle}`, {
      state: {
        jobdetails: job,
        relatedJobs: newRelatedJobs,
      },
    });
  };

  return (
    <div className="">
      <div className="bg-white  w-full">
        <div className="bg-blue-100 px-10 py-16 mx-auto shadow-md space-y-10">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left */}
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                {initial}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FiBriefcase /> {company}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin /> {jobLocation || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Banknote className="w-4 h-4" /> ₹{offeredSalary}
                  </span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-200 text-indigo-800">
                    {jobType}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800">
                    {careerLevel}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-200 text-orange-800">
                    {experience}
                  </span>
                </div>
              </div>
            </div>
            {/* Right */}
        
       {!user ? (
  <button
    onClick={() => navigate('/login')}
    className="mt-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow transition"
  >
    Login to Apply
  </button>
) : user?.userType?.toLowerCase() === 'candidate' ? (
  <button
    onClick={() =>
      navigate(`/${user.userType.toLowerCase()}/jobdetails`, {
        state: { jobid:_id },
      })
    }
    className="mt-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow transition"
  >
    Apply for Job
  </button>
) : null}


            

          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 md:px-10 py-10 grid md:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="px-4 md:px-8">
              <h2 className="text-xl font-bold mb-2">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* Key Responsibilities */}
{keyResponsibilities?.length > 0 && (
  <div className="px-4 md:px-8 my-4">
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
  <div className="px-4 md:px-8 my-4">
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
          <div className="bg-blue-100 rounded-xl p-6 md:p-8 shadow-md space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Job Overview
            </h3>

            <div className="space-y-4 text-gray-700 text-sm">
              {[
                {
                  label: 'Expiration Date',
                  value: new Date(applicationDeadline).toLocaleDateString(),
                  icon: <FiCalendar />,
                },
                {
                  label: 'Location',
                  value: `${city}, ${country}`,
                  icon: <FiMapPin />,
                },
                {
                  label: 'Job Type',
                  value: jobType,
                  icon: <FiClock />,
                },
                {
                  label: 'Salary',
                  value: `₹${offeredSalary}`,
                  icon: <Banknote className="w-4 h-4" />,
                },
                {
                  label: 'Career Level',
                  value: careerLevel,
                  icon: <FiUser />,
                },
                {
                  label: 'Experience',
                  value: experience,
                  icon: <FiBookmark />,
                },
                {
                  label: 'Qualification',
                  value: qualification,
                  icon: <FiBookmark />,
                },
                {
                  label: 'Industry',
                  value: industry,
                  icon: <FiBookmark />,
                },
                {
                  label: 'Gender',
                  value: gender,
                  icon: <FiUser />,
                },
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
      {/* Related Jobs Section */}
      {relatedJobs?.length > 0 && (
  <div className="mt-14 px-4 md:px-10 pb-5">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      More Jobs from {company}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relatedJobs.map((job) => (
        <div
          key={job._id}
          onClick={() => handleCardClick(job)}
          className="cursor-pointer bg-blue-50/70 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:-translate-y-1"
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-teal-100 to-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-lg uppercase shadow">
              {job.company?.[0] || 'C'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <FiMapPin className="text-blue-500" /> {job.location || 'Remote'}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 text-xs font-medium mb-4">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{job.jobType || 'Full Time'}</span>
            {job.specialisms?.[0] && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{job.specialisms[0]}</span>
            )}
            {job.experience && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">{job.experience}</span>
            )}
          </div>

          {/* Extra Info */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiUser className="text-blue-600" />
              <span>{job.careerLevel || 'Any Level'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              <span>{job.industry || 'Industry'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBookmark className="text-blue-600" />
              <span>{job.qualification || 'Not Specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-blue-600" />
              <span>{new Date(job.applicationDeadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        

      
    </div>
  );
};

export default Job;
