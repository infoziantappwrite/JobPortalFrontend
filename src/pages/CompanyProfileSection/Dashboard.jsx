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
import { AlertTriangle, Building2  } from "lucide-react";

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
    <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-700 bg-clip-text text-transparent">
  <Building2 className="w-7 h-7 text-blue-700" />
  Hi, Welcome back!
</h1>


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

      <div className="mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow p-5">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">🔥 Top Jobs by Popularity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Chart on the left */}
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120} // Increased outerRadius for a larger pie
                    fill="#8884d8"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Show name and percentage
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} applications`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Enhanced data list on the right */}
            <div className="flex flex-col gap-4">
              {pieData.slice(0, 5).map((job, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-1 flex items-center p-4 border border-gray-100"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-md mr-4`}
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  >
                    {job.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800">{job.name}</p>
                    <p className="text-sm text-gray-600">{job.value.toLocaleString()} applications</p>
                  </div>
                  <div className="text-right text-gray-500 text-sm">
                    {((job.value / data.applicationsReceived) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
              {pieData.length > 5 && (
                <div className="text-center text-sm text-gray-600 mt-2">
                  And {pieData.length - 5} more jobs...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;