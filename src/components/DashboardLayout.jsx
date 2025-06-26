import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { FiBriefcase, FiBell, FiUserCheck, FiHeart, FiFileText, FiUsers, FiBarChart2, FiMenu, FiX, FiPlusSquare, FiUserPlus, FiBook, FiSettings  } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import DFooter from './DFooter';
import { LuFileUser } from 'react-icons/lu';

import { LuBuilding2, LuBriefcaseBusiness, LuUserCog } from 'react-icons/lu';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { PiChalkboardTeacher } from 'react-icons/pi';
import { BiUserCheck } from 'react-icons/bi';
import { TbUserSquareRounded } from 'react-icons/tb';



import { useUser } from '../contexts/UserContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useUser(); // ✅ Get user and loading state



  if (!user) {
    return <p className="text-center mt-10 text-red-500 font-semibold">Please log in to access the dashboard.</p>;
  }

  const role = user?.userType?.toLowerCase();

  const commonItems = [


  ];

  const roleSpecificMenu = {
    candidate: [
      { key: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 />, path: '/candidate/dashboard' },
      { key: 'resume', label: 'My Resume', icon: <FiFileText />, path: '/candidate/resume' },
      { key: 'jobs', label: 'Job Alerts', icon: <FiBell />, path: '/candidate/jobs' },
      { key: 'applied', label: 'Applied Jobs', icon: <FiBriefcase />, path: '/candidate/applied' },
      // { key: 'shortlisted', label: 'Shortlisted Jobs', icon: <FiHeart />, path: '/candidate/shortlisted' },
      // { key: 'cv', label: 'CV Manager', icon: <FiFileText />, path: '/candidate/cv-manager' },

    ],
   superadmin : [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <FiBarChart2 />,
    path: '/superadmin/dashboard',
  },
  {
    key: 'manage',
    label: 'Manage Companies',
    icon: <LuBuilding2 />,
    path: '/superadmin/manage-companies',
  },
  {
    key: 'jobs',
    label: 'Manage Jobs',
    icon: <LuBriefcaseBusiness />,
    path: '/superadmin/manage-jobs',
  },
  {
    key: 'applicants',
    label: 'Manage Applicants',
    icon: <HiOutlineDocumentText />,
    path: '/superadmin/manage-applicants',
  },
  {
    key: 'manageEmployee',
    label: 'Manage Employee',
    icon: <LuUserCog />,
    path: '/superadmin/manage-employee',
  },
  {
    key: 'manageCandidate',
    label: 'Manage Candidate',
    icon: <TbUserSquareRounded />,
    path: '/superadmin/manage-candidate',
  },
  {
    key: 'course',
    label: 'Manage Courses',
    icon: <PiChalkboardTeacher />,
    path: '/superadmin/course',
  },
],
    

    company: [
      { key: 'dashboard', label: 'Company Dashboard', icon: <FiBarChart2 />, path: '/company/dashboard' },
      { key: 'post', label: 'Post a New Job', icon: <FiPlusSquare />, path: '/company/post-job' },
      { key: 'Manage Jobs', label: 'Manage Jobs', icon: <FiBriefcase />, path: '/company/manage-jobs' },
      { key: 'applicants', label: 'Manage Applicants', icon: <LuFileUser />, path: '/company/manage-applicants' },
      { key: 'shortlisted', label: 'Shortlisted Applicants', icon: <FiHeart />, path: '/company/shortlisted-applicants' },
      { key: 'manage', label: 'Manage Employees', icon: <FiUsers />, path: '/company/manage-employees' },
      { key: 'approve', label: 'Approve Employees', icon: <FiUserCheck />, path: '/company/approve-employees' },

    ],
    employee: [
      { key: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 />, path: '/employee/dashboard' },
      { key: 'post', label: 'Post a New Job', icon: <FiPlusSquare />, path: '/employee/post-job' },
      { key: 'manage-jobs', label: 'Manage Jobs', icon: <FiBriefcase />, path: '/employee/manage-jobs' },
      { key: 'manage-applicants', label: 'Manage Applicants', icon: <LuFileUser />, path: '/employee/manage-applicants' },
      { key: 'shortlisted', label: 'Shortlisted Applicants', icon: <FiHeart />, path: '/employee/shortlisted-applicants' },
    ]
  };




  const menu = [
    ...commonItems,
    ...(roleSpecificMenu[role] || []),

  ];
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 font-semibold">
        Loading user data...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Please log in to access the dashboard.
      </p>
    );
  }


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-jost">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow border-b px-4 py-3 flex items-center justify-between z-10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-lg font-semibold text-gray-900 ml-2 truncate">
          Welcome, {user.name}
        </h1>
        <div className="w-8"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg w-72 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:w-64 lg:w-72 md:shadow-md flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-gradient-to-r from-teal-500 to-indigo-600 shadow-md font-jost">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-bold capitalize">Welcome, {user.name}</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white hover:bg-white/20 p-1 rounded transition"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>
          <p className="text-indigo-100 text-sm mt-1 capitalize">{role} </p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-4"> {/* Increased from space-y-1.5 to space-y-3 */}
            {menu.map(({ key, label, icon, path, isLogout }) => {
              const isActive = location.pathname.includes(path);
              return (
                <li key={key}>
                  <button
                    onClick={() => {
                      navigate(path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150
          ${isActive && !isLogout
                        ? 'bg-blue-100 text-blue-800'
                        : isLogout
                          ? 'hover:bg-red-50 text-gray-600 hover:text-red-700'
                          : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700'
                      }
        `}
                  >
                    <span className={`text-lg ${isActive && !isLogout ? 'text-blue-700' : ''}`}>
                      {icon}
                    </span>
                    <span className="font-medium text-sm truncate">{label}</span>
                  </button>
                </li>
              );
            })}

          </ul>
        </div>

      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Desktop Header */}


        {/* Full-page layout */}
        <div className="min-h-screen flex flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto">
              <div className="rounded-lg">
                <Outlet />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DFooter />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
