import React, { useState } from 'react'
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/apiClient'
import { toast } from 'react-toastify'

const CourseActions = ({ course, fetchCourses }) => {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleView = () => {
    navigate(`/superadmin/view-course/${course._id}`)
  }

  const handleEdit = () => {
    navigate(`/superadmin/edit-course/${course._id}`)
  }

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/superadmin/course/${course._id}`, {
        withCredentials: true,
      })
      toast.success(`Course "${course.title}" deleted successfully!`)
      fetchCourses()
    } catch (err) {
      console.error('Error deleting course:', err)
      toast.error('Something went wrong')
    } finally {
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleView}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-blue-200 text-blue-600 hover:bg-blue-300 transition"
        >
          <FiEye className="w-4 h-4" />
          View
        </button>

        <button
          onClick={handleEdit}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-teal-100 text-teal-600 hover:bg-teal-300 transition"
        >
          <FiEdit className="w-4 h-4" />
          Edit
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-red-100 text-red-600 hover:bg-red-300 transition"
        >
          <FiTrash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete <strong>{course.title}</strong>?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  )
}

export default CourseActions
