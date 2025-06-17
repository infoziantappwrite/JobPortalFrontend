import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiUser,
   FiCalendar, FiDollarSign,
  FiBookmark
} from 'react-icons/fi';
import { Banknote } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ApplyButton from '../candidate/jobs/ApplyButton';

const JobDetails = () => {
  const location = useLocation();
   const navigate = useNavigate();
  const { jobdetails, relatedJobs } = location.state || {};
   const { user} = useUser(); // ✅ Get user and loading state
  //console.log(jobdetails)
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
    careerLevel,
    experience,
    gender,
    industry,
    qualification,
    applicationDeadline,
    country,
    city,
    applicants
    
  } = jobdetails;

  const initial = title?.trim()?.charAt(0)?.toUpperCase() || 'J';

  return (
    <>
    <div className="bg-blue-100 px-10 py-16 mx-auto shadow-md  space-y-10">
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

        {/* Right */}
        
        {user?.userType?.toLowerCase() === 'candidate' && (
          <ApplyButton jobId={_id} jobTitle={title} applications={applicants}/>
        )}
      </div>

      

      {/* Posted By */}
      
    </div>
    <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
      
      {/* Left Column */}
      <div className="md:col-span-2 space-y-8">
        {/* Job Description */}
        <div>
          <h2 className="text-xl font-bold mb-2">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Key Responsibilities */}
        {specialisms?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Skill Required</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {specialisms.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      


      </div>

      {/* Right Column */}
     <div className="bg-blue-100 rounded-xl p-6 shadow-md space-y-6">
  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Job Overview</h3>

  <div className="space-y-4 text-gray-700 text-sm">
    {/* Utility function to render each row */}
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
     {relatedJobs?.length > 0 && (
  <div className=" p-10">
    <h3 className="text-xl font-bold text-gray-800 mb-4">
      More Jobs at {jobdetails.company}
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relatedJobs.map((job) => {
        const initial = job.title?.trim()?.charAt(0)?.toUpperCase() || 'J';
        return (
          <div key={job._id} className="bg-blue-100 p-6 rounded-xl shadow-md flex justify-between items-center flex-wrap md:flex-nowrap">
            {/* Left Section */}
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                {initial}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2 text-sm">
                  <span className="flex items-center gap-1"><FiBriefcase /> {job.company}</span>
                  <span className="flex items-center gap-1"><FiMapPin /> {job.location || 'Remote'}</span>
                  <span className="flex items-center gap-1"><Banknote className="w-4 h-4" /> ₹{job.offeredSalary}</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-200 text-indigo-800">{job.jobType}</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800">{job.careerLevel}</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-200 text-orange-800">{job.experience}</span>
                </div>
              </div>
            </div>

            {/* Right: View Job Button */}
            <button
              className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-teal-600 hover:to-blue-700 transition mt-4 md:mt-0"
              onClick={() => navigate('/jobdetails', {
                state: {
                  jobdetails: job,
                  relatedJobs:[jobdetails,... relatedJobs.filter(rj => rj._id !== job._id)],
                }
              })}
            >
              View Job
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}
    
    </>
  );
};

export default JobDetails;
