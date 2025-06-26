import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { FiSearch, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { AlertTriangle } from 'lucide-react';

import CompanyGrid from '../components/CompanyGrid';
import InternalLoader from '../components/InternalLoader';
import EmptyState from '../components/EmptyState';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    size: '',
    founded: [1990, 2025],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiClient.get('/common/company/all');
        const all = res.data?.companies || [];
        setCompanies(all);
        setFilteredCompanies(all);
        setError('');
      } catch (err) {
        console.error('Failed to fetch companies', err);
        setError('Something went wrong while fetching companies.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = [...companies];
    if (filters.keyword)
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    if (filters.location)
      filtered = filtered.filter(c =>
        c.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
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

  const handleClick = c => {
    navigate(`/company/${formatName(c.name)}?id=${c.userID}`);
  };

  // Loading UI
  if (loading) {
    return <InternalLoader text="Loading Companies" />;
  }

  // Error UI
  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Error Loading Companies"
        message={error}
      />
    );
  }

  return (
    <div className="bg-gradient-to-tr from-blue-50 to-teal-50 min-h-screen py-10 px-4 md:px-10">
      {/* Header */}
      <div className="text-center mb-10">
  <h1 className="text-4xl font-extrabold pb-2 text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text mb-3">
    Discover Leading Companies & Your Next Career Move
  </h1>
  <p className="text-gray-600 text-lg">
    Search. Filter. Connect. Unlock your career potential with trusted organizations around the globe. 🚀
  </p>
</div>


      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="bg-blue-100 p-6 rounded-2xl shadow border border-blue-200 space-y-6">
          <h3 className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-600 flex items-center justify-center gap-2">
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
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Founded Year Range
            </label>
            <input
              type="range"
              min="1990"
              max="2025"
              value={filters.founded[1]}
              onChange={e =>
                setFilters({ ...filters, founded: [1990, parseInt(e.target.value)] })
              }
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1 text-center">
              {filters.founded[0]} - {filters.founded[1]}
            </div>
          </div>
        </div>

        {/* Company Results */}
        <div className="md:col-span-3">
          {filteredCompanies.length === 0 ? (
            <EmptyState
              icon={FiBriefcase}
              title="No Companies Found"
              message="Try adjusting your filters to see more results."
            />
          ) : (
            <CompanyGrid companies={filteredCompanies} handleClick={handleClick} />
          )}
        </div>
      </div>
    </div>
  );
};

// Input Field with Icon
const FilterInput = ({ label, icon, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
      {icon}
      <input
        type="text"
        className="w-full outline-none text-sm text-gray-700"
        onChange={e => onChange(e.target.value)}
      />
    </div>
  </div>
);

// Select Dropdown
const FilterSelect = ({ label, options, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <select
      className="w-full border rounded-md px-3 py-2 bg-white shadow-sm text-sm text-gray-700"
      onChange={e => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Companies;
