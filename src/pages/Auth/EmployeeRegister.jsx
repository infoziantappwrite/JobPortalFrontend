/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import register from '../../assets/Register.png'; // replace with your image path
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const EmployeeRegister = () => {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
    companyId: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiClient.get('/employee/auth/all-company');
        setCompanies(res.data || []);
      } catch (err) {
        toast.error('Failed to load companies');
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, position, companyId } = form;
    if (!name || !email || !password || !position || !companyId) {
      return toast.warning('Please fill in all fields');
    }

    try {
      const res = await apiClient.post('/employee/auth/register', form);
      toast.success(res.data.message || 'Registered successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 h-lvh">
        <img
          src={register}
          alt="Register Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 h-full bg-white flex items-center justify-center">
        <div className="w-full h-full overflow-y-auto px-6 py-10 flex flex-col items-center justify-start">
          <h2 className="text-2xl font-jost mb-10 text-gray-800 text-center">
            👋 Welcome! Register your employee account
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-600"
              >
                {isPasswordVisible ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </span>
            </div>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full py-3 text-lg bg-gradient-to-r from-teal-500 to-indigo-800 text-white font-jost rounded-lg hover:opacity-90 transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6 font-jost">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login/employee')}
              className="text-teal-700 hover:underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegister;
