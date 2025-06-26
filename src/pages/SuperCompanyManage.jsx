import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import Pagination from './hooks/Pagination';

const SuperCompanyManage = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    } catch (err) {
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
    } catch (err) {
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
      fetchCompanies(); // Refresh the list after update
    } catch (err) {
      console.error(`Error updating company status to ${status}:`, err);
      toast.error(`Failed to ${status} company.`);
    }
  };

  const filteredCompanies = allCompanies.filter(c => c.status === activeTab);
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage All Companies</h2>

      <div className="flex justify-center mb-6 gap-4">
        {['pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => {
              setActiveTab(status);
              setCurrentPage(1); // Reset page when tab changes
            }}
            className={`px-4 py-2 rounded-lg font-medium shadow ${
              activeTab === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredCompanies.length === 0 ? (
        <p className="text-center text-gray-500">No {activeTab} companies found.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow border rounded-xl">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-left">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCompanies.map((company, idx) => (
                  <tr key={company._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium">{company.name}</td>
                    <td className="px-6 py-4">{company.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[company.status]}`}
                      >
                        {company.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/superadmin/view-company/${company._id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        View
                      </button>

                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(company._id, 'approved')}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(company._id, 'rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(company._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};

export default SuperCompanyManage;
