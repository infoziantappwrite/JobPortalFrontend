import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { FiSearch, FiClock } from 'react-icons/fi';
import { GraduationCap } from 'lucide-react';

import InternalLoader from '../../components/InternalLoader';
import EmptyState from '../../components/EmptyState';
import Imageno from '../superadmin/image.png';
import Pagination from '../../pages/hooks/Pagination';

const formatCourseNameForUrl = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const MyCourses = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ price: '', level: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
  try {
    const res = await apiClient.get('/candidate/course/my-courses');
    setEnrollments(res.data.enrollments || []);  // ✅ FIXED HERE
    console.log('Enrolled courses:', res.data.enrollments);
  } catch (err) {
    console.error('Failed to fetch enrolled courses:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    if (!Array.isArray(enrollments)) return;

    let result = enrollments.filter((e) => e?.enrollment?.course);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(({ enrollment }) =>
        enrollment.course.title.toLowerCase().includes(q) ||
        enrollment.course.instructor?.toLowerCase().includes(q) ||
        enrollment.course.description?.toLowerCase().includes(q)
      );
    }

    if (filters.price) {
      result = result.filter(({ enrollment }) =>
        filters.price === 'free'
          ? enrollment.course.price === 'free' || enrollment.course.price === 0
          : enrollment.course.price !== 'free' && enrollment.course.price > 0
      );
    }

    if (filters.level) {
      result = result.filter(
        ({ enrollment }) =>
          enrollment.course.level?.toLowerCase() === filters.level
      );
    }

    setFilteredCourses(result || []);
    setCurrentPage(1);
  }, [searchQuery, filters, enrollments]);

  const paginatedCourses = Array.isArray(filteredCourses)
    ? filteredCourses.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
      )
    : [];

  const handleCourseClick = (course) => {
    if (user?.userType === 'candidate') {
      navigate(`/candidate/view-course/${formatCourseNameForUrl(course.title)}`, {
        state: { course },
      });
    }
  };

  if (loading) return <InternalLoader text="Loading your courses" />;

  return (
    <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header and Filters */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <GraduationCap className="text-blue-600 w-6 h-6" />
            My Courses
          </h2>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title or instructor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={filters.price}
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="px-4 py-2 rounded-md border w-1/2 border-blue-200 bg-blue-100 text-sm text-gray-700 shadow-sm"
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>

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

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <EmptyState title="You have not enrolled in any matching courses." />
        ) : (
          <>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  {paginatedCourses.map(({ enrollment }) => {
    const course = enrollment.course;
    const progress = Math.round(enrollment.progress || 0);
    const isCertified = enrollment.certificateIssued;

    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <svg
            key={i}
            className={`w-4 h-4 ${
              i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.06 3.268a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.06 3.268c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.06-3.268a1 1 0 00-.364-1.118L3.557 8.695c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.06-3.268z" />
          </svg>
        );
      }
      return stars;
    };

    return (
      <div
        key={course._id}
        onClick={() => handleCourseClick(course)}
        className="cursor-pointer hover:shadow-lg transition-all bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col shadow-sm group relative"
      >
        {/* Top Badges */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
          {progress === 100 && (
            <span className="bg-green-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow">
              Completed
            </span>
          )}
          {isCertified && (
            <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow">
              Certified
            </span>
          )}
        </div>

        <div className="relative">
          <img
            src={course.image || Imageno}
            alt={course.title}
            className="w-full h-40 object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = Imageno;
            }}
          />
        </div>

        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-blue-800 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">{renderStars(course.rating || 0)}</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-blue-600 font-semibold mt-1">
              Progress: {progress}%
            </div>
          </div>
        </div>
      </div>
    );
  })}
            </div>



            {/* Pagination */}
            <div className="pt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCourses.length / coursesPerPage)}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
