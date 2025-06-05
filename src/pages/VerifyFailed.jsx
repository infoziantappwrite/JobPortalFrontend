const VerifyFailed = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-2xl font-bold text-red-600">Verification Failed ❌</h1>
    <p className="text-gray-600 mt-2">The verification link may have expired or is invalid.</p>
  </div>
);

export default VerifyFailed;
