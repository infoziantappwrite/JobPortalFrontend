import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import {
  FiMapPin, FiPhone, FiGlobe, FiUsers,
  FiCalendar, FiMail, FiFacebook, FiTwitter, FiLinkedin
} from 'react-icons/fi';
import JobsAtCompany from '../components/JobsAtCompany';

const DEFAULT_COVER =
  'https://wallpapers.com/images/hd/gears-linkedin-cover-mvrjmcq6p2mfs1sq.jpg';

const CompanyDetails = () => {
  const [searchParams] = useSearchParams();
  const companyID = searchParams.get('id');
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyID) return;

    const fetchCompanyDetails = async () => {
      try {
        const res = await apiClient.get(`/common/company/${companyID}`);
        setCompany(res.data.company[0]);
      } catch (error) {
        console.error('Failed to fetch company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyID]);

  if (loading) {
    return <div className="p-6 text-center text-indigo-600 animate-pulse">Loading company details...</div>;
  }

  if (!company) {
    return <div className="p-6 text-center text-red-500">Company not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* Cover Image */}
      <div className="h-52 w-full mb-[-4rem] rounded-xl overflow-hidden shadow-lg">
        <img
          src={company.coverImage || DEFAULT_COVER}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Card */}
      <div className="bg-blue-50 rounded-2xl shadow-xl p-8 mt-10 space-y-6 border border-blue-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {company.companyLogo ? (
            <img
              src={company.companyLogo}
              alt={company.name}
              className="w-24 h-24 object-contain rounded-full border shadow bg-white p-1"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
              {company.name?.charAt(0).toUpperCase() || 'C'}
            </div>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
            <p className="text-gray-600 flex items-center justify-center md:justify-start mt-1 text-sm">
              <FiMapPin className="mr-1" /> {company.location || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-1">{company.primaryIndustry}</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-800">
          {company.about && (
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
              <p className="text-gray-700">{company.about}</p>
            </div>
          )}
          <div>
            <strong className="text-gray-800">Email:</strong>
            <p className="flex items-center gap-2 mt-1 text-gray-700">
              <FiMail className="text-indigo-600" /> {company.email || 'N/A'}
            </p>
          </div>
          <div>
            <strong className="text-gray-800">Phone:</strong>
            <p className="flex items-center gap-2 mt-1 text-gray-700">
              <FiPhone className="text-indigo-600" /> {company.phone || 'N/A'}
            </p>
          </div>
          <div>
            <strong className="text-gray-800">Website:</strong>
            <p className="flex items-center gap-2 mt-1 text-gray-700">
              <FiGlobe className="text-indigo-600" />
              <a
                href={company.website?.startsWith('http') ? company.website : `https://${company.website}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {company.website || 'No website'}
              </a>
            </p>
          </div>
          <div>
            <strong className="text-gray-800">Team Size:</strong>
            <p className="flex items-center gap-2 mt-1 text-gray-700">
              <FiUsers className="text-indigo-600" /> {company.teamSize || 'N/A'}
            </p>
          </div>
          <div>
            <strong className="text-gray-800">Founded:</strong>
            <p className="flex items-center gap-2 mt-1 text-gray-700">
              <FiCalendar className="text-indigo-600" /> {company.since ? new Date(company.since).toDateString() : 'N/A'}
            </p>
          </div>

          {company.categories?.length > 0 && (
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                {company.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        {company.socials && (
          <div className="pt-4 border-t border-blue-200 flex flex-wrap gap-6 text-2xl">
            {company.socials.facebook && (
              <a
                href={company.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-blue-700 hover:text-blue-800 transition"
              >
                <FiFacebook />
              </a>
            )}
            {company.socials.twitter && (
              <a
                href={company.socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-sky-500 hover:text-sky-600 transition"
              >
                <FiTwitter />
              </a>
            )}
            {company.socials.linkedIn && (
              <a
                href={company.socials.linkedIn}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-blue-600 hover:text-blue-700 transition"
              >
                <FiLinkedin />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Jobs At Company */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Jobs at {company.name}
        </h2>
        <JobsAtCompany companyId={companyID} />
      </div>
    </div>
  );
};

export default CompanyDetails;
