import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const SuperCompanyManage = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedCompany, setSelectedCompany] = useState(null);
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

  const openCompanyModal = async (companyID) => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiClient.get(`/superadmin/company/${companyID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCompany(res.data.company);
    } catch (err) {
      toast.error('Failed to fetch company');
    }
  };

  const filteredCompanies = allCompanies.filter(c => c.status === activeTab);

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
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-lg font-medium shadow ${activeTab === status
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
              {filteredCompanies.map((company, idx) => (
                <tr key={company._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-left">{company.name}</td>
                  <td className="px-6 py-4 text-left">{company.email}</td>
                  <td className="px-6 py-4 text-left">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[company.status]}`}>
                      {company.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left space-x-2">
                    <button
                      onClick={() => navigate(`/superadmin/view-company/${company._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      View
                    </button>

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
      )}

      {/* Modal for View Only */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">View Company</h3>
            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                type="text"
                readOnly
                value={selectedCompany.name}
              />
              <input
                className="w-full border p-2 rounded"
                type="email"
                readOnly
                value={selectedCompany.email}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperCompanyManage;
