import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const navigate = useNavigate()

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-blue-100 shadow-sm hover:shadow-lg cursor-pointer transition"
      onClick={() => navigate(`/superadmin/course/${course._id}`)} // update route as needed
    >
      {/* Image + badges */}
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
            {course.price === 'free' ? 'Free' : 'Paid'}
          </span>
          {course.featured && (
            <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full border border-teal-300">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <img
            src="/google-icon.svg" // use org logo or fallback
            alt="Logo"
            className="w-5 h-5"
          />
          <span className="text-xs text-gray-600 font-medium">{course.instructor}</span>
        </div>

        <h3 className="text-blue-700 font-semibold text-base line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {course.description}
        </p>
      </div>
    </div>
  )
}

export default CourseCard
