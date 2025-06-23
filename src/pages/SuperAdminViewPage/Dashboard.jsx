import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
  Line,
  Bar
} from "recharts";
import {
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const COLORS = ["#8E1616", "#E8C999", "#F8EEDF", "#00ADB5", "#222831"];

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.get("/superadmin/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <div className="p-10 text-xl text-gray-800">Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 p-6 sm:p-10 text-gray-900">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 flex justify-center items-center gap-3">
          <FiTrendingUp className="text-teal-500" /> Super Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">An overview of platform performance and metrics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Companies" value={data.companies.total} icon={<FiBriefcase />} />
        <StatCard title="Approved Companies" value={data.companies.approved} icon={<FiCheckCircle />} />
        <StatCard title="Pending Companies" value={data.companies.pending} icon={<FiClock />} />
        <StatCard title="Total Candidates" value={data.users.candidates} icon={<FiUsers />} />
        <StatCard title="Total Employees" value={data.users.employees} icon={<FiUsers />} />
        <StatCard title="Super Admins" value={data.users.superAdmins} icon={<FiAward />} />
        <StatCard title="Total Jobs" value={data.jobs.totalJobs} icon={<FiBriefcase />} />
        <StatCard title="Applications" value={data.jobs.totalApplications} icon={<FiUsers />} />
        <StatCard title="Avg. Applications / Job" value={data.jobs.avgApplicationsPerJob} icon={<FiBarChart2 />} />
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Area Chart - Course Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <FiBarChart2 /> Course Progress Overview
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={[
                {
                  name: "Enrollments",
                  Enrollments: data.courses.totalEnrollments,
                  Completed: data.courses.totalCompleted,
                  Certified: data.courses.totalCertified,
                },
              ]}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ADB5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00ADB5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCertified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8E1616" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8E1616" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Completed" stroke="#00ADB5" fillOpacity={1} fill="url(#colorCompleted)" />
              <Area type="monotone" dataKey="Certified" stroke="#8E1616" fillOpacity={1} fill="url(#colorCertified)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Composed Chart - Company Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <FiPieChart /> Company Status Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={[
                {
                  name: "Companies",
                  Approved: data.companies.approved,
                  Pending: data.companies.pending,
                },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="Approved" barSize={20} fill="#00ADB5" />
              <Bar dataKey="Pending" barSize={20} fill="#8E1616" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">KPI Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
          <KPIItem label="Company Approval Rate" value={`${data.kpiReport.companyApprovalRate}%`} />
          <KPIItem label="Avg. Applications Per Job" value={data.kpiReport.avgApplicationsPerJob} />
          <KPIItem label="Course Completion Rate" value={data.kpiReport.courseCompletionRate} />
          <KPIItem label="Course Certification Rate" value={data.kpiReport.courseCertificationRate} />
          <KPIItem label="Total Users" value={data.kpiReport.totalUsers} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gradient-to-tr from-indigo-100 to-white border border-indigo-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-indigo-700 mt-1">{value}</h3>
      </div>
      <div className="text-3xl text-teal-500">{icon}</div>
    </div>
  </div>
);

const KPIItem = ({ label, value }) => (
  <div className="flex justify-between bg-indigo-50 px-4 py-3 rounded-lg border">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="font-semibold text-indigo-700">{value}</span>
  </div>
);

export default Dashboard;
