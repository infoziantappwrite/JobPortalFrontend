import { useEffect } from 'react';

const VerifySuccess = () => {
  useEffect(() => {
    // Redirect original tab to /login
    if (window.opener) {
      window.opener.location.href = '/login';
    }

    // Optional: give user a moment before closing this tab
    setTimeout(() => {
      window.close(); // Close this verification tab
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-green-600">Email Verified ✅</h1>
      <p className="text-gray-600 mt-2">You may now close this tab. Redirecting...</p>
    </div>
  );
};

export default VerifySuccess;
