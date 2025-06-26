import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import Pagination from './hooks/Pagination';

const SuperCompanyManage = () => {
  const [allCompanies, setAllCompanies] = useState([]);
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

  const approvedCompanies = allCompanies.filter(c => c.status === 'approved');
  const totalPages = Math.ceil(approvedCompanies.length / itemsPerPage);
  const paginatedCompanies = approvedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Approved Companies</h2>

      {approvedCompanies.length === 0 ? (
        <p className="text-center text-gray-500">No approved companies found.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow border rounded-xl">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-left">
                <tr>
                  <th className="px-6 py-3">Company Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Applicant View</th>
                  <th className="px-6 py-3">Shortlisted Applicants</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCompanies.map((company, idx) => (
                  <tr key={company._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-left">{company.name}</td>
                    <td className="px-6 py-4 text-left">{company.email}</td>
                    <td className="px-6 py-4 text-left">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-600 bg-green-100">
                        APPROVED
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button
                        onClick={() => navigate(`/superadmin/manage-applicants-view`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        View Applicants
                      </button>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button
                        onClick={() => navigate(`/superadmin/shortlisted-applicants`)}
                        className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 text-xs"
                      >
                        Shortlisted Applicants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
