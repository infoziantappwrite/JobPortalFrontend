import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const EditCoursePage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const course = state?.course

  if (!course) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-semibold">Course data not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow space-y-4">
      <p className="text-sm text-purple-600 font-semibold border border-purple-300 bg-purple-50 px-3 py-2 rounded">
        ✏️ This edit page is currently under development.
      </p>

      <h1 className="text-2xl font-bold text-teal-800">Editing: {course.title}</h1>

      <ul className="text-sm text-gray-600 space-y-1">
        <li><strong>Instructor:</strong> {course.instructor}</li>
        <li><strong>Level:</strong> {course.level}</li>
        <li><strong>Duration:</strong> {course.duration}</li>
        <li><strong>Price:</strong> {course.price}</li>
        <li><strong>Tags:</strong> {course.tags?.join(', ')}</li>
        <li><strong>Enrolled:</strong> {course.enrollmentCount || 0}</li>
      </ul>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 text-white bg-teal-600 rounded hover:bg-teal-700"
      >
        Go Back
      </button>
    </div>
  )
}

export default EditCoursePage
