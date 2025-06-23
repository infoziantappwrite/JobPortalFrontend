import React, { useEffect, useState } from 'react';
import {
  FiUsers, FiBriefcase, FiHeart, FiBarChart2,
  FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';


const DashboardEMP = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [topJobs, setTopJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/employee/analytics');
        const data = response.data;

        const summary = {
          totalJobsPosted: data.jobsPosted,
          totalApplicants: data.applicationsReceived,
          shortlisted: data.applicationStatusCount?.shortlisted || 0,
          activeJobs: data.kpiReport?.jobsPosted || 0,
          upcomingInterviews: data.applicationStatusCount?.interviewed || 0,
          applicationRate: data.kpiReport?.applicationRate || '0',
        };

        setDashboardData(summary);
        setTopJobs(data.topJobs || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-slate-100 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Employer</h1>
        <p className="text-gray-500 mt-2">Manage your postings, track applicants, and monitor performance.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard icon={<FiBriefcase size={24} />} label="Jobs Posted" value={dashboardData.totalJobsPosted} />
        <AnalyticsCard icon={<FiUsers size={24} />} label="Total Applicants" value={dashboardData.totalApplicants} />
        <AnalyticsCard icon={<FiHeart size={24} />} label="Shortlisted" value={dashboardData.shortlisted} />
        <AnalyticsCard icon={<FiBarChart2 size={24} />} label="Active Jobs" value={dashboardData.activeJobs} />
        <AnalyticsCard icon={<FiUsers size={24} />} label="Upcoming Interviews" value={dashboardData.upcomingInterviews} />
        <AnalyticsCard icon={<FiBarChart2 size={24} />} label="Application Rate" value={dashboardData.applicationRate} />
      </div>

      {/* Job Listings Table */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Listings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2 text-center">Applicants</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topJobs.map(({ _id, title, applicationCount }) => (
                <tr key={_id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2">{title}</td>
                  <td className="px-4 py-2 text-center">{applicationCount}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <ActionButton label="View" to="/employee/manage-jobs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recently Posted Jobs */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Jobs</h2>
        <div className="space-y-4 max-h-48 overflow-y-auto">
          {topJobs
            .slice(0, 3)
            .map(({ _id, title }) => (
              <div
                key={_id}
                className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">Recently Added</p>
                </div>
                <StatusBadge status="Active" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// Components
const AnalyticsCard = ({ icon, label, value }) => (
  <div className="bg-white border rounded-2xl shadow p-5 flex items-center gap-4 hover:shadow-md transition">
    <div className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white p-3 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const lower = status.toLowerCase();
  let color = 'bg-gray-100 text-gray-800';
  if (['active', 'shortlisted', 'interview scheduled'].includes(lower)) color = 'bg-green-100 text-green-800';
  else if (['closed', 'rejected'].includes(lower)) color = 'bg-red-100 text-red-800';
  else if (lower === 'under review') color = 'bg-yellow-100 text-yellow-800';

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
      {['active', 'shortlisted', 'interview scheduled'].includes(lower) ? <FiCheckCircle /> : <FiXCircle />}
      {status}
    </span>
  );
};

const ActionButton = ({ label, to }) => (
  <Link
    to={to}
    className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:opacity-90 transition inline-block"
  >
    {label}
  </Link>
);


export default DashboardEMP;
