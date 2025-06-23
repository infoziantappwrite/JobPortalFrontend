import React, { useEffect, useState } from 'react';
import {
  Users, Briefcase, Heart, BarChart2,
  CheckCircle, XCircle, TrendingUp, Calendar,
  Eye, ArrowUpRight, Zap, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const DashboardEMP = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [topJobs, setTopJobs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-80 h-80 bg-gradient-to-br from-teal-200/30 to-indigo-200/30 rounded-full blur-3xl top-[-160px] right-[-160px] animate-pulse" />
        <div className="absolute w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-teal-200/30 rounded-full blur-3xl bottom-[-160px] left-[-160px] animate-pulse" />
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      {/* Welcome Card */}
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Welcome Back!
              </h1>
              <p className="text-slate-600 text-lg">Your recruitment command center is ready</p>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform shadow-2xl hover:scale-110">
                  <BarChart2 className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <AnalyticsCard icon={<Briefcase />} label="Jobs Posted" value={dashboardData.totalJobsPosted} color="from-teal-500 to-indigo-600" />
        <AnalyticsCard icon={<Users />} label="Total Applicants" value={dashboardData.totalApplicants} color="from-teal-500 to-indigo-600" />
        <AnalyticsCard icon={<Heart />} label="Shortlisted" value={dashboardData.shortlisted} color="from-teal-500 to-indigo-600" />
        <AnalyticsCard icon={<TrendingUp />} label="Active Jobs" value={dashboardData.activeJobs} color="from-teal-500 to-indigo-600" />
        <AnalyticsCard icon={<Calendar />} label="Upcoming Interviews" value={dashboardData.upcomingInterviews} color="from-teal-500 to-indigo-600" />
        <AnalyticsCard icon={<BarChart2 />} label="Application Rate" value={dashboardData.applicationRate} color="from-teal-500 to-indigo-600" />
      </div>


      {/* Job Listings Table */}
      <div className="relative z-10 transition-all duration-1000 delay-200">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-8 border-b border-slate-200/50">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-teal-600" /> Job Listings
              </h2>
              <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full">{topJobs.length} active positions</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white">
                  <th className="text-left px-8 py-4">Title</th>
                  <th className="text-center px-8 py-4">Applicants</th>
                  <th className="text-center px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topJobs.map(({ _id, title, applicationCount }) => (
                  <tr key={_id} className="border-b hover:bg-teal-50/20 transition group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                          {title.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 group-hover:text-teal-600">{title}</h3>
                          <p className="text-sm text-slate-500">Recently posted</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                        <Users className="w-4 h-4 text-teal-500" />
                        <span className="font-semibold text-slate-700">{applicationCount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <ActionButton label="View" to="/employee/manage-jobs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Jobs Section */}
      <div className="relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-6 h-6 text-teal-600" /> Top Jobs
            </h2>
            <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full">Recently added</span>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {topJobs.slice(0, 3).map(({ _id, title }, index) => (
              <div
                key={_id}
                className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-teal-500 to-indigo-600">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                </div>
                <Link
                  to="/employee/manage-jobs"
                  className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1"
                >
                  View <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardEMP;


const AnalyticsCard = ({ icon, label, value, color }) => (
  <div className="group bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-md p-6 transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
    <div className="relative z-10">
      <div className="flex justify-between items-center mb-4">
        <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="text-xl font-semibold text-slate-800">{value}</h3>
    </div>
  </div>
);


const ActionButton = ({ label, to }) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
  >
    <Eye className="w-4 h-4" />
    {label}
  </Link>
);
