import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import Pagination from './hooks/Pagination';
import {
  FiSearch,
  FiUsers,
  FiMail,
  FiCheckCircle,
  FiEye,
  FiStar,
} from 'react-icons/fi';

const SuperCompanyManage = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
     
      const res = await apiClient.get('/superadmin/company/all');
      setAllCompanies(res.data.companies || []);
    } catch  {
      toast.error('Failed to load companies');
    }
  };

  const approvedCompanies = allCompanies.filter(
    (c) =>
      c.status === 'approved' &&
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(approvedCompanies.length / itemsPerPage);
  const paginatedCompanies = approvedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <FiUsers className="text-indigo-600" /> Approved Companies
          </h2>
          <div className="relative w-full sm:max-w-xs mt-4 sm:mt-0">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table or Empty Message */}
        {approvedCompanies.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No approved companies found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200">
              <table className="min-w-full bg-white text-gray-800">
                <thead className="bg-indigo-50 text-indigo-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-sm">Company</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">Email</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">Applicants</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">Shortlisted</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCompanies.map((company, idx) => (
                    <tr
                      key={company._id}
                      className={
                        idx % 2 === 0
                          ? 'bg-white hover:bg-gray-100'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }
                    >
                      <td className="px-6 py-4 flex items-center gap-2 font-medium">
                        <FiUsers className="text-indigo-600" /> {company.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiMail className="text-blue-600" />
                          <span>{company.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-100">
                          <FiCheckCircle /> APPROVED
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/superadmin/manage-applicants-view`, {
                              state: { companyId: company._id },
                            })
                          }
                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-xs shadow"
                        >
                          <FiEye /> View
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/superadmin/shortlisted-applicants`, {
                              state: { companyId: company._id },
                            })
                          }
                          className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded-full text-xs shadow"
                        >
                          <FiStar /> Shortlisted
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
    </div>
  );
};

export default SuperCompanyManage;
