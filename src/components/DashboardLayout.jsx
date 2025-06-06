import {  useState } from 'react';
import { useNavigate,Outlet } from 'react-router-dom';
import {FiUser, FiBriefcase, FiLock, FiBell, FiMessageCircle, FiUserCheck, FiHeart, FiFileText, FiUsers, FiBarChart2, FiMenu, FiX, FiPlusSquare}from 'react-icons/fi';


const DashboardLayout = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  //console.log('User in Dashboard:', user);

  if (!user) {
    return <p className="text-center mt-10 text-red-500 font-semibold">Please log in to access the dashboard.</p>;
  }

  const role = user?.role?.toLowerCase();

  const commonItems = [


  ];

 const roleSpecificMenu = {
  candidate: [
    { key: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 />, path: '/candidate/dashboard' },
    { key: 'resume', label: 'My Resume', icon: <FiFileText />, path: '/candidate/resume' },
    { key: 'applied', label: 'Applied Jobs', icon: <FiBriefcase />, path: '/candidate/applied' },
    { key: 'alerts', label: 'Job Listing', icon: <FiBell />, path: '/candidate/jobs' },
    { key: 'messages', label: 'Messages', icon: <FiMessageCircle />, path: '/candidate/messages' },
    { key: 'shortlisted', label: 'Shortlisted Jobs', icon: <FiHeart />, path: '/candidate/shortlisted' },
    { key: 'cv', label: 'CV Manager', icon: <FiFileText />, path: '/candidate/cv-manager' },
   
  ],
  superadmin: [
    { key: 'company', label: 'SuperAdmin Profile', icon: <FiUser />, path: '/superadmin/profile' },
    { key: 'add', label: 'Approve Companies', icon: <FiUsers />, path: '/superadmin/approve-companies' },
    { key: 'manage', label: 'Manage Companies', icon: <FiUsers />, path: '/superadmin/manage-companies' },
    { key: 'jobs', label: 'Manage Jobs', icon: <FiBriefcase />, path: '/superadmin/manage-jobs' },
    { key: 'applicants', label: 'All Applicants', icon: <FiUsers />, path: '/superadmin/applicants' },
    { key: 'shortlisted', label: 'Shortlisted Resumes', icon: <FiHeart />, path: '/superadmin/shortlisted' },
    { key: 'view', label: 'View Profile', icon: <FiUser />, path: '/superadmin/view-profile' }
  ],
  admin: [
    { key: 'dashboard', label: 'Company Dashboard', icon: <FiBarChart2 />, path: '/admin/dashboard' },
    { key: 'post', label: 'Post a New Job', icon: <FiPlusSquare />, path: '/admin/post-job' },
    { key: 'manage', label: 'Manage Employees', icon: <FiUsers />, path: '/admin/manage-employees' },
    { key: 'jobs', label: 'Manage Jobs', icon: <FiBriefcase />, path: '/admin/manage-jobs' },
    { key: 'applicants', label: 'All Applicants', icon: <FiUserCheck />, path: '/admin/applicants' },
    { key: 'shortlisted', label: 'Shortlisted Resumes', icon: <FiHeart />, path: '/admin/shortlisted' }
  ],
  employee: [
    { key: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 />, path: '/employee/dashboard' },
    { key: 'post', label: 'Post a New Job', icon: <FiPlusSquare />, path: '/employee/post-job' },
    { key: 'manage-jobs', label: 'Manage Jobs', icon: <FiBriefcase />, path: '/employee/manage-jobs' },
    { key: 'applicants', label: 'All Applicants', icon: <FiUsers />, path: '/employee/applicants' },
    { key: 'shortlisted', label: 'Shortlisted Resumes', icon: <FiHeart />, path: '/employee/shortlisted' },
    { key: 'resume-alerts', label: 'Resume Alerts', icon: <FiBell />, path: '/employee/resume-alerts' }
  ]
};


  

  const menu = [
    ...commonItems,
    ...(roleSpecificMenu[role] || []),

  ];

  
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
            {menu.map(({ key, label, icon,path, isLogout }) => (
              <li key={key}>
                <button
                  onClick={() => {
                   
                      
                   
                      setActiveTab(key);
                      navigate(`${path}`);
                      setSidebarOpen(false);
                    }
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150
                ${activeTab === key && !isLogout
                      ? 'bg-blue-100 text-blue-800'
                      : isLogout
                        ? 'hover:bg-red-50 text-gray-600 hover:text-red-700'
                        : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700'
                    }
          `}
                >
                  

                  <span className={`text-lg ${activeTab === key && !isLogout ? 'text-blue-700' : ''}`}>
                    {icon}
                  </span>
                  <span className="font-medium text-sm truncate">{label}</span>
                </button>
              </li>
            ))}
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


        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto ">
            <div className=" rounded-lg">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
