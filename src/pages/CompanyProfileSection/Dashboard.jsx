import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import {
  FiUsers, FiBriefcase, FiTrendingUp, FiDollarSign, FiMessageCircle,
  FiClock, FiBarChart2
} from "react-icons/fi";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import InternalLoader from "../../components/InternalLoader";
import EmptyState from "../../components/EmptyState";
import { AlertTriangle } from "lucide-react";

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#FB923C"];

const CompanyDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.get(`/company/analytics`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load dashboard.");
      }
    };
    fetchAnalytics();
  }, []);

  if (!data && !error) return <InternalLoader text="Loading company dashboard" />;
  if (error) return <EmptyState icon={AlertTriangle} title="Error" message={error} />;

  const stats = [
    { label: 'Total Employees', value: data.totalEmployees, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Jobs Posted', value: data.jobsPosted, icon: FiBriefcase, color: 'bg-indigo-500' },
    { label: 'Applications Received', value: data.applicationsReceived, icon: FiBarChart2, color: 'bg-pink-500' },
    { label: 'Shortlisted', value: data.applicationStatusCount.shortlisted, icon: FiTrendingUp, color: 'bg-green-500' },
    { label: 'Interviewed', value: data.applicationStatusCount.interviewed, icon: FiMessageCircle, color: 'bg-yellow-500' },
    { label: 'Offered', value: data.applicationStatusCount.offered, icon: FiDollarSign, color: 'bg-orange-500' },
    { label: 'Rejected', value: data.applicationStatusCount.rejected, icon: FiClock, color: 'bg-red-500' },
  ];

  const kpis = [
    { label: 'Application Rate', value: data.kpiReport.applicationRate, color: 'bg-blue-100' },
    { label: 'Shortlist Rate', value: data.kpiReport.shortlistRate, color: 'bg-green-100' },
    { label: 'Offer Rate', value: data.kpiReport.offerRate, color: 'bg-yellow-100' },
    { label: 'Interview Rate', value: data.kpiReport.interviewRate, color: 'bg-purple-100' },
  ];

  const pieData = data.topJobs.map(job => ({ name: job.title, value: job.applicationCount }));

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🏢 Hi, Welcome back !</h1>

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

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">📌 Key Performance Indicators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kpis.map((k, idx) => (
            <div key={idx} className={`rounded-xl p-4 ${k.color}`}>
              <p className="text-sm text-gray-600 font-medium">{k.label}</p>
              <p className="text-lg font-semibold text-gray-800">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🔥 Top Jobs by Popularity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {data.applicationTrend && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📈 Weekly Applications Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={data.applicationTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#14B8A6" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
