// components/KPIGrid.jsx
import React from 'react';
import {
  BarChart3,
  TrendingUp,
  School,
  Award,
  UserCheck,
  FileSearch,
} from 'lucide-react';

const KPIGrid = ({ kpiReport }) => {
  const kpis = [
    {
      label: 'Application Rate',
      value: kpiReport.applicationRate,
      icon: TrendingUp,
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Interview Rate',
      value: kpiReport.interviewRate,
      icon: BarChart3,
      bg: 'bg-green-100',
      border: 'border-green-300',
      iconColor: 'text-green-600',
    },
    {
      label: 'Course Progress',
      value: kpiReport.courseProgress,
      icon: School,
      bg: 'bg-indigo-100',
      border: 'border-indigo-300',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Certifications Earned',
      value: kpiReport.certificationCount,
      icon: Award,
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Profile Completeness',
      value: kpiReport.profileCompleteness,
      icon: UserCheck,
      bg: 'bg-purple-100',
      border: 'border-purple-300',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Resume Insights',
      value: 'View / Update',
      icon: FileSearch,
      bg: 'bg-teal-100',
      border: 'border-teal-300',
      iconColor: 'text-teal-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow mb-10 border border-gray-100">
      <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-6">
        <BarChart3 className="text-blue-500" /> Key Performance Indicators
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 p-4 rounded-xl shadow-sm border ${kpi.bg} ${kpi.border}`}
          >
            <div className={`p-2 rounded-md ${kpi.iconColor} bg-white shadow`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-800">{kpi.label}</h4>
              <p className="text-sm text-gray-600">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIGrid;
