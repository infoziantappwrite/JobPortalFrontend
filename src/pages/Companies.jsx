import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, } from 'react-icons/fi';

import CompanyGrid from '../components/CompanyGrid';

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
  <div className="bg-blue-50 min-h-screen py-10 px-4 md:px-10">
    {/* Header */}
    <div className="pb-10 text-center">
      <h2 className="text-3xl font-bold text-blue-800">
        🌐 Explore Top Companies
      </h2>
      <div className="w-28 h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 mx-auto mt-4 rounded-full shadow-sm" />
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-200 space-y-6">
        <h3 className="text-xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-600 flex items-center justify-center gap-2">
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
          <label className="block text-sm font-semibold mb-1 text-gray-700">Founded Year Range</label>
          <input
            type="range"
            min="1990"
            max="2025"
            value={filters.founded[1]}
            onChange={(e) => setFilters({ ...filters, founded: [1990, parseInt(e.target.value)] })}
            className="w-full accent-blue-500"
          />
          <div className="text-xs text-gray-600 mt-1 text-center">{filters.founded[0]} - {filters.founded[1]}</div>
        </div>
      </div>

      {/* Company Results */}
      <div className="md:col-span-3">
        {loading ? (
          <p className="text-center text-indigo-600 font-medium">Loading companies...</p>
        ) : (
          <CompanyGrid companies={filteredCompanies} handleClick={handleClick} />
        )}
      </div>
    </div>
  </div>
);

};

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

const FilterSelect = ({ label, options, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <select
      className="w-full border rounded-md px-3 py-2 bg-white shadow-sm text-sm text-gray-700"
      onChange={e => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);



export default Companies;
