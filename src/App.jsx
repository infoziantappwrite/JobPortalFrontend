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
import EmployeeProfile from './pages/EmployeeProfile';
import AppliedJobs from './candidate/jobs/AppliedJobs';
import Shortlisted from './pages/ShortlistedCandidates';
import Applicants from './pages/Applicants';
import ChangePass from './pages/ChangePass';
import ShortlistedJobs from './candidate/jobs/ShortlistedJobs';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import GlobalLoader from './components/GlobalLoader';
import ViewProfile from './candidate/ViewProfile';
import EditProfilecandidate from './candidate/EditProfile';
import EditJob from './pages/EditJob';
import Job from './components/Job';
/*candidate jobs*/
import Jobalerts from './candidate/jobs/Jobalerts';
import Myresume from './candidate/jobs/Myresume';
import PublicRoute from './components/PublicRoute';
import EmployeeRegister from './pages/Auth/EmployeeRegister';
import EmployeeLogin from './pages/Auth/EmployeeLogin';
import SuperAdminLogin from './pages/Auth/SuperLogin';
import CVManager from './candidate/jobs/CVManager';
import ApproveEmployee from './pages/ApproveEmployee';
// Super Admin Management
import ApproveRequests from './pages/ApproveRequests';
import SuperCompanyManage from './pages/SuperCompanyManage';
import SuperEmployeeManage from './pages/SuperEmployeeManage';
import SuperCandidateManage from './pages/SuperCandidateManage';
import SuperCandidateViewPage from './pages/SuperAdminViewPage/SuperCandidateViewPage';
// Company Details
import CompanyProfileView from './pages/CompanyProfileSection/ViewProfile';
import CompanyEditProfile from './pages/CompanyProfileSection/EditProfile';
import Dashboard from './pages/CompanyProfileSection/Dashboard';
import CompanyDetails from './pages/CompanyDetails';


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
          <Route
            path="/register/employee"
            element={
              <PublicRoute>
                <EmployeeRegister />
              </PublicRoute>
            }
          />
          <Route
            path="/login/employee"
            element={
              <PublicRoute>
                <EmployeeLogin />
              </PublicRoute>
            }
          />

          <Route
            path="/login/admin/super"
            element={
              <PublicRoute>
                <SuperAdminLogin />
              </PublicRoute>
            }
          />









          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/verify-failed" element={<VerifyFailed />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/job/:slug" element={<Job />}/>
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:companyName" element={<CompanyDetails />} />



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
            <Route path="jobdetails" element={<JobDetails />} />
            <Route path="jobs-edit" element={<EditJob />} />
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-employees" element={<EmployeeList />} />
            <Route path="view-jobs" element={<Jobalerts />} />
            <Route path="create-employees" element={<CreateEmployee />} />
            <Route path='jobdetails' element={<JobDetails />}/>
            <Route path="applicants" element={<Applicants />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route path="approve-employees" element={<ApproveEmployee />} />
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
            <Route path="approve-companies" element={<ApproveRequests />} />
            <Route path="manage-companies" element={<SuperCompanyManage />} />
            <Route path="manage-employee" element={<SuperEmployeeManage />} />
            <Route path="manage-candidate" element={<SuperCandidateManage />} />
            <Route path="/superadmin/candidate/:id" element={<SuperCandidateViewPage />} />
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
            <Route path='jobdetails' element={<JobDetails />}/>
            <Route path="applied" element={<AppliedJobs />} />
            <Route path="messages" element={<div>Messages</div>} />
            <Route path="shortlisted" element={<ShortlistedJobs />} />
            <Route path="cv-manager" element={<CVManager />} />
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
            <Route index element={<EmployeeProfile />} />
            <Route path="myprofile" element={<EmployeeProfile />} />
            <Route path="changepassword" element={<ChangePass />} />
          </Route>

          <Route path="/company/profileview" element={<ProfileSidebar />}>
           <Route index element={<CompanyProfileView />} />
            <Route path="myprofile" element={<CompanyProfileView />} />
            <Route path="editprofile" element={<CompanyEditProfile />} />
            <Route path="changepassword" element={<ChangePass />} />
          </Route>

          <Route path="/superadmin/profileview" element={<ProfileSidebar />}>
            <Route index element={<div>My Profile</div>} />
            <Route path="myprofile" element={<div>My Profile</div>} />
            <Route path="changepassword" element={<ChangePass />} />
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
