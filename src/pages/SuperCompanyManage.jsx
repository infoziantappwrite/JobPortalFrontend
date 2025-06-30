import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import Pagination from './hooks/Pagination';
import {
  RotateCcw,
  Search,
  Building2,
  Eye,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';

const SuperCompanyManage = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiClient.get('/superadmin/company/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCompanies(res.data.companies || []);
    } catch {
      toast.error('Failed to load companies');
    }
  };

  const handleDelete = async (companyID) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/superadmin/company/${companyID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Company deleted successfully');
      fetchCompanies();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleStatusUpdate = async (companyId, status) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.patch(`/superadmin/company/approve/${companyId}`, {
        currStatus: status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Company ${status === 'approved' ? 'approved' : 'rejected'}!`);
      fetchCompanies();
    } catch {
      toast.error(`Failed to ${status} company.`);
    }
  };

  const filteredCompanies = allCompanies.filter(c =>
    (activeTab === 'all' || c.status === activeTab) &&
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusColors = {
    approved: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    rejected: 'text-red-600 bg-red-100',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <Building2 className="text-blue-600 w-5 h-5" />
            Company Management
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company name"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
              />
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Dropdown Filter */}
        <div className="flex justify-start mb-6">
          <label className="text-sm font-medium text-blue-700 mr-3 self-center">
            Filter by Status:
          </label>
          <div className="relative w-56">
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none px-4 py-2 pr-10 rounded-lg border border-blue-300 bg-white text-sm text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Dropdown arrow icon */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-blue-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            No {activeTab} companies found.
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
              <div className="hidden sm:grid grid-cols-4 text-sm font-semibold text-blue-700 bg-blue-100 pl-8 py-4 rounded-t-lg">
                <div>Name</div>
                <div>Email</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              <div className="divide-y">
                {paginatedCompanies.map((company) => (
                  <div
                    key={company._id}
                    className="grid grid-cols-1 sm:grid-cols-4 px-6 py-3 gap-4 items-center"
                  >
                    <div className="font-medium text-gray-800">{company.name}</div>
                    <div className="text-sm text-gray-700">{company.email}</div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[company.status]}`}>
                        {company.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/superadmin/view-company/${company._id}`)}
                        className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition"
                        title="View Company"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>

                      {company.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(company._id, 'approved')}
                            className="p-2 bg-green-50 rounded-full hover:bg-green-100 transition"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>

                          <button
                            onClick={() => handleStatusUpdate(company._id, 'rejected')}
                            className="p-2 bg-yellow-50 rounded-full hover:bg-yellow-100 transition"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-yellow-600" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(company._id)}
                        className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperCompanyManage;
