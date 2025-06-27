import React, { useEffect, useState } from 'react';
import {
  Users, Briefcase, Heart, BarChart2, CheckCircle,
  XCircle, TrendingUp, Calendar, Eye, ArrowUpRight,
  Zap, Star, Clock, Award, UserCheck, PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import InternalLoader from '../components/InternalLoader';

const DashboardEMP = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/employee/analytics');
        setDashboardData(response.data);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) return <InternalLoader text="Loading Dashboard" />;

  // Status icons mapping
  const statusIcons = {
    applied: <UserCheck className="w-5 h-5" />,
    shortlisted: <Heart className="w-5 h-5" />,
    interviewed: <Calendar className="w-5 h-5" />,
    offered: <CheckCircle className="w-5 h-5" />,
    rejected: <XCircle className="w-5 h-5" />,
    waitingList: <Clock className="w-5 h-5" />
  };

  // Filter out statuses with 0 counts
  const activeStatuses = Object.entries(dashboardData.applicationStatusCount || {})
    .filter(([_, count]) => count > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 relative overflow-hidden min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-96 h-96 bg-gradient-to-br from-teal-100/20 to-indigo-100/20 rounded-full blur-3xl top-[-160px] right-[-160px] animate-float-slow" />
        <div className="absolute w-96 h-96 bg-gradient-to-tr from-indigo-100/20 to-teal-100/20 rounded-full blur-3xl bottom-[-160px] left-[-160px] animate-float-medium" />
      </div>

      {/* Welcome & Quick Actions */}
      <div className={`relative z-10 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-3xl shadow-lg p-8 border border-indigo-100/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Recruitment Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                {dashboardData.applicationsReceived} applications across {dashboardData.jobsPosted} jobs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform shadow-lg hover:shadow-xl">
                    <BarChart2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Key Metrics + Application Status */}
        <div className={`space-y-8 transition-all duration-700 delay-75 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>

          {/* Key Metrics */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" /> Key Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4 ">
              <MetricCard
                icon={<Briefcase className="w-5 h-5" />}
                label="Jobs Posted"
                value={dashboardData.jobsPosted}
              />
              <MetricCard
                icon={<Users className="w-5 h-5" />}
                label="Total Applicants"
                value={dashboardData.applicationsReceived}
              />
              {activeStatuses.map(([status, count]) => (
                <MetricCard
                  key={status}
                  icon={statusIcons[status] || <UserCheck className="w-5 h-5" />}
                  label={status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={count}
                />
              ))}
            </div>
          </section>

          {/* Application Status Overview */}
          {activeStatuses.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal-500" /> Application Status
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                {activeStatuses.map(([status, count]) => (
                  <div key={status} className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {statusIcons[status] || <UserCheck className="w-4 h-4" />}
                      </div>
                    </div>
                    <p className="uppercase text-xs text-teal-600 font-semibold mb-1">
                      {status.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-teal-900">{count}</p>
                    {dashboardData.applicationsReceived > 0 && (
                      <p className="text-xs text-teal-500 mt-1">
                        {Math.round((count / dashboardData.applicationsReceived) * 100)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (spans 2 cols) */}
        <div className={`lg:col-span-2 space-y-8 transition-all duration-700 delay-150 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>

          {/* Job Performance Table */}
          {dashboardData.topJobs && dashboardData.topJobs.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-teal-500" /> Job Performance
                </h2>
                <div className="text-sm text-slate-500">
                  {dashboardData.topJobs.length} active positions
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left pb-3 font-medium text-slate-600">Job Title</th>
                      <th className="text-center pb-3 font-medium text-slate-600">Applicants</th>
                      <th className="text-right pb-3 font-medium text-slate-600">Status</th>
                      <th className="text-center pb-3 font-medium text-slate-600">Action</th> {/* Added Action column */}
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topJobs.map((job) => (
                      <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-indigo-100 rounded-lg flex items-center justify-center">
                              <Briefcase className="w-4 h-4 text-teal-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{job.title}</p>
                              <p className="text-xs text-slate-500">
                                {job.applicationCount > 0 ? 'Active' : 'No applicants'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <div className="inline-flex items-center gap-1 justify-center">
                            <Users className="w-4 h-4 text-teal-500" />
                            <span className="font-medium">{job.applicationCount}</span>
                          </div>
                        </td>
                        <td className="text-right py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${job.applicationCount > 0 ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {job.applicationCount > 0 ? (
                              <>
                                <CheckCircle className="w-3 h-3" /> Active
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" /> Inactive
                              </>
                            )}
                          </span>
                        </td>
                        {/* Action Column */}
                        <td className="text-center py-4">
                          <Link
                            to={`/employee/manage-jobs`} // Link to job performance details page
                            className="text-teal-500 hover:text-teal-700 text-xs font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* KPI Summary Cards */}
          {dashboardData.kpiReport && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(dashboardData.kpiReport)
                .filter(([_, value]) => value && value !== '0')
                .map(([key, value]) => {
                  const kpiConfig = {
                    'applicationRate': { label: 'Application Rate', icon: <ArrowUpRight className="w-5 h-5" /> },
                    'shortlistRate': { label: 'Shortlist Rate', icon: <Star className="w-5 h-5" /> },
                    'offerRate': { label: 'Offer Rate', icon: <CheckCircle className="w-5 h-5" /> },
                    'interviewRate': { label: 'Interview Rate', icon: <Calendar className="w-5 h-5" /> },
                    'jobsPosted': { label: 'Active Jobs', icon: <Briefcase className="w-5 h-5" /> }
                  };

                  return kpiConfig[key] ? (
                    <div key={key} className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100/50 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-indigo-100 rounded-lg flex items-center justify-center shadow-sm">
                        {kpiConfig[key].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{kpiConfig[key].label}</h3>
                        <p className="text-2xl font-bold text-teal-700">{value}</p>
                      </div>
                    </div>

                  ) : null;
                })}
            </section>
          )}

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.applicationStatusCount?.interviewed > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100/50">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Upcoming Interviews</h3>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-slate-800">
                    {dashboardData.applicationStatusCount.interviewed}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100/50">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Active Positions</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-800">
                  {dashboardData.kpiReport?.jobsPosted || dashboardData.jobsPosted}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                  <Briefcase className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, label, value }) => (
  <div className="bg-teal-50 rounded-xl p-4 hover:bg-white transition border border-slate-100 hover:border-slate-200">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-xl font-bold text-slate-800">{value}</span>
    </div>
  </div>
);

export default DashboardEMP;