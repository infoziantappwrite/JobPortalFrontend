import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useUser } from '../contexts/UserContext';
import Imageno from '../course/superadmin/image.png';
import { FiClock } from 'react-icons/fi';
import {
  BadgeCheck, BookOpen, ChevronDown, ChevronRight,
  PlayCircle, Sparkles, Star, Tag, User
} from 'lucide-react';
import InternalLoader from '../components/InternalLoader';
import EmptyState from '../components/EmptyState';
import ApplyNowButton from '../components/ApplyButton';
import { PiArrowLeftBold } from 'react-icons/pi';

const CourseDetails = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get(`/common/course/${courseId}`);
        setCourse(data.course || data);
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };
  
            const formatCourseNameForUrl = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  if (loading) return <InternalLoader />;
  if (!course) return <EmptyState message="Course not found." />;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
        >
          <PiArrowLeftBold className="w-4 h-4" /> Back
        </button>

        {/* Hero Section */}
        <div className="space-y-4">
          <img
            src={course.image || Imageno}
            onError={(e) => (e.target.src = Imageno)}
            className="w-full h-72 sm:h-60 object-cover rounded-xl shadow"
            alt={course.title}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
                {course.title}
              </h1>
              <p className="text-gray-600 text-lg mt-1">{course.description}</p>
            </div>


{!user ? (
  // Not logged in
  <button
    onClick={() => navigate('/login')}
    className="mt-4 sm:mt-0 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:opacity-90"
  >
    Login to View
  </button>
) : user.userType === 'candidate' ? (
  // Logged in candidate
  <button
    onClick={() =>
      navigate(`/candidate/view-course/${formatCourseNameForUrl(course.title)}`, {
        state: { course },
      })
    }
    className="mt-4 sm:mt-0 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:opacity-90"
  >
    View
  </button>
) : null}


          </div>
        </div>

        {/* Quick Info Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm">
          <Info label="Instructor" value={course.instructor} icon={<User className="text-blue-600 w-4 h-4" />} />
          <Info label="Level" value={course.level} icon={<BadgeCheck className="text-indigo-600 w-4 h-4" />} />
          <Info label="Duration" value={course.duration} icon={<FiClock className="text-teal-600 w-4 h-4" />} />
          <Info label="Rating" value={course.rating} icon={<Star className="text-yellow-500 w-4 h-4" />} />
          <Info label="Price" value={course.price} icon={<Sparkles className="text-pink-500 w-4 h-4" />} />
          <Info label="Featured" value={course.featured ? "Yes" : "No"} />
        </div>

        {/* Tags Section */}
        {course.tags?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <Tag className="w-5 h-5" /> Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Topics Section */}
        {course.topics?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-teal-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Topics Covered
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {course.topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Curriculum Section */}
        {course.curriculum?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Curriculum
            </h2>

            {course.curriculum.map((section) => (
              <div key={section._id}>
                <button
                  onClick={() => toggleSection(section._id)}
                  className="w-full text-left text-teal-700 font-semibold text-lg flex items-center gap-2 py-2"
                >
                  {openSections[section._id] ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  {section.title}
                </button>

                {openSections[section._id] && (
                  <ul className="pl-6 space-y-2 mt-2 text-gray-700">
                    {section.lessons?.map((lesson) => (
                      <li key={lesson._id} className="flex items-center justify-between text-sm">
                        <span>
                          {lesson.title}{' '}
                          <span className="text-gray-500">({lesson.duration})</span>
                        </span>
                        {lesson.videoUrl && (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <PlayCircle className="w-4 h-4" /> Watch
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value, icon }) => (
  <div className="flex items-center gap-2 text-gray-800">
    {icon}
    <span className="font-medium">{label}:</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default CourseDetails;
