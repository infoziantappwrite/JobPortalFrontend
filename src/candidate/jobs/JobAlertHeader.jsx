import { Bell, Filter, RotateCcw,Search } from 'lucide-react';
import { useState } from 'react';

const JobAlertHeader = ({ filters, handleChange, predefinedOptions, user, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const defaultFilters = {
    title: "",
    location: "",
    gender: "",
    experience: "",
    qualification: "",
    jobType: "",
    careerLevel: "",
    industry: "",
    city: "",
    specialisms: "",
    sortBy: "postedAt",
    sortOrder: "desc",
  };


  return (
    <>
      {/* Title + Search + Filter Toggle */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6 w-full max-w-6xl mx-auto">
  {/* Heading */}
  <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
    <Bell className="text-blue-600 w-5 h-5" />
    {user?.userType?.toLowerCase() === "candidate"
      ? "Job Alerts"
      : "Posted Jobs"}
  </h2>

  {/* Search + Buttons Container */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:max-w-2xl">
    {/* Search Input */}
    <div className="relative w-full">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  <input
    type="text"
    value={filters.title}
    onChange={(e) => handleChange("title", e.target.value)}
    placeholder="Search by title, city or specialisms"
    className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
  />
</div>

    {/* Buttons */}
    <div className="flex w-full sm:w-auto flex-wrap sm:flex-nowrap gap-2">
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="flex-1 sm:flex-none min-w-[48%] sm:min-w-[unset] flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md text-sm font-medium"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      <button
        onClick={() => setFilters(defaultFilters)}
        className="flex-1 sm:flex-none min-w-[48%] sm:min-w-[unset] flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md text-sm font-medium"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
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
