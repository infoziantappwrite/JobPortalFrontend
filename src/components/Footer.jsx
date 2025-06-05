import logo from '/src/assets/logos/Logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#18181B] text-white py-16 px-6 md:px-20">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:justify-between gap-16 mb-14">

        {/* Left: Branding + Contact */}
        <div className="w-full md:w-1/3 max-w-sm">
          <img src={logo} alt="Infoziant Logo" className="mb-6 w-56" />
          <p className="text-lg font-semibold mb-2">Contact Us</p>
          <p className="text-sm leading-relaxed text-gray-300">
            1 (314) 732 0300<br />
            +91 96000 85988
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-300">
            Akshaya HQ, Rajiv Gandhi Salai, Kazhipattur,<br />
            Chennai - 603103, India.
            <br />
            1401, 21st ST STE 6310, Sacramento, CA 95811, USA
          </p>
          <p className="mt-2 text-sm text-purple-400">support@infoziant.com</p>
        </div>

        {/* Right: Useful Links */}
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">For Candidates</h3>
            <ul className="space-y-2 text-gray-300 hover:[&>li:hover]:text-purple-400">
              <li>Browse Jobs</li>
              <li>Upload Resume</li>
              <li>Find Companies</li>
              <li>Job Alerts</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">For Employers</h3>
            <ul className="space-y-2 text-gray-300 hover:[&>li:hover]:text-purple-400">
              <li>Employer Login</li>
              <li>Job Posting</li>
              <li>Discover Talent</li>
              <li>Packages</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">About Us</h3>
            <ul className="space-y-2 text-gray-300 hover:[&>li:hover]:text-purple-400">
              <li>About</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Upskills</h3>
            <ul className="space-y-2 text-gray-300 hover:[&>li:hover]:text-purple-400">
              <li>All Courses</li>
              <li>My Courses</li>
              <li>Completed Courses</li>
              <li>Skill Assessment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-gray-400 text-center md:text-left">
          © 2024 <span className="text-white font-semibold">Infoziant</span>. All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 text-xl text-gray-400">
          <i className="fab fa-facebook-f hover:text-white transition" />
          <i className="fab fa-twitter hover:text-white transition" />
          <i className="fab fa-instagram hover:text-white transition" />
          <i className="fab fa-linkedin-in hover:text-white transition" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
