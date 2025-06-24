import React, { useEffect, useRef, useState } from 'react';
import {
  Bell, X, CheckSquare, Square, ChevronDown, ChevronUp,
} from 'lucide-react';
import apiClient from '../api/apiClient';

const getRandomColor = () => {
  const colors = [
    'bg-blue-600', 'bg-red-500', 'bg-green-500',
    'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const formatDateGroup = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString();
};

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [initialColors, setInitialColors] = useState({});
  const popupRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch once
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get('/common/auth/notifications', { withCredentials: true });
        const data = res.data.notifications || [];

        const colorMap = {};
        data.forEach((n) => {
          colorMap[n._id] = getRandomColor();
        });

        setInitialColors(colorMap);
        setNotifications(data);
      } catch (err) {
        console.error('Notification fetch failed:', err);
      }
    };

    fetch();
  }, []);

  // Close popup outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
        setSelectMode(false);
        setSelected([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const markAs = async (status) => {
    try {
      await apiClient.post(
        '/common/auth/notifications/change-status',
        {
          notificationIDs: selected,
          status,
        },
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          selected.includes(n._id) ? { ...n, isRead: status === 'read' } : n
        )
      );
      setSelected([]);
      setSelectMode(false);
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };

  const markSingleRead = async (id) => {
    try {
      await apiClient.post(
        '/common/auth/notifications/change-status',
        {
          notificationIDs: [id],
          status: 'read',
        },
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking single read:', err);
    }
  };

  const grouped = notifications.reduce((acc, n) => {
    const group = formatDateGroup(n.createdAt);
    acc[group] = acc[group] || [];
    acc[group].push(n);
    return acc;
  }, {});

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        className="text-gray-700 text-2xl relative mt-2"
        onClick={() => setShowPopup((prev) => !prev)}
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {showPopup && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-[420px] bg-white border border-gray-200 shadow-2xl rounded-xl z-50 overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-teal-50 border-b">
            <h3 className="text-lg font-semibold text-blue-700">Notifications</h3>
            <div className="flex gap-2 items-center">
              {selectMode ? (
                <ChevronUp onClick={() => { setSelectMode(false); setSelected([]); }} className="cursor-pointer text-gray-600" />
              ) : (
                <ChevronDown onClick={() => setSelectMode(true)} className="cursor-pointer text-gray-600" />
              )}
              <X onClick={() => setShowPopup(false)} className="cursor-pointer text-gray-600 hover:text-red-600" />
            </div>
          </div>

          {/* Bulk actions */}
          {selectMode && selected.length > 0 && (
            <div className="flex justify-between px-4 py-2 border-b bg-gray-50 text-sm text-gray-700">
              <span>{selected.length} selected</span>
              <div className="flex gap-3">
                <button onClick={() => markAs('read')} className="text-blue-600 hover:underline">
                  Mark Read
                </button>
                <button onClick={() => markAs('unread')} className="text-yellow-600 hover:underline">
                  Mark Unread
                </button>
              </div>
            </div>
          )}

          {/* Body */}
         {/* Body */}
<div className="overflow-y-auto max-h-[75vh] divide-y">
  {notifications.length === 0 ? (
    <div className="p-6 text-center text-gray-500">
      <p className="text-sm">You have no notifications.</p>
    </div>
  ) : (
    Object.entries(grouped).map(([group, notifs]) => (
      <div key={group} className="px-4 py-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group}</h4>
        {notifs.map((n) => {
          const isSelected = selected.includes(n._id);
          const isUnread = !n.isRead;
          const color = initialColors[n._id] || 'bg-blue-600';

          return (
            <div
              key={n._id}
              onClick={() =>
                selectMode ? toggleSelect(n._id) : markSingleRead(n._id)
              }
              className={`flex items-start gap-3 p-3 rounded-md hover:bg-gray-100 transition cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              {selectMode && (
                <div className="pt-1">
                  {isSelected ? (
                    <CheckSquare className="text-blue-600 w-5 h-5" />
                  ) : (
                    <Square className="text-gray-400 w-5 h-5" />
                  )}
                </div>
              )}

              <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold`}>
                {n.title?.charAt(0) || 'N'}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                  {isUnread && (
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    ))
  )}
</div>

        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
