import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchX, Eye, Trash2, } from "lucide-react";
import apiClient from "../api/apiClient";
import Pagination from "./hooks/Pagination";
import InternalLoader from "../components/InternalLoader";
import EmptyState from "../components/EmptyState";
import { TbUserSquareRounded } from 'react-icons/tb';
import { FiBook, FiSearch } from 'react-icons/fi';

const SuperCandidateManage = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await apiClient.get("/superadmin/candidate");
      const data = res.data.candidates || [];
      setCandidates(data);
      setLoading(false);
    } catch {
      toast.error("Failed to load candidates");
    }
  };

  const handleDelete = async (id) => {
    
    try {
      await apiClient.delete(`/superadmin/candidate/${id}`);
      toast.success("Candidate deleted");
      fetchCandidates();
    } catch {
      toast.error("Failed to delete candidate");
    }
  };

  // Apply filters
  useEffect(() => {
    
    let result = candidates;

    if (startDate)
      result = result.filter((c) => new Date(c.createdAt) >= new Date(startDate));

    if (endDate)
      result = result.filter((c) => new Date(c.createdAt) <= new Date(endDate));

    if (search.trim()) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
    setCurrentPage(1);
    
  }, [search, startDate, endDate, candidates]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && filtered.length === 0) {
    return <InternalLoader text="Loading Candidates" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          {/* Left: Title */}
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <TbUserSquareRounded className="text-blue-600 w-6 h-6" />
            Manage Candidate 
          </h2>

          {/* Right: Filters + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
              />
            </div>

            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-32 text-sm text-gray-700 px-3 py-2 rounded-md border border-blue-200 bg-gradient-to-r from-teal-50 to-blue-50 shadow-sm"
            />

            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-32 text-sm text-gray-700 px-3 py-2 rounded-md border border-blue-200 bg-gradient-to-r from-teal-50 to-blue-50 shadow-sm"
            />
          </div>
        </div>







        {/* Table */}
        {filtered.length === 0 ? (
          <div className="min-h-[400px] flex flex-col justify-center items-center text-center text-gray-600  p-10 ">
            <SearchX className="w-12 h-12 mb-4 text-blue-500" />
            <h2 className="text-lg font-semibold mb-2">No Candidates Found</h2>
            <p className="text-sm text-gray-500">Try adjusting filters or search with different keywords.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-xl shadow border">
              <table className="min-w-full">
                <thead className="bg-blue-100 text-blue-700 text-sm">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Created At</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((c, i) => (
                    <tr
                      key={c._id}
                      className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                    >
                      <td className="py-3 px-4">{c.name}</td>
                      <td className="py-3 px-4">{c.email}</td>
                      <td className="py-3 px-4">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-medium ${c.emailVerified ? 'text-green-600' : 'text-red-500'
                            }`}
                        >
                          {c.emailVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center space-x-3">
                        <button
                          onClick={() => navigate(`/superadmin/candidate/${c._id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SuperCandidateManage;
