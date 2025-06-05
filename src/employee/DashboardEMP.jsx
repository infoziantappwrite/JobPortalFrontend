import React, { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiHeart, FiBarChart2, FiCheckCircle, FiXCircle, FiUser, FiMail } from 'react-icons/fi';

const DashboardEMP = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [jobsData, setJobsData] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const mockSummary = {
        totalJobsPosted: 12,
        totalApplicants: 98,
        shortlisted: 26,
        activeJobs: 5,
        upcomingInterviews: 4,
        applicationRate: '67%',
      };
      const mockJobs = [
        { id: 1, title: 'Frontend Developer', status: 'Active', applicants: 15, postedOn: '2025-05-01', closingDate: '2025-06-01' },
        { id: 2, title: 'Backend Developer', status: 'Closed', applicants: 25, postedOn: '2025-04-15', closingDate: '2025-05-15' },
        { id: 3, title: 'UI/UX Designer', status: 'Active', applicants: 18, postedOn: '2025-05-10', closingDate: '2025-06-10' },
        { id: 4, title: 'Project Manager', status: 'Active', applicants: 12, postedOn: '2025-05-20', closingDate: '2025-06-20' },
        { id: 5, title: 'QA Engineer', status: 'Active', applicants: 10, postedOn: '2025-05-25', closingDate: '2025-06-25' },
      ];
      const mockApplications = [
        { id: 1, applicantName: 'Alice Johnson', jobTitle: 'Frontend Developer', appliedOn: '2025-05-28', status: 'Shortlisted' },
        { id: 2, applicantName: 'Bob Smith', jobTitle: 'Backend Developer', appliedOn: '2025-05-27', status: 'Under Review' },
        { id: 3, applicantName: 'Carol Lee', jobTitle: 'UI/UX Designer', appliedOn: '2025-05-26', status: 'Rejected' },
        { id: 4, applicantName: 'David Kim', jobTitle: 'Project Manager', appliedOn: '2025-05-25', status: 'Interview Scheduled' },
      ];
      setDashboardData(mockSummary);
      setJobsData(mockJobs);
      setApplicationsData(mockApplications);
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Employee Dashboard</h1>
        <p className="text-gray-600">Track and manage job activities, applications, and analytics.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard icon={<FiBriefcase size={24} />} label="Jobs Posted" value={dashboardData.totalJobsPosted} />
        <AnalyticsCard icon={<FiUsers size={24} />} label="Total Applicants" value={dashboardData.totalApplicants} />
        <AnalyticsCard icon={<FiHeart size={24} />} label="Shortlisted Resumes" value={dashboardData.shortlisted} />
        <AnalyticsCard icon={<FiBarChart2 size={24} />} label="Active Jobs" value={dashboardData.activeJobs} />
        <AnalyticsCard icon={<FiUsers size={24} />} label="Upcoming Interviews" value={dashboardData.upcomingInterviews} />
        <AnalyticsCard icon={<FiBarChart2 size={24} />} label="Application Rate" value={dashboardData.applicationRate} />
      </div>

      {/* CTA Buttons */}
    

      {/* Analytics Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Listings Overview</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white">
              <th className="border border-gray-300 px-4 py-2 text-left">Job Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Applicants</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Posted On</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Closing Date</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobsData.map(({ id, title, status, applicants, postedOn, closingDate }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{title}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <StatusBadge status={status} />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">{applicants}</td>
                <td className="border border-gray-300 px-4 py-2">{postedOn}</td>
                <td className="border border-gray-300 px-4 py-2">{closingDate}</td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <ActionButton label="View" />
                  <ActionButton label="Edit" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recently Posted Jobs */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recently Posted Jobs</h2>
        <div className="space-y-4 max-h-48 overflow-y-auto">
          {jobsData
            .sort((a, b) => new Date(b.postedOn) - new Date(a.postedOn))
            .slice(0, 3)
            .map(({ id, title, postedOn, status }) => (
              <div key={id} className="flex justify-between items-center border border-gray-200 rounded p-3 hover:shadow-sm transition">
                <div>
                  <p className="font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">Posted on: {postedOn}</p>
                </div>
                <StatusBadge status={status} />
              </div>
            ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Applications</h2>
        <div className="space-y-4 max-h-48 overflow-y-auto">
          {applicationsData
            .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn))
            .slice(0, 3)
            .map(({ id, applicantName, jobTitle, appliedOn, status }) => (
              <div key={id} className="flex justify-between items-center border border-gray-200 rounded p-3 hover:shadow-sm transition">
                <div>
                  <p className="font-medium text-gray-900">{applicantName}</p>
                  <p className="text-xs text-gray-500">{jobTitle}</p>
                  <p className="text-xs text-gray-400">Applied on: {appliedOn}</p>
                </div>
                <StatusBadge status={status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ icon, label, value }) => (
  <div className="bg-white border rounded-xl shadow p-5 flex items-center gap-4">
    <div className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  // Normalize status for color mapping
  const lowerStatus = status.toLowerCase();
  let colorClasses = 'bg-gray-100 text-gray-800';
  if (lowerStatus === 'active' || lowerStatus === 'shortlisted' || lowerStatus === 'interview scheduled') {
    colorClasses = 'bg-green-100 text-green-800';
  } else if (lowerStatus === 'closed' || lowerStatus === 'rejected') {
    colorClasses = 'bg-red-100 text-red-800';
  } else if (lowerStatus === 'under review') {
    colorClasses = 'bg-yellow-100 text-yellow-800';
  }
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
      {lowerStatus === 'active' || lowerStatus === 'shortlisted' || lowerStatus === 'interview scheduled' ? <FiCheckCircle /> : <FiXCircle />}
      {status}
    </span>
  );
};

const ActionButton = ({ label }) => (
  <button className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:opacity-90 transition">
    {label}
  </button>
);

export default DashboardEMP;
