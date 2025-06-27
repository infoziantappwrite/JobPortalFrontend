import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/apiClient'
import Pagination from '../../pages/hooks/Pagination'
import CourseActions from './CourseActions'
import { FiClock } from 'react-icons/fi'
import Imageno from "./image.png"
import { useUser } from '../../contexts/UserContext'
import EmptyState from '../../components/EmptyState'
import InternalLoader from "../../components/InternalLoader"
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'


const ViewCourse = ({ search }) => {
  const [courses, setCourses] = useState([]);
  const { user } = useUser();
  //console.log("User in ViewCourse:", user);
  const [loading, setLoading] = useState(true)

  const isCandidate = !user || user?.userType?.toLowerCase() === 'candidate';
  const isSuperAdmin = user?.userType === 'superAdmin'

  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 6
  const navigate = useNavigate()

  const fetchCourses = async () => {
    try {
      const res = await apiClient.get('/superadmin/course', {
        withCredentials: true,
      })
      setCourses(res.data.courses || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const title = course?.title?.toLowerCase() || ''
    const instructor = course?.instructor?.toLowerCase() || ''
    const topics = course?.topics?.join(',').toLowerCase() || ''
    const q = search?.toLowerCase() || ''
    return title.includes(q) || instructor.includes(q) || topics.includes(q)
  })


  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  const formatCourseNameForUrl = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  if (loading) {
    return (
      <InternalLoader text="Loading courses" />
    )
  }


  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 ">
      {/* Course Cards */}

      {currentCourses.length === 0 ? (
        <EmptyState
          title="Courses Not Available"
          message="Please check back later, some courses will be added soon."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          {currentCourses.map((course) => (
            <div
              key={course._id}
              onClick={() => {
                if (isCandidate) {
                  navigate(`/courses/${formatCourseNameForUrl(course.title)}`, {
                    state: { id: course._id },
                  });
                }
              }}
              className={`relative bg-blue-100 border border-blue-200 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col 
        ${isCandidate ? 'cursor-pointer' : 'cursor-default'} 
        hover:scale-[1.01]`}
            >
              {/* Badge for Free/Paid */}
              <div className="absolute top-2 right-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-semibold px-2 py-1 rounded-lg shadow-sm z-10">
                {course.price?.toLowerCase() === 'free' ? 'Free' : 'Paid'}
              </div>
              <div
                className={`absolute top-2 left-2 text-white text-sm font-semibold px-2 py-1 rounded-lg shadow-sm z-10 
    ${course.level === 'beginner'
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : course.level === 'intermediate'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-red-500 to-red-700'
                  }`}
              >
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </div>


              {/* Course Image */}
              <img
                src={ Imageno}// src={course.image || Imageno}
                alt={course.title}
                className="w-full h-44 object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Imageno;
                }}
              />

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  {/* Duration */}
                  <div className="flex items-center gap-2">
                    <FiClock className="text-blue-600" />
                    {course.duration}
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }, (_, i) => {
                      const rating = course.rating || 0
                      if (rating >= i + 1) {
                        return <FaStar key={i} />
                      } else if (rating >= i + 0.5) {
                        return <FaStarHalfAlt key={i} />
                      } else {
                        return <FaRegStar key={i} />
                      }
                    })}
                  </div>
                </div>
                <div>
                  <h3
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCandidate) {
                        navigate(`/courses/${formatCourseNameForUrl(course.title)}`, {
                          state: { id: course._id },
                        });
                      }
                    }}
                    className="text-blue-800 font-semibold text-xl line-clamp-2 hover:underline transition"
                  >
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                  {/* Add Tags if needed */}
                </div>
                {isSuperAdmin && (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
    {/* Enrollment Count */}
    <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-500 shadow-sm w-max">
      Enrolled: <strong>{course.enrollmentCount || 0}</strong>
    </span>

    {/* Action Buttons */}
    <CourseActions course={course} fetchCourses={fetchCourses} />
  </div>
)}

              </div>
            </div>
          ))}
        </div>
      )}



      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default ViewCourse
