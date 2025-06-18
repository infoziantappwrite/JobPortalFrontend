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

const JobCards = ({ paginatedJobs }) => {
  const navigate = useNavigate();

  const handleCardClick = (job) => {
  const formattedTitle = job.title.toLowerCase().replace(/\s+/g, '-');

  // Filter related jobs by same company, excluding current job
  const relatedJobs = paginatedJobs.filter(
    (j) => j.company === job.company && j._id !== job._id
  );

  navigate(`/job/${formattedTitle}`, {
    state: {
      jobdetails: job,
      relatedJobs
    }
  });
};


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {paginatedJobs.map((job) => (
  <div
    key={job._id}
    onClick={() => handleCardClick(job)}
    className="group cursor-pointer relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between hover:-translate-y-1"
  >
    {/* Top Badges Ribbon */}
    <div className="absolute top-4 left-4 flex items-center gap-2">
      <span className="text-[11px] font-medium bg-gradient-to-r from-teal-400 to-blue-500 text-white px-2 py-0.5 rounded shadow-sm">
        {job.jobType || 'Full Time'}
      </span>
      <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded shadow-sm">
        {job.specialisms?.[0] || 'General'}
      </span>
    </div>

    {/* Logo */}
    <div className="flex justify-center items-center mt-6 mb-4">
      <div className={`w-20 h-20 ${getColorByString(job.company || '')} text-white font-bold text-xl rounded-full flex items-center justify-center uppercase shadow-inner`}>
        {job.company?.[0] || 'C'}
      </div>
    </div>

    {/* Job Info */}
    <div className="text-center">
      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company || 'Unknown Company'}</p>
    </div>

    {/* Bottom Details */}
    <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
      <div className="flex items-center">
        <FiMapPin className="mr-1 text-blue-600" />
        {job.location || 'Remote'}
      </div>
      <div className="text-[11px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">
        Experience: {job.experience || 'Any'}
      </div>
    </div>
  </div>
))}

    </div>
  );
};

export default JobCards;
