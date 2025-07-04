import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "/src/assets/logos/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#18181B] text-white py-16 px-6 md:px-20 font-jost">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:justify-between gap-16 mb-14">
        {/* Branding & Contact */}
        <div className="w-full md:w-1/3 max-w-sm">
          <img src={logo} alt="Infoziant Logo" className="mb-6 w-56" />
          <p className="text-lg font-semibold mb-2">Contact Us</p>
          <p className="text-sm leading-relaxed text-gray-300 mb-3">
            Chennai: Akshaya HQ, Rajiv Gandhi Salai, Kazhipattur, Chennai - 603103, India
          </p>
          <p className="text-sm leading-relaxed text-gray-300 mb-3">
            United States: 1401, 21st ST STE 6310, Sacramento, CA 95811, USA
          </p>
          <p className="text-sm text-purple-400">support@infoziant.com</p>
        </div>

        {/* Navigation Links */}
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-300 hover:[&>li:hover]:text-purple-400">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Link to="/companies">Companies</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Account</h3>
            <ul className="space-y-2 text-gray-300 hover:[&>li:hover]:text-purple-400">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login/employee">Employee Login</Link></li>
              <li><Link to="/register/employee">Employee Register</Link></li>
            </ul>
          </div>

          

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300 hover:[&>li:hover]:text-purple-400">
              <li><Link to="/about">Contact</Link></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-gray-400 text-center md:text-left">
          © 2025 <span className="text-white font-semibold">Infoziant IT Solutions Inc.</span> All rights reserved. <br className="md:hidden" />
          A <span className="text-teal-400 font-medium">SOC 2</span> |{" "}
          <span className="text-teal-400 font-medium">ISO 27001:2022</span> Certified Company
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-400">
          <a href="https://www.instagram.com/infoziant.inc/" aria-label="Instagram" className="hover:text-white transition"><Instagram size={20} /></a>
          <a href="https://www.linkedin.com/company/infoziant/" aria-label="LinkedIn" className="hover:text-white transition"><Linkedin size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
