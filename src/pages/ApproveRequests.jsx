import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';

const ApproveRequests = () => {
  const [pendingCompanies, setPendingCompanies] = useState([]);

  useEffect(() => {
    const fetchPendingCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiClient.get('/superadmin/company/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allCompanies = res.data.companies || [];

        console.log(allCompanies);
        
        const pending = allCompanies.filter(company => company.status === 'pending');
        setPendingCompanies(pending);
      } catch (err) {
        console.error('Error fetching pending companies:', err);
        toast.error('Failed to fetch pending companies.');
      }
    };

    fetchPendingCompanies();
  }, []);

  const handleStatusUpdate = async (companyId, status) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.patch(`/superadmin/company/approve/${companyId}`, {
        currStatus: status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Company ${status === 'approved' ? 'approved' : 'rejected'}!`);
      setPendingCompanies(prev => prev.filter(c => c._id !== companyId));
    } catch (err) {
      console.error(`Error updating company status to ${status}:`, err);
      toast.error(`Failed to ${status} company.`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📋 Pending Company Approvals</h2>

      {pendingCompanies.length === 0 ? (
        <p className="text-center text-gray-500">✅ No pending approvals.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full table-auto bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <th className="px-6 py-3 text-left rounded-tl-xl">Company Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingCompanies.map((company, index) => (
                <tr
                  key={company._id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100 transition-all'}
                >
                  <td className="px-6 py-4 font-medium">{company.name}</td>
                  <td className="px-6 py-4">{company.email}</td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(company._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(company._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApproveRequests;
