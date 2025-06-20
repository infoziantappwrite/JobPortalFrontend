import { Bell, Filter } from 'lucide-react';
import { useState } from 'react';

const JobAlertHeader = ({ filters, handleChange, predefinedOptions, user }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      {/* Title + Search + Filter Toggle */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <Bell className="text-blue-600 w-5 h-5" />
          {user?.userType?.toLowerCase() === "candidate"
            ? "My Job Alerts"
            : "Posted Jobs"}
        </h2>

        {/* Unified Search Bar + Filter Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-2/3">
          <input
            type="text"
            value={filters.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Search by title, city or specialisms"
            className="flex-grow bg-white px-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm"
          />
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 transition-all duration-300 ease-in-out">
          

          {Object.entries(predefinedOptions).map(([field, options]) => (
            <select
              key={field}
              value={filters[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="bg-blue-50 px-4 py-2 rounded-md text-sm text-gray-700 border border-blue-100"
            >
              <option value="">{`All ${field.charAt(0).toUpperCase() + field.slice(1)}`}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}

          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            className="bg-blue-50 px-4 py-2 rounded-md text-sm text-gray-700 border border-blue-100"
          >
            <option value="postedAt">Sort by Date</option>
            <option value="offeredSalary">Sort by Salary</option>
            <option value="title">Sort by Title</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => handleChange("sortOrder", e.target.value)}
            className="bg-blue-50 px-4 py-2 rounded-md text-sm text-gray-700 border border-blue-100"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      )}
    </>
  );
};

export default JobAlertHeader;
