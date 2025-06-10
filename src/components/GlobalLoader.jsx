import { useUser } from '../contexts/UserContext';

const GlobalLoader = () => {
  const { loading } = useUser();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning Gradient Loader */}
        <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-white text-lg font-semibold tracking-wide animate-pulse">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
