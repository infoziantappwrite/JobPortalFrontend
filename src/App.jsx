import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import PostJob from './pages/PostJob';
import JobList from './components/JobList';
import ApproveRequests from './pages/ApproveRequests';
import VerifySuccess from './pages/VerifySuccess';
import VerifyFailed from './pages/VerifyFailed';
import CreateEmployee from './pages/CreateEmployee';
import EmployeeList from './pages/EmployeeList';
import Companies from './pages/Companies';
import AboutMe from './pages/AboutMe';
import About from './pages/About';
import AllJobs from './components/AllJobs';
import DashboardLayout from './components/DashboardLayout';
import ProfileSidebar from './components/ProfileSidebar';
import JobApplicationForm from './components/JobApplicationForm';
import { ToastContainer } from 'react-toastify';
import DashboardEMP from './employee/DashboardEMP';
import EditProfile from './pages/EditProfile';
import AppliedJobs from './pages/AppliedJobs';
import Shortlisted from './pages/ShortlistedCandidates';
import Applicants from './pages/Applicants';
import ChangePass from './pages/ChangePass';
import ShortlistedJobs from './pages/ShortlistedJobs';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  // user state to track logged in user info
  const [user, setUser] = useState(null);

  // on app mount, get user info from localStorage (if any)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // logout handler clears user state and localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };


  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/verify-failed" element={<VerifyFailed />} />
          <Route path="/register/candidate" element={<Register role="candidate" />} />
          <Route path="/register/company" element={<Register role="admin" />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/employee/profile" element={<AboutMe />} />
          <Route path="/candidate/profile" element={<AboutMe />} />
          {/* <Route path="/candidate/profileview" element={<ProfileSidebar />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<AllJobs />} />

          <Route
            path="/jobs/all"
            element={
              <ProtectedRoute roles={['candidate', 'employee', 'admin']}>
                <JobList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/postjob"
            element={
              <ProtectedRoute roles={['admin', 'employee']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-employee"
            element={
              <ProtectedRoute roles={['admin']}>
                <CreateEmployee />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-employees"
            element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <EmployeeList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-companies"
            element={
              <ProtectedRoute roles={['superadmin']}>
                <Companies />
              </ProtectedRoute>
            }
          />

          <Route path="/apply/:jobId" element={<JobApplicationForm />} />

          <Route
            path="/approvals"
            element={
              <ProtectedRoute user={user} roles={['superadmin']}>
                <ApproveRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedRoute user={user} roles={['employee']}>
                <DashboardLayout user={user} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardEMP/>} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<JobList/>} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route path="resume-alerts" element={<div>Resume Alerts</div>} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} roles={['admin']}>
                <DashboardLayout user={user} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Admin Dashboard</div>} />
            <Route path="manage-employees" element={<EmployeeList />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<JobList/>} />
            <Route path="create-employees" element={<CreateEmployee />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route path="resume-alerts" element={<div>Resume Alerts</div>} />
          </Route>

           <Route
            path="/superadmin"
            element={
              <ProtectedRoute user={user} roles={['superadmin']}>
                <DashboardLayout user={user} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ApproveRequests/>} />
            </Route>

          <Route
            path="/candidate"
            element={
              <ProtectedRoute user={user} roles={['candidate']}>
                <DashboardLayout user={user} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>candidate Dashboard</div>} />
            <Route path="jobs" element={<JobList user={user} />} />
            <Route path="resume" element={<div>My Resume</div>} />
            <Route path="applied" element={<AppliedJobs user={user} />} />
            <Route path="view-edit-profile" element={<EditProfile user={user} />} />
            <Route path="alerts" element={<div>Job Alerts</div>} />
            <Route path="messages" element={<div>Messages</div>} />
            <Route path="shortlisted" element={<ShortlistedJobs user={user} />} />
            <Route path="cv-manager" element={<div>CV Manager</div>} />
            <Route path="change-password" element={<div>Change Password</div> }/>
          </Route>

          <Route path="/candidate/profileview" element={<ProfileSidebar user={user} />}>
            <Route index element={<AboutMe />} />
            <Route path="myprofile" element={<AboutMe />} />
            <Route path="editprofile" element={<EditProfile user={user} />} />
            <Route path="changepassword" element={<ChangePass user={user} />} />
          </Route>

          <Route path="/employee/profileview" element={<ProfileSidebar user={user} />}>
            <Route index element={<AboutMe />} />
            <Route path="myprofile" element={<AboutMe />} />
            <Route path="changepassword" element={<ChangePass user={user} />} />
          </Route>

          <Route path="/admin/profileview" element={<ProfileSidebar user={user} />}>
            <Route index element={<AboutMe />} />
            <Route path="myprofile" element={<AboutMe />} />
            <Route path="changepassword" element={<ChangePass user={user} />} />
          </Route>

          <Route path="/superadmin/profileview" element={<ProfileSidebar user={user} />}>
            <Route index element={<AboutMe />} />
            <Route path="myprofile" element={<AboutMe />} />
            <Route path="changepassword" element={<ChangePass user={user} />} />
          </Route>



          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen bg-white text-gray-800">
                <div className="text-center px-6">
                  <h1 className="text-7xl font-extrabold text-gray-900 mb-4">404</h1>
                  <p className="text-2xl font-semibold mb-2">Page Not Found</p>
                  <p className="text-sm text-gray-500 mb-6">
                    The page you’re looking for doesn’t exist or was moved.
                  </p>
                  <a
                    href="/"
                    className="inline-block px-6 py-2 rounded-md text-white font-medium bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 transition"
                  >
                    ⬅ Go to Home
                  </a>
                </div>
              </div>
            }
          />




          {/* Add PostJob page route if you have one */}
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
