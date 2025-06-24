import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Star,
  FileText,
  Bell,
} from 'lucide-react';
import { BookOpen, Clock, CheckCircle, BadgeCheck } from 'lucide-react';



import apiClient from '../api/apiClient';
import InternalLoader from '../components/InternalLoader';
import EmptyState from '../components/EmptyState';
import { AlertTriangle } from 'lucide-react';
import KPIGrid from './KPIGrid';
import LatestApplications from './LatestApplications';

const CandidateDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/candidate/analytics', { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard.');
      }
    };
    fetchData();
  }, []);

  if (!data && !error) return <InternalLoader text="Loading dashboard" />;
  if (error) {
    return <EmptyState icon={AlertTriangle} title="Error" message={error} />;
  }

  const { jobAnalytics, courseAnalytics } = data;

  const stats = [
    { label: 'Applied Jobs', value: jobAnalytics.applied, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Shortlisted', value: jobAnalytics.shortlisted, icon: Star, color: 'bg-green-500' },
    { label: 'Rejected', value: jobAnalytics.rejected, icon: FileText, color: 'bg-red-500' },
    { label: 'Waiting List', value: jobAnalytics.waitingList, icon: Bell, color: 'bg-yellow-500' },
  ];
  const courseStats = [
    { label: 'Enrolled Courses', value: courseAnalytics.enrolled, icon: BookOpen, color: 'bg-purple-500' },
    { label: 'In Progress', value: courseAnalytics.inProgress, icon: Clock, color: 'bg-orange-500' },
    { label: 'Completed', value: courseAnalytics.completed, icon: CheckCircle, color: 'bg-teal-600' },
    { label: 'Certified', value: courseAnalytics.certified, icon: BadgeCheck, color: 'bg-indigo-600' },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">👋 Hi, Welcome back !</h1>

      {/* Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-5">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 shadow flex gap-4 items-center border border-gray-100">
            <div className={`p-3 rounded-full text-white ${s.color}`}><s.icon size={24} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        {courseStats.map((item, idx) => (
          <div key={idx} className="p-5 bg-white shadow rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-full ${item.color} text-white`}>
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-gray-800">{item.value}</h4>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          </div>
        ))}
      </div>


      {/* KPI Report */}
      {data?.kpiReport && <KPIGrid kpiReport={data.kpiReport} />}



      {/* Latest Applications */}
      {data?.latestAppliedJobs && (
        <LatestApplications latestAppliedJobs={data.latestAppliedJobs} />
      )}


    </div>
  );
};

export default CandidateDashboard;
