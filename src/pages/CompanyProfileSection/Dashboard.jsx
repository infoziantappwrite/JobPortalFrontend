import React from 'react';
import {
  FiUsers, FiBriefcase, FiLayers, FiTrendingUp,
  FiDollarSign, FiMessageCircle, FiCalendar, FiGlobe, FiClock
} from 'react-icons/fi';

const Dashboard = () => {
  const stats = [
    { label: 'Total Employees', value: 320, icon: <FiUsers />, color: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
    { label: 'Active Projects', value: 24, icon: <FiBriefcase />, color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
    { label: 'Departments', value: 8, icon: <FiLayers />, color: 'bg-gradient-to-br from-pink-500 to-rose-600' },
    { label: 'Open Positions', value: 12, icon: <FiTrendingUp />, color: 'bg-gradient-to-br from-amber-500 to-yellow-600' },
    { label: 'Revenue (Q2)', value: '$1.2M', icon: <FiDollarSign />, color: 'bg-gradient-to-br from-emerald-500 to-lime-600' },
    { label: 'Client Feedbacks', value: 198, icon: <FiMessageCircle />, color: 'bg-gradient-to-br from-yellow-500 to-orange-600' },
    { label: 'Social Reach', value: '48K+', icon: <FiGlobe />, color: 'bg-gradient-to-br from-teal-500 to-sky-600' },
    { label: 'Upcoming Interviews', value: 14, icon: <FiCalendar />, color: 'bg-gradient-to-br from-red-500 to-rose-600' },
    { label: 'Avg. Working Hours', value: '7.9 hrs', icon: <FiClock />, color: 'bg-gradient-to-br from-violet-500 to-fuchsia-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white px-6 py-12">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight">
        📈 Company Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl text-white ${stat.color} shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-white/80">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl opacity-90">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">🚀 Upcoming Events</h2>
          <ul className="space-y-3 text-gray-600">
            <li>✅ Q3 Review Meeting - 21st June</li>
            <li>🎯 Marketing Campaign Launch - 28th June</li>
            <li>🛠 System Upgrade Maintenance - 5th July</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Company Performance</h2>
          <p className="text-gray-600 leading-relaxed">
            This quarter, your company grew <span className="font-semibold text-green-600">by 14%</span> in project delivery, with employee satisfaction increasing by <span className="font-semibold text-green-600">9.5%</span>. Engagement on social platforms also saw a spike of <span className="font-semibold text-indigo-600">22%</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
