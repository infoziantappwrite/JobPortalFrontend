import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { FiSearch, FiClock } from 'react-icons/fi';
import {  GraduationCap } from 'lucide-react'; // ✅ VALID

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
      setEnrollments(res.data.enrollments || []);
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
    let result = enrollments.map((e) => e.course);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(q) ||
          course.instructor?.toLowerCase().includes(q) ||
          course.description?.toLowerCase().includes(q)
      );
    }

    if (filters.price) {
      result = result.filter((c) =>
        filters.price === 'free' ? c.price === 0 : c.price > 0
      );
    }

    if (filters.level) {
      result = result.filter((c) => c.level?.toLowerCase() === filters.level);
    }

    setFilteredCourses(result);
    setCurrentPage(1); // reset page on filter change
  }, [searchQuery, filters, enrollments]);

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handleCourseClick = (course) => {
    if (user?.userType === 'candidate') {
      navigate(`/candidate/view-course/${formatCourseNameForUrl(course.title)}`, {
        state: { course },
      });
    }
  };

  if (loading) return <InternalLoader text="Loading your courses..." />;

  return (
    <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header and Filters */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            < GraduationCap className="text-blue-600 w-6 h-6" />
            My Courses
          </h2>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search input */}
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

            {/* Filters */}
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
          <EmptyState text="You have not enrolled in any matching courses." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseClick(course)}
                  className="cursor-pointer hover:shadow-md transition bg-white border border-blue-100 rounded-xl overflow-hidden flex flex-col"
                >
                  <img
                    src={course.image || Imageno}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = Imageno;
                    }}
                  />
                  <div className="p-4 space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-teal-700">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </div>
                </div>
              ))}
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
