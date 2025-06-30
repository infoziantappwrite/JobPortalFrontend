import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import LessonVideoModal from "./LessonVideoModal";

const CourseCurriculum = ({
  course,
  refetchCourse,
  enrolled,
  completedLessons,
  courseCompleted,
}) => {
  const { user } = useUser();
  const [openSections, setOpenSections] = useState({});
  const [markingLesson, setMarkingLesson] = useState("");
  const [markingCourse, setMarkingCourse] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const markLessonComplete = async (lessonTitle) => {
    setMarkingLesson(lessonTitle);
    try {
      await apiClient.patch(`/candidate/course/${course._id}/complete-lesson`, {
        lessonTitle,
      });
      toast.success(`Marked "${lessonTitle}" as complete`);
      refetchCourse?.(); // 🔄 Re-fetch updated status
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to mark lesson complete");
    } finally {
      setMarkingLesson("");
    }
  };

  const markCourseComplete = async () => {
    setMarkingCourse(true);
    try {
      await apiClient.patch(`/candidate/course/${course._id}/complete`);
      toast.success("Course marked as complete!");
      refetchCourse?.(); // 🔄 Re-fetch updated status
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to complete course");
    } finally {
      setMarkingCourse(false);
    }
  };

  const allLessonTitles = course.curriculum?.flatMap((sec) =>
    sec.lessons.map((les) => les.title.trim())
  );

  const allLessonsCompleted = allLessonTitles?.every((title) =>
    completedLessons.some((t) => t.toLowerCase() === title.toLowerCase())
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-6 border border-blue-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Title and Status */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Curriculum
          </h2>

          {user?.userType === "candidate" && courseCompleted && (
            <div className="text-green-700 bg-green-100 border border-green-600 text-xs px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Course Completed
            </div>
          )}
        </div>

        {/* Progress Circle */}
        {user?.userType === "candidate" && enrolled && !courseCompleted && (
          <div className="flex items-center gap-4">
            {/* Circular progress */}
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="283"
                  strokeDashoffset={`${283 - (completedLessons.length / allLessonTitles.length) * 283
                    }`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-blue-700">
                {Math.round(
                  (completedLessons.length / allLessonTitles.length) * 100
                )}
                %
              </div>
            </div>

            {/* Text Summary */}
            <div className="text-sm text-gray-700">
              <div className="font-medium">
                {completedLessons.length} of {allLessonTitles.length} lessons completed
              </div>
              <div className="text-xs text-gray-500">Keep going!</div>
            </div>
          </div>
        )}
      </div>


      {course.curriculum?.map((section) => {
        const isOpen = openSections[section._id];
        return (
          <div key={section._id} className="border-t">
            <button
              onClick={() => toggleSection(section._id)}
              className="w-full flex justify-between items-center text-left py-2"
            >
              <span className="text-lg font-bold text-teal-600 flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-teal-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-teal-500" />
                )}
                {section.title}
              </span>
            </button>

            {isOpen && (
              <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-700">
                {section.lessons?.map((lesson) => {
                  const isComplete = completedLessons.includes(lesson.title);
                  return (
                    <li
                      key={lesson._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {lesson.title} –{" "}
                        <span className="text-gray-500">{lesson.duration}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        {lesson.videoUrl && (
                          <button
                            onClick={() => setSelectedLesson(lesson)}
                            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                          >
                            <PlayCircle className="w-4 h-4" /> Watch
                          </button>
                        )}
                        <LessonVideoModal
                          isOpen={!!selectedLesson}
                          onClose={() => setSelectedLesson(null)}
                          lesson={selectedLesson}
                          isCompleted={completedLessons.includes(selectedLesson?.title)}
                          onComplete={() => markLessonComplete(selectedLesson.title)}
                        />

                        {enrolled && (
                          isComplete ? (
                            <span className="text-green-700 bg-green-100 border border-green-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Completed
                            </span>
                          ) : (
                            user?.userType === "candidate" && (
                              <button
                                disabled={markingLesson === lesson.title}
                                onClick={() => markLessonComplete(lesson.title)}
                                className="text-xs bg-gradient-to-r from-teal-500 to-blue-600 text-white px-2 py-1 rounded hover:from-teal-600 hover:to-blue-700"
                              >
                                {markingLesson === lesson.title
                                  ? "Marking..."
                                  : "Mark Complete"}
                              </button>
                            )
                          )
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}

      {user?.userType === "candidate" && enrolled && !courseCompleted && (
        <div className="text-right pt-4">
          <button
            onClick={allLessonsCompleted ? markCourseComplete : undefined}
            disabled={!allLessonsCompleted || markingCourse}
            className={`px-4 py-2 rounded text-sm font-medium text-white transition ${allLessonsCompleted && !markingCourse
                ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {markingCourse
              ? "Marking as Completed..."
              : allLessonsCompleted
                ? "Mark Course as Complete"
                : "Complete all lessons first"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCurriculum;
