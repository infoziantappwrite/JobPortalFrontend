import { FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const getColorByString = (str) => {
  const colors = [
    'bg-teal-100 text-teal-700',
    'bg-blue-100 text-blue-700',
    'bg-pink-100 text-pink-700',
    'bg-yellow-100 text-yellow-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-indigo-100 text-indigo-700',
    'bg-rose-100 text-rose-700',
  ];
  const hash = [...str].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const timeAgo = (dateString) => {
  const now = new Date();
  const postedDate = new Date(dateString);
  const secondsAgo = Math.floor((now - postedDate) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

const JobCards = ({ paginatedJobs }) => {
  const navigate = useNavigate();

  const handleCardClick = (job) => {
    const formattedTitle = job.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    const relatedJobs = paginatedJobs.filter(
      (j) => j.company === job.company && j._id !== job._id
    );

    navigate(`/job/${formattedTitle}`, {
      state: { jobdetails: job, relatedJobs },
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 pb-6 px-4">
      {paginatedJobs.map((job) => (
        <div
          key={job._id}
          onClick={() => handleCardClick(job)}
          className="group cursor-pointer relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
        >
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <span className="text-[11px] font-medium bg-gradient-to-r from-teal-500 to-blue-600 text-white px-2 py-0.5 rounded-full shadow">
              {job.jobType || 'Full Time'}
            </span>
            <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shadow line-clamp-1 max-w-[100px]">
              {job.specialisms?.[0] || 'General'}
            </span>
          </div>

          {/* Company Logo Circle */}
          <div className="flex justify-center items-center mt-8 mb-4">
            <div
              className={`w-16 h-16 ${getColorByString(job.company || '')} text-xl font-bold rounded-full flex items-center justify-center uppercase shadow-inner`}
            >
              {job.company?.[0] || 'C'}
            </div>
          </div>

          {/* Job Title & Company */}
          <div className="text-center mb-3">
            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 break-words">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">{job.company || 'Unknown Company'}</p>
          </div>

          {/* Meta Info */}
          <div className="text-sm text-gray-600 flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-blue-600 font-medium">
                <FiMapPin className="text-blue-500" />
                <span className="truncate max-w-[140px]">{job.location || 'Remote'}</span>
              </div>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 text-[11px] rounded-full">
                {job.experience ? `Exp: ${job.experience}` : 'Experience: Any'}
              </span>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobCards;
