import React, { useState } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import { PiChalkboardTeacher } from 'react-icons/pi'
import AddCourseButton from './AddCourseButton'
import ViewCourse from './ViewCourse'

const Course = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    price: '',
    level: '',
    featured: '',
    published: '',
  })

  return (
    <div className='p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen'>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <PiChalkboardTeacher className="text-blue-600 w-6 h-6" />
            Manage Courses
          </h2>

          {/* Search + Filter Toggle + Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search */}
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

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md text-sm font-medium w-full sm:w-auto"
            >
              <FiFilter className="w-4 h-4" />
              Filters
            </button>

            {/* Add Button */}
            <AddCourseButton />
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2 ">
            {/* Price Filter */}
            <select
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="px-4 py-2 rounded-md  bg-blue-100 text-gray-800 border border-blue-200 text-sm"
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>

            {/* Level Filter */}
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-4 py-2 rounded-md  bg-blue-100 text-gray-800 border border-blue-200 text-sm"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Featured Filter */}
            <select
              value={filters.featured}
              onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
              className="px-4 py-2 rounded-md  bg-blue-100 text-gray-800 border border-blue-200 text-sm"
            >
              <option value="">Featured & Non</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>

            {/* Published Filter */}
            <select
              value={filters.published}
              onChange={(e) => setFilters({ ...filters, published: e.target.value })}
              className="px-4 py-2 rounded-md  bg-blue-100 text-gray-800 border border-blue-200 text-sm"
            >
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
          </div>
        )}

        {/* Course Grid */}
        <ViewCourse search={searchQuery} filters={filters} />
      </div>
    </div>
  )
}

export default Course
