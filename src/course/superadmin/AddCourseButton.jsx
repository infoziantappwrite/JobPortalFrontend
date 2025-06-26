import React from 'react'
import { FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const AddCourseButton = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/superadmin/add-course')
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md text-sm font-medium w-full sm:w-auto"
    >
      <FiPlus className="w-4 h-4" />
      Add New Course
    </button>
  )
}

export default AddCourseButton
