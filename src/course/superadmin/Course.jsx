import React, { useState } from 'react'
import { FiBook, FiSearch } from 'react-icons/fi'
import AddCourseButton from "./AddCourseButton"
import ViewCourse from './ViewCourse';
import { PiChalkboardTeacher } from 'react-icons/pi';


const Course = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen'>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Row with spaced content */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <PiChalkboardTeacher className="text-blue-600 w-6 h-6" />
            Manage Courses
          </h2>

          {/* Right: Search + Button */}
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

            <AddCourseButton />
          </div>
        </div>

        {/* Course content */}
        <ViewCourse search={searchQuery} />

      </div>
    </div>
  )
}

export default Course
