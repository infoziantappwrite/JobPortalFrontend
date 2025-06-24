import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  FileText,
  Star,
  Bell,
  BarChart3,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
} from 'lucide-react';
import apiClient from '../api/apiClient'; // adjust path if needed
import InternalLoader from '../components/InternalLoader';
import EmptyState from '../components/EmptyState';
import { AlertTriangle } from "lucide-react";

const CandidateDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.get('/candidate/analytics', { withCredentials: true });
        setData(res.data);
        setError('');
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Something went wrong while loading your Page.');
      }
    };
    fetchAnalytics();
  }, []);

  // 🌀 Show loader while fetching
  if (!data && !error) return <InternalLoader text="Loading Dashboard" />;

  // ❌ Show error if API fails
  if (error) {
    return (
     
        <EmptyState
          icon={AlertTriangle}
          title="Oops! Something Went Wrong"
          message={error}
        />
    );
  }


  const { jobAnalytics, latestAppliedJobs, kpiReport, jobRecommendations } = data;

  const stats = [
    {
      label: 'Applied Jobs',
      count: jobAnalytics.applied,
      icon: Briefcase,
      bg: 'bg-blue-500',
    },
    {
      label: 'Shortlisted',
      count: jobAnalytics.shortlisted,
      icon: Star,
      bg: 'bg-green-500',
    },
    {
      label: 'Rejected',
      count: jobAnalytics.rejected,
      icon: FileText,
      bg: 'bg-red-500',
    },
    {
      label: 'Waiting List',
      count: jobAnalytics.waitingList,
      icon: Bell,
      bg: 'bg-yellow-500',
    },
  ];



  return (
    <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">👋 Welcome back, Candidate!</h1>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div key={index} className="p-5 bg-white shadow rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-full ${item.bg} text-white`}>
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-gray-800">{item.count}</h4>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <BarChart3 className="text-blue-500" />
            Key Metrics
          </h2>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>📈 Application Rate: {kpiReport.applicationRate}</li>
            <li>🎯 Interview Rate: {kpiReport.interviewRate}</li>
            <li>📚 Course Progress: {kpiReport.courseProgress}</li>
            <li>🏆 Certifications Earned: {kpiReport.certificationCount}</li>
            <li>👤 Profile Completeness: {kpiReport.profileCompleteness}</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-700">Interview Schedule</h2>
            <CalendarCheck className="text-teal-500" />
          </div>
          <ul className="text-gray-500 text-sm">
            <li>No interviews scheduled.</li>
          </ul>
        </div>
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-700">Your Resume</h2>
          <ClipboardList className="text-teal-600" />
        </div>
        <p className="text-gray-600 mb-4">
          You have uploaded {data.latestAppliedJobs?.length > 0 ? 1 : 0} active resume.
        </p>
        <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md font-medium shadow hover:scale-105 transition">
          View / Update Resume
        </button>
      </div>

      {/* Latest Applications */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">📝 Latest Applications</h2>
        {latestAppliedJobs.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent applications.</p>
        ) : (
          <div className="space-y-4">
            {latestAppliedJobs.map((job) => (
              <div
                key={job.jobID}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="text-gray-800 font-medium">
                    {job.title} @ {job.company}
                  </p>
                  <span className="text-sm text-gray-500">
                    Applied on {new Date(job.appliedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded capitalize">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">💡 Recommended Jobs</h2>
        {jobRecommendations.length === 0 ? (
          <p className="text-sm text-gray-500">No recommendations at this time.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobRecommendations.map((job, idx) => (
              <div key={idx} className="border p-4 rounded-xl hover:shadow transition">
                <h3 className="text-lg font-semibold text-teal-600">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.company} • {job.location} • {job.salary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
