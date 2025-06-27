import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { PiChalkboardTeacher } from 'react-icons/pi';
import ViewCourse from "../superadmin/ViewCourse";

const AllCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
      price: '',
      level: '',
      
    })

  return (
    <div className='p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen'>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Row */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <PiChalkboardTeacher className="text-blue-600 w-6 h-6" />
            All Courses
          </h2>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, subject or instructor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
              />
            </div>
            {/* Price and Level Filters */}

            <div className="flex items-center gap-3 w-full sm:w-auto">

            {/* Price Filter */}
            <select
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="px-4 py-2 rounded-md border w-1/2 border-blue-200 bg-blue-100 text-sm text-gray-700 shadow-sm"
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>

            {/* Level Filter */}
            <select
              value={filters.level}
               onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-4 py-2 rounded-md border w-1/2 border-blue-200 bg-blue-100 text-sm text-gray-700 shadow-sm"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
</div>

          </div>
        </div>

        {/* Courses */}
        <ViewCourse
          search={searchQuery}
         filters={filters}
        />
      </div>
    </div>
  );
};

export default AllCourses;
