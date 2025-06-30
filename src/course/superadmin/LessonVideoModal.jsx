import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ReactPlayer from "react-player";

const LessonVideoModal = ({
  isOpen,
  onClose,
  lesson,
  onComplete,
  isCompleted,
}) => {
  const playerRef = useRef(null);
  const [played, setPlayed] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [warnOnClose, setWarnOnClose] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (played >= 0.98 && !hasCompleted && !isCompleted) {
      onComplete?.();
      setHasCompleted(true);
    }
  }, [played, hasCompleted, isCompleted, onComplete]);

  const handleCloseClick = () => {
    if (played < 0.98 && !isCompleted) {
      setShowConfirm(true);
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    onClose();
    setPlayed(0);
    setHasCompleted(false);
    setWarnOnClose(false);
    setShowConfirm(false);
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl overflow-hidden shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-blue-100 to-teal-100">
          <h3 className="text-lg font-semibold text-blue-700">
            {lesson.title}
          </h3>
          <button onClick={handleCloseClick}>
            <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
          </button>
        </div>

        {/* Video Section */}
        <div className="bg-black h-[280px] sm:h-[320px] md:h-[360px]">
          <ReactPlayer
            ref={playerRef}
            url={lesson.videoUrl}
            controls
            width="100%"
            height="100%"
            playing
            onProgress={({ played }) => setPlayed(played)}
          />
        </div>

        {/* Footer */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>Progress</span>
            <span>{Math.round(played * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2.5 transition-all duration-300"
              style={{ width: `${played * 100}%` }}
            ></div>
          </div>

          {/* Warning or Confirmation */}
          {warnOnClose && (
            <div className="text-xs text-red-500 pt-1">
              Please complete the video to mark this lesson complete.
            </div>
          )}

          {showConfirm && (
            <div className="mt-3 bg-yellow-100 border border-yellow-400 p-3 rounded text-sm text-yellow-800">
              
              <div className="flex gap-3  justify-evenly">
                <p>Are you sure you want to close? Your progress may not be saved.</p>
                <button
                  onClick={closeModal}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes, Close
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonVideoModal;
