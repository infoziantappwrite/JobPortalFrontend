import { useState } from 'react';
import { FiMapPin, FiBriefcase } from 'react-icons/fi';

const CompanyGrid = ({ companies, handleClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalItems = companies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentCompanies = companies.slice(startIndex, endIndex);

  const randomColor = (str) => {
    const colors = ['#60A5FA', '#4ADE80', '#FBBF24', '#F87171', '#A78BFA'];
    return colors[str.charCodeAt(0) % colors.length];
  };

  const maxVisiblePages = 5;
  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  let endPage = startPage + maxVisiblePages - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  return (
    <div className="space-y-8">
      {/* Company Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentCompanies.map((c) => (
          <div
            key={c._id}
            onClick={() => handleClick(c)}
            className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <span className="text-xs text-green-600 font-semibold px-2 py-1 bg-green-100 rounded-full mb-3 inline-block">
              Featured
            </span>

            <div className="flex items-center justify-center mb-4">
              {c.companyLogo ? (
                <img
                  src={c.companyLogo}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-contain border"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: randomColor(c.name) }}
                >
                  {c.name?.[0] || 'C'}
                </div>
              )}
            </div>

            <h3 className="text-center font-semibold text-indigo-800 text-lg">{c.name}</h3>
            <p className="text-sm text-center text-gray-500 mt-1">
              <FiMapPin className="inline-block mr-1" /> {c.location || 'N/A'}
            </p>
            <p className="text-sm text-center text-gray-500 mt-1">
              <FiBriefcase className="inline-block mr-1" /> {c.primaryIndustry || 'Industry'}
            </p>
          </div>
        ))}

        {companies.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No companies match the selected filters.
          </p>
        )}
      </div>

      {/* Pagination Section */}
{companies.length > 0 && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
    {/* Summary */}
    <p className="text-sm text-center sm:text-left text-gray-600">
      Showing <strong>{startIndex + 1}</strong> to <strong>{endIndex}</strong> of{' '}
      <strong>{totalItems}</strong> companies &nbsp; | &nbsp;
      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
    </p>

    {/* Pagination Buttons */}
    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        First
      </button>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        Prev
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded border font-medium transition ${
            page === currentPage
              ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
              : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-200'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        Next
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        Last
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default CompanyGrid;
