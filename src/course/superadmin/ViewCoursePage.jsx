
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import InternalLoader from '../../components/InternalLoader';
import {
  BookOpen, User, Clock, DollarSign, Layers, Users, BadgeCheck,
  ListVideo, PlayCircle, ChevronDown, ChevronRight, Tag, CalendarClock, Star,
  ArrowLeft, UploadCloud, Sparkles
} from 'lucide-react';
import Imageno from './image.png';
import { useUser } from '../../contexts/UserContext';
import EnrollButton from './EnrollButton';
import CourseCurriculum from "./CourseCurriculum";
import apiClient from '../../api/apiClient';

const ViewCoursePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialCourse = state?.course;
  const courseId = initialCourse?._id;
  const { user } = useUser();
  const [course, setCourse] = useState(initialCourse);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [courseCompleted, setCourseCompleted] = useState(false);

  const isSuperAdmin = user?.userType === 'superAdmin';


  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const courseInfo = [
    {
      icon: <User className="w-4 h-4 text-teal-600" />,
      label: 'Instructor',
      value: course.instructor,
      bg: 'from-teal-50 to-white',
      border: 'border-teal-200',
    },
    {
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      label: 'Duration',
      value: course.duration,
      bg: 'from-blue-50 to-white',
      border: 'border-blue-200',
    },
    {
      icon: <DollarSign className="w-4 h-4 text-yellow-600" />,
      label: 'Price',
      value: course.price,
      bg: 'from-yellow-50 to-white',
      border: 'border-yellow-200',
    },
    {
      icon: <Users className="w-4 h-4 text-green-600" />,
      label: 'Enrolled',
      value: course.enrollmentCount,
      bg: 'from-green-50 to-white',
      border: 'border-green-200',
    },
    {
      icon: <Star className="w-4 h-4 text-pink-600" />,
      label: 'Rating',
      value: course.rating,
      bg: 'from-pink-50 to-white',
      border: 'border-pink-200',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
      label: 'Featured',
      value: course.featured ? 'Yes' : 'No',
      bg: 'from-indigo-50 to-white',
      border: 'border-indigo-200',
    },
    {
      icon: <BadgeCheck className="w-4 h-4 text-gray-600" />,
      label: 'Published',
      value: course.isPublished ? 'Yes' : 'No',
      bg: 'from-gray-50 to-white',
      border: 'border-gray-300',
    },
    {
      icon: <CalendarClock className="w-4 h-4 text-rose-600" />,
      label: 'Created At',
      value: formatDate(course.createdAt),
      bg: 'from-rose-50 to-white',
      border: 'border-rose-200',
    },
    {
      icon: <CalendarClock className="w-4 h-4 text-violet-600" />,
      label: 'Updated At',
      value: formatDate(course.updatedAt),
      bg: 'from-violet-50 to-white',
      border: 'border-violet-200',
    },
  ];

  // Show all if admin, else hide last 3
  const visibleCourseInfo = isSuperAdmin ? courseInfo : courseInfo.slice(0, -3);

  const refetchCourse = useCallback(async () => {
    try {
      const res = await apiClient.get(`/common/course/${courseId}`);
      setCourse(res.data?.course || res.data);

      // Fetch enrollment status if candidate
      if (user?.userType === "candidate") {
        const statusRes = await apiClient.get(`/candidate/course/${courseId}/status`);
        setEnrolled(statusRes.data?.isEnrolled || false);
        setCompletedLessons(statusRes.data?.completedLessons || []);
        setCourseCompleted(statusRes.data?.completed || false);
      }
    } catch (err) {
      console.error("Failed to fetch course/status:", err);
    } finally {
      setLoading(false);
    }
  }, [courseId, user?.userType]);


  useEffect(() => {
    if (courseId) refetchCourse();
  }, [courseId]);

  if (loading) return <InternalLoader text='Loading Course Details' />;


  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-100 px-4">
        <p className="text-gray-500 text-lg font-semibold mb-4">Course data not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2 rounded-full shadow hover:opacity-90 transition"
        >
          <ArrowLeft className="inline w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-0 p-6 space-y-8">
      {/* IMAGE */}
      <div className="rounded-xl overflow-hidden shadow-lg relative">
        <img
          src={Imageno}// src={course.image || Imageno}
          alt={course.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = Imageno;
          }}
        />
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-teal-700 flex items-center gap-2 shadow">
          <BadgeCheck className="w-4 h-4" />
          {course.level}
        </div>
      </div>

      {/* TITLE + DESCRIPTION */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-600" />
            {course.title}
          </h1>
          <EnrollButton
            courseId={course._id}
            refetchCourse={refetchCourse}
            enrolled={enrolled}
          />


        </div>

        <p className="text-gray-700 text-lg">{course.description}</p>
      </div>

      {/* MAIN INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-800">
        {visibleCourseInfo.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.bg} p-4 rounded-lg flex items-start gap-3 border ${item.border} shadow-sm`}
          >
            {item.icon}
            <div>
              <span className="text-gray-600 font-medium">{item.label}:</span>{' '}
              <span className="font-semibold text-gray-800">{item.value}</span>
            </div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TAGS */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4 border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <Tag className="w-5 h-5" /> Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {course.tags?.map((tag, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-teal-200 to-blue-200 text-teal-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* TOPICS */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4 border border-teal-100">
          <h2 className="text-lg font-semibold text-teal-700 flex items-center gap-2">
            <ListVideo className="w-5 h-5" /> Topics
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {course.topics?.map((topic, idx) => (
              <li key={idx}>{topic}</li>
            ))}
          </ul>
        </div>
      </div>


      {/* COLLAPSIBLE CURRICULUM */}
      <CourseCurriculum

        course={course}
        refetchCourse={refetchCourse}
        enrolled={enrolled}
        completedLessons={completedLessons}
        courseCompleted={courseCompleted}
      />


      {/* GO BACK */}

    </div>
  );
};

export default ViewCoursePage;
