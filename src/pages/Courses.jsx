import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock } from 'react-icons/fi';
import { PiChalkboardTeacher } from 'react-icons/pi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import apiClient from '../api/apiClient';
import Pagination from '../pages/hooks/Pagination';
import Imageno from '../course/superadmin/image.png';
import InternalLoader from "../components/InternalLoader";
import EmptyState from "../components/EmptyState";

const Courses = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const limit = 9;

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get('/common/course', {
        params: {
          title: search,
          price: priceFilter,
          level: levelFilter,
          rating: ratingFilter,
          page,
          limit,
        },
      });
      setCourses(res.data.courses);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(pagination.currentPage);
  }, [search, priceFilter, levelFilter, ratingFilter, pagination.currentPage]);

  const renderStars = (rating = 0) => (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: 5 }, (_, i) => {
        if (rating >= i + 1) return <FaStar key={i} />;
        if (rating >= i + 0.5) return <FaStarHalfAlt key={i} />;
        return <FaRegStar key={i} />;
      })}
    </div>
  );

  return (
    <div className='p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen'>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header and Filters */}
        {/* Header Title + Subtitle */}
<div className="text-center mb-10">
  <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
    Explore All Courses
  </h1>
  <p className="mt-2 text-gray-600 text-lg">
    Search, filter, and discover top-quality learning opportunities tailored to your goals.
  </p>
</div>

{/* Filters + Search Section */}
<div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
  {/* Left Section - Filters */}
  <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
    {/* Price Filter */}
    <select
      value={priceFilter}
      onChange={(e) => setPriceFilter(e.target.value)}
      className="px-4 py-2 rounded-md border bg-gradient-to-br from-teal-600 to-blue-600 text-white text-sm shadow-sm w-full sm:w-44"
    >
      <option className="text-gray-700" value="">All Prices</option>
      <option className="text-gray-700" value="free">Free</option>
      <option className="text-gray-700" value="paid">Paid</option>
    </select>

    {/* Level Filter */}
    <select
      value={levelFilter}
      onChange={(e) => setLevelFilter(e.target.value)}
      className="px-4 py-2 rounded-md border bg-gradient-to-br from-teal-600 to-blue-600 text-white text-sm shadow-sm w-full sm:w-44"
    >
      <option className="text-gray-700" value="">All Levels</option>
      <option className="text-gray-700" value="beginner">Beginner</option>
      <option className="text-gray-700" value="intermediate">Intermediate</option>
      <option className="text-gray-700" value="advanced">Advanced</option>
    </select>

    {/* Rating Filter */}
    <select
      value={ratingFilter}
      onChange={(e) => setRatingFilter(e.target.value)}
      className="px-4 py-2 rounded-md border bg-gradient-to-br from-teal-600 to-blue-600 text-white text-sm shadow-sm w-full sm:w-44"
    >
      <option className="text-gray-700" value="">Any Rating</option>
      <option className="text-gray-700" value="4">4 ★ & up</option>
      <option className="text-gray-700" value="3">3 ★ & up</option>
      <option className="text-gray-700" value="2">2 ★ & up</option>
    </select>
  </div>

  {/* Right Section - Search */}
  <div className="relative w-full sm:w-80">
    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search by title or instructor"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
    />
  </div>
</div>


        {/* Course Grid */}
        {loading ? (
          <InternalLoader text='Loading Courses' />
        ) : courses.length === 0 ? (
          <EmptyState

            title="No data found"
            message="Try adjusting your filters or search criteria."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
  {courses.map((course) => (
    <div
      key={course._id}
      onClick={() => navigate(`/course-details/${course._id}`)}
      className="relative bg-white border border-blue-100 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all overflow-hidden cursor-pointer"
    >
      {/* Labels */}
      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
        {course.price?.toLowerCase() === 'free' ? 'Free' : 'Paid'}
      </div>
      <div
        className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded z-10 ${
          course.level === 'beginner'
            ? 'bg-green-600'
            : course.level === 'intermediate'
            ? 'bg-yellow-600'
            : 'bg-red-600'
        }`}
      >
        {course.level}
      </div>

      {/* Course Image */}
      <img
        src={course.image || Imageno}
        alt={course.title}
        className="w-full h-44 object-cover"
        onError={(e) => (e.target.src = Imageno)}
      />

      {/* Card Content */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FiClock className="text-blue-500" />
            {course.duration}
          </span>
          {renderStars(course.rating || 0)}
        </div>
        <h3 className="font-semibold text-blue-800 text-lg line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
      </div>
    </div>
  ))}
</div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => fetchCourses(page)}
        />
      </div>
    </div>
  );
};

export default Courses;
