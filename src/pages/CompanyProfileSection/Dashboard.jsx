import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import {
  FiUsers, FiBriefcase, FiTrendingUp, FiDollarSign, FiMessageCircle,
  FiClock, FiBarChart2
} from "react-icons/fi";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const CompanyDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.get(`/company/analytics`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <div className="p-10 text-xl text-gray-800 animate-pulse">Loading company analytics...</div>;

  const stats = [
    { label: 'Total Employees', value: data.totalEmployees, icon: <FiUsers />, color: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
    { label: 'Jobs Posted', value: data.jobsPosted, icon: <FiBriefcase />, color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
    { label: 'Applications Received', value: data.applicationsReceived, icon: <FiBarChart2 />, color: 'bg-gradient-to-br from-pink-500 to-rose-600' },
    { label: 'Shortlisted', value: data.applicationStatusCount.shortlisted, icon: <FiTrendingUp />, color: 'bg-gradient-to-br from-amber-500 to-yellow-600' },
    { label: 'Interviewed', value: data.applicationStatusCount.interviewed, icon: <FiMessageCircle />, color: 'bg-gradient-to-br from-emerald-500 to-lime-600' },
    { label: 'Offered', value: data.applicationStatusCount.offered, icon: <FiDollarSign />, color: 'bg-gradient-to-br from-yellow-500 to-orange-600' },
    { label: 'Rejected', value: data.applicationStatusCount.rejected, icon: <FiClock />, color: 'bg-gradient-to-br from-violet-500 to-fuchsia-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12 drop-shadow-sm">🏢 Company Analytics Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl text-white ${stat.color} shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="text-4xl opacity-90">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-slate-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">📈 KPI Metrics</h2>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li><strong>Application Rate:</strong> {data.kpiReport.applicationRate}</li>
              <li><strong>Shortlist Rate:</strong> {data.kpiReport.shortlistRate}</li>
              <li><strong>Offer Rate:</strong> {data.kpiReport.offerRate}</li>
              <li><strong>Interview Rate:</strong> {data.kpiReport.interviewRate}</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-slate-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">🔥 Top Jobs by Popularity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={data.topJobs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applicationCount" barSize={20} fill="#8E1616" radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="applicationCount" stroke="#00ADB5" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {data.applicationTrend && (
          <div className="mt-12 bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-slate-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">📊 Weekly Applications Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={data.applicationTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#00ADB5" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
