import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import JobDetails from './pages/JobDetails';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import PostJob from './pages/PostJob';
import JobList from './components/JobList';
import VerifySuccess from './pages/VerifySuccess';
import VerifyFailed from './pages/VerifyFailed';
import CreateEmployee from './pages/CreateEmployee';
import EmployeeList from './pages/EmployeeList';
import Companies from './pages/Companies';
import About from './pages/About';
import AllJobs from './components/AllJobs';
import DashboardLayout from './components/DashboardLayout';
import ProfileSidebar from './components/ProfileSidebar';
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
import GlobalLoader from './components/GlobalLoader';
import ViewProfile from './candidate/ViewProfile';
import EditProfilecandidate from './candidate/EditProfile';
/*candidate jobs*/
import Jobalerts from './candidate/jobs/Jobalerts';
import Myresume from './candidate/jobs/Myresume';
import PublicRoute from './components/PublicRoute';

function App() {

  return (
    <Router>
      <GlobalLoader />
      <Navbar />
      <div className="min-h-screen pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/verify-failed" element={<VerifyFailed />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="jobdetails" element={<JobDetails />} />


          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute roles={['employee']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardEMP />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<JobList />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route path="resume-alerts" element={<div>Resume Alerts</div>} />
          </Route>
          {/* Employee Routes end */}

          {/* Company Routes */}
          <Route
            path="/company"
            element={
              <ProtectedRoute roles={['company']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Admin Dashboard</div>} />
            <Route path="manage-employees" element={<EmployeeList />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<JobList />} />
            <Route path="create-employees" element={<CreateEmployee />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route path="resume-alerts" element={<div>Resume Alerts</div>} />
          </Route>
          {/* Company Routes end */}

          {/* superadmin Routes */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute roles={['superAdmin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Dashboard</div>} />
          </Route>
          {/*superadmin Routes end*/}

          {/* candidate Routes */}
          <Route
            path="/candidate"
            element={
              <ProtectedRoute roles={['candidate']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>candidate Dashboard</div>} />
            <Route path="jobs" element={<Jobalerts />} />
            <Route path="resume" element={<Myresume />} />
            <Route path="applied" element={<AppliedJobs />} />
            <Route path="view-edit-profile" element={<EditProfile />} />
            <Route path="alerts" element={<div>Job Alerts</div>} />
            <Route path="messages" element={<div>Messages</div>} />
            <Route path="shortlisted" element={<ShortlistedJobs />} />
            <Route path="cv-manager" element={<div>CV Manager</div>} />
            <Route path="change-password" element={<div>Change Password</div>} />
          </Route>
          {/* candidate Routes end */}

          <Route path="/candidate/profileview" element={<ProfileSidebar />}>
            <Route index element={<ViewProfile />} />
            <Route path="myprofile" element={<ViewProfile />} />
            <Route path="editprofile" element={<EditProfilecandidate />} />
            <Route path="changepassword" element={<ChangePass />} />
          </Route>


          <Route path="/employee/profileview" element={<ProfileSidebar />}>
            <Route index element={<div>My Profile</div>} />
            <Route path="myprofile" element={<div>My Profile</div>} />
            <Route path="changepassword" element={<div>Change Password</div>} />
          </Route>

          <Route path="/company/profileview" element={<ProfileSidebar />}>
            <Route index element={<div>My Profile</div>} />
            <Route path="myprofile" element={<div>My Profile</div>} />
            <Route path="changepassword" element={<div>Change Password</div>} />
          </Route>

          <Route path="/superadmin/profileview" element={<ProfileSidebar />}>
            <Route index element={<div>My Profile</div>} />
            <Route path="myprofile" element={<div>My Profile</div>} />
            <Route path="changepassword" element={<div>Change Password</div>} />
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // ✅ key part for colored style
      />

    </Router>
  );
}

export default App;
