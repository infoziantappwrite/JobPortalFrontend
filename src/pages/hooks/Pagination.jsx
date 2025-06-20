import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-3 py-1 rounded border ${
          i === currentPage
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-indigo-600 hover:bg-indigo-100'
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {pages}
    </div>
  );
};

export default Pagination;
