import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  FiUser, FiBarChart2, FiMenu, FiX, FiLock
} from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('myprofile');
 const { user,loading} = useUser(); // ✅ Get user and loading state



  
  const role = user?.userType?.toLowerCase();
 // Get the role dynamically (candidate, admin, etc.)

  // Define role-specific menu items dynamically
  const roleSpecificMenu = {
    candidate: [
      { key: 'myprofile', label: 'My Profile', icon: <FiUser />, path: `/${role}/profileview/myprofile` },
      { key: 'editprofile', label: 'Edit Profile', icon: <FiBarChart2 />, path: `/${role}/profileview/editprofile` },
    ],
    company: [
       { key: 'myprofile', label: 'My Profile', icon: <FiUser />, path: `/${role}/profileview/myprofile` },
      { key: 'editprofile', label: 'Edit Profile', icon: <FiBarChart2 />, path: `/${role}/profileview/editprofile` },
    ],
    // Other roles can be added here if necessary
  };

  // Define common menu items that will appear for all roles
  const commonMenu = [
    // Only add "My Profile" here for roles other than candidate
    ...(role !== 'candidate' && role !== 'company' ? [{ key: 'myprofile', label: 'My Profile', icon: <FiUser />, path: `/${role}/profileview/myprofile` }] : []),
    { key: 'changepassword', label: 'Change Password', icon: <FiLock />, path: `/${role}/profileview/changepassword` },
  ];

  // Merge the role-specific menu and common menu
  const menu = [...(roleSpecificMenu[role] || []), ...commonMenu];

  // Detect active tab from URL
  useEffect(() => {
    const path = location.pathname;
    const matchedItem = menu.find(item => path.includes(item.key));
    if (matchedItem) {
      setActiveTab(matchedItem.key);
    } else {
      setActiveTab('myprofile'); // fallback default
    }
  }, [location.pathname, menu]); // added 'menu' dependency to ensure useEffect works correctly
 if (!user) {
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Please log in to access the dashboard.
      </p>
    );
  }
  if (loading) {
  return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
        <div className="w-8" />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg w-72 z-40 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:w-64 lg:w-72 md:shadow-md flex flex-col`}
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
          <p className="text-indigo-100 text-sm mt-1 capitalize">View & Edit your profile here</p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-4">
            {menu.map(({ key, label, icon, path }) => (
              <li key={key}>
                <button
                  onClick={() => {
                    setActiveTab(key);
                    navigate(path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150
                    ${activeTab === key ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700'}`}
                >
                  <span className={`text-lg ${activeTab === key ? 'text-blue-700' : ''}`}>{icon}</span>
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
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            <div className="rounded-lg">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
