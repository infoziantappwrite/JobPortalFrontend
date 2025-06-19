import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, FiUsers } from 'react-icons/fi';
import { Filter } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', location: '', category: '', size: '', founded: [1990, 2025] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiClient.get('/common/company/all');
        const all = res.data?.companies || [];
        setCompanies(all);
        setFilteredCompanies(all);
      } catch (err) {
        console.error('Failed to fetch companies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = [...companies];
    if (filters.keyword)
      filtered = filtered.filter(c => c.name?.toLowerCase().includes(filters.keyword.toLowerCase()));
    if (filters.location)
      filtered = filtered.filter(c => c.location?.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.category)
      filtered = filtered.filter(c => c.categories?.includes(filters.category));
    if (filters.size)
      filtered = filtered.filter(c => c.teamSize === filters.size);
    filtered = filtered.filter(c => {
      const year = c.since ? new Date(c.since).getFullYear() : 2000;
      return year >= filters.founded[0] && year <= filters.founded[1];
    });
    setFilteredCompanies(filtered);
  }, [filters, companies]);

  const formatName = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const handleClick = (c) => {
    navigate(`/company/${formatName(c.name)}?id=${c.userID}`);
  };

  return (
    <div className="bg-blue-50 p-10 min-h-screen">
     <div className=" pb-6 text-center">
  <h2 className="text-3xl font-bold text-blue-800  ">
    🌐 Explore Top Companies
  </h2>
  
  <div className="w-28 h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 mx-auto mt-4 rounded-full shadow-sm" />
</div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
      <div className="bg-gradient-to-br from-blue-100 via-blue-100 to-teal-100 p-5 rounded-2xl shadow-lg space-y-5 border border-blue-300">
 <h3 className="text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-600">
  <i className="lucide lucide-filter w-5 h-5" />
  Filter Companies
</h3>


  <FilterInput
    label="Search by Keyword"
    icon={<FiSearch className="text-blue-600" />}
    onChange={val => setFilters({ ...filters, keyword: val })}
  />

  <FilterInput
    label="Location"
    icon={<FiMapPin className="text-blue-600" />}
    onChange={val => setFilters({ ...filters, location: val })}
  />

  <FilterSelect
    label="Category"
    options={[...new Set(companies.flatMap(c => c.categories || []))]}
    onChange={val => setFilters({ ...filters, category: val })}
  />

  <FilterSelect
    label="Company Size"
    options={[...new Set(companies.map(c => c.teamSize).filter(Boolean))]}
    onChange={val => setFilters({ ...filters, size: val })}
  />

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Founded Year Range</label>
    <input
      type="range"
      min="1990"
      max="2025"
      value={filters.founded[1]}
      onChange={(e) => setFilters({ ...filters, founded: [1990, parseInt(e.target.value)] })}
      className="w-full accent-blue-500"
    />
    <div className="text-xs text-gray-600">{filters.founded[0]} - {filters.founded[1]}</div>
  </div>
</div>


        {/* Results */}
        <div className="md:col-span-3">
          {loading ? (
            <p className="text-center text-indigo-600">Loading companies...</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map(c => (
                <div
                  key={c._id}
                  onClick={() => handleClick(c)}
                  className="bg-white p-4 rounded-xl border hover:shadow-lg transition cursor-pointer"
                >
                  <span className="text-xs text-green-600 font-semibold px-2 py-1 bg-green-100 rounded-full mb-2 inline-block">Featured</span>
                  <div className="flex items-center justify-center mb-3">
                    {c.companyLogo ? (
                      <img src={c.companyLogo} alt={c.name} className="w-16 h-16 rounded-full object-contain border" />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: randomColor(c.name) }}
                      >
                        {c.name?.[0] || 'C'}
                      </div>
                    )}
                  </div>
                  <h3 className="text-center font-semibold text-indigo-800">{c.name}</h3>
                  <p className="text-sm text-center text-gray-500"><FiMapPin className="inline-block mr-1" /> {c.location || 'N/A'}</p>
                  <p className="text-sm text-center text-gray-500"><FiBriefcase className="inline-block mr-1" /> {c.primaryIndustry || 'Industry'}</p>
                  <p className="mt-2 text-xs text-center text-purple-700 bg-purple-100 inline-block rounded-full px-3 py-1">
                    Open Jobs — {Math.floor(Math.random() * 5 + 1)}
                  </p>
                </div>
              ))}
              {filteredCompanies.length === 0 && (
                <p className="text-gray-500 col-span-full text-center">No companies match the selected filters.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterInput = ({ label, icon, onChange }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <div className="flex items-center gap-2 border rounded px-2 py-1">
      {icon}
      <input type="text" className="w-full outline-none rounded-md p-1 border" onChange={e => onChange(e.target.value)} />
    </div>
  </div>
);

const FilterSelect = ({ label, options, onChange }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <select className="w-full border rounded px-2 py-1" onChange={e => onChange(e.target.value)}>
      <option value="">All</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

function randomColor(seed) {
  const colors = ['#0ea5e9', '#14b8a6', '#6366f1', '#9333ea', '#f97316'];
  return colors[seed.charCodeAt(0) % colors.length];
}

export default Companies;
