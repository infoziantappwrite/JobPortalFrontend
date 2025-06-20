import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { FiMapPin, FiPhone, FiGlobe, FiUsers, FiCalendar, FiMail } from 'react-icons/fi';
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

  if (loading)
    return <div className="p-6 text-center text-indigo-600">Loading company details...</div>;
  if (!company)
    return <div className="p-6 text-center text-red-500">Company not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover image */}
      <div className="h-52 w-full mb-[-4rem] rounded-b-xl overflow-hidden shadow-md">
        <img
          src={company.coverImage || DEFAULT_COVER}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-xl p-6 mt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {company.companyLogo && (
            <img
              src={company.companyLogo}
              alt={company.name}
              className="w-24 h-24 object-contain rounded border shadow"
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-indigo-700">{company.name}</h1>
            <p className="text-gray-500 flex items-center justify-center md:justify-start mt-1">
              <FiMapPin className="mr-1" /> {company.location || 'N/A'}
            </p>
            <p className="text-sm text-gray-400 mt-1">{company.primaryIndustry}</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          {company.about && (
            <div>
              <strong className="text-gray-900">About:</strong>
              <p className="mt-1">{company.about}</p>
            </div>
          )}
          <div>
            <strong className="text-gray-900">Email:</strong>
            <p className="flex items-center gap-1 mt-1">
              <FiMail /> {company.email}
            </p>
          </div>
          <div>
            <strong className="text-gray-900">Phone:</strong>
            <p className="flex items-center gap-1 mt-1">
              <FiPhone /> {company.phone}
            </p>
          </div>
          <div>
            <strong className="text-gray-900">Website:</strong>
            <p className="flex items-center gap-1 mt-1">
              <FiGlobe />
              <a
                href={company.website?.startsWith('http') ? company.website : `https://${company.website}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {company.website}
              </a>
            </p>
          </div>
          <div>
            <strong className="text-gray-900">Team Size:</strong>
            <p className="flex items-center gap-1 mt-1">
              <FiUsers /> {company.teamSize}
            </p>
          </div>
          <div>
            <strong className="text-gray-900">Founded:</strong>
            <p className="flex items-center gap-1 mt-1">
              <FiCalendar /> {new Date(company.since).toDateString()}
            </p>
          </div>
          {company.categories?.length > 0 && (
            <div>
              <strong className="text-gray-900">Categories:</strong>
              <p className="mt-1">{company.categories.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        {company.socials && (
          <div className="pt-4 border-t flex flex-wrap gap-4 text-sm">
            {company.socials.facebook && (
              <a
                href={company.socials.facebook}
                className="text-blue-700 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            )}
            {company.socials.twitter && (
              <a
                href={company.socials.twitter}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            )}
            {company.socials.linkedIn && (
              <a
                href={company.socials.linkedIn}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>

      {/* Jobs At Company Section */}
      <div className="mt-10">
        <JobsAtCompany companyId={companyID} />
      </div>
    </div>
  );
};

export default CompanyDetails;
