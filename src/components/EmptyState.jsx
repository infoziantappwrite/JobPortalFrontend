import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', message }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center text-gray-600 bg-gradient-to-br from-teal-50 to-blue-50  px-6">
      {Icon && <Icon className="w-12 h-12 mb-4 text-teal-500" />}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
