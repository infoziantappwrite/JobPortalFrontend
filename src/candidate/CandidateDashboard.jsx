import React from 'react';
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

const stats = [
  {
    label: 'Applied Jobs',
    count: 12,
    icon: Briefcase,
    bg: 'bg-blue-500',
  },
  {
    label: 'Shortlisted',
    count: 4,
    icon: Star,
    bg: 'bg-green-500',
  },
  {
    label: 'Interviews',
    count: 2,
    icon: FileText,
    bg: 'bg-yellow-500',
  },
  {
    label: 'Offers',
    count: 1,
    icon: Bell,
    bg: 'bg-teal-500',
  },
];

const CandidateDashboard = () => {
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

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-700">Applications Trend</h2>
            <TrendingUp className="text-blue-500" />
          </div>
          <div className="h-40 flex items-center justify-center text-gray-400">
            {/* Placeholder for chart */}
            <span>[Chart Placeholder]</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-700">Interview Schedule</h2>
            <CalendarCheck className="text-teal-500" />
          </div>
          <ul className="text-gray-700 space-y-3">
            <li>🗓️ TCS Interview • Jun 22, 11:00 AM</li>
            <li>🗓️ Wipro HR Call • Jun 25, 3:00 PM</li>
          </ul>
        </div>
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-700">Your Resume</h2>
          <ClipboardList className="text-teal-600" />
        </div>
        <p className="text-gray-600 mb-4">You have uploaded 1 active resume.</p>
        <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md font-medium shadow hover:scale-105 transition">
          View / Update Resume
        </button>
      </div>

      {/* Latest Applications */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">📝 Latest Applications</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium">Frontend Developer @ Infosys</p>
              <span className="text-sm text-gray-500">Applied on Jun 15</span>
            </div>
            <span className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded">In Review</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium">UI/UX Designer @ TCS</p>
              <span className="text-sm text-gray-500">Shortlisted</span>
            </div>
            <span className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded">Shortlisted</span>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">💡 Recommended Jobs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-xl hover:shadow transition">
            <h3 className="text-lg font-semibold text-teal-600">React Developer</h3>
            <p className="text-sm text-gray-600">Wipro • Chennai • ₹6-8 LPA</p>
          </div>
          <div className="border p-4 rounded-xl hover:shadow transition">
            <h3 className="text-lg font-semibold text-teal-600">Backend Engineer</h3>
            <p className="text-sm text-gray-600">Zoho • Remote • ₹10-12 LPA</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">🔔 Notifications</h2>
        <ul className="text-gray-700 space-y-2">
          <li>✅ Your application for Frontend Developer has been viewed.</li>
          <li>📅 Interview scheduled with TCS on Jun 22.</li>
        </ul>
      </div>
    </div>
  );
};

export default CandidateDashboard;
