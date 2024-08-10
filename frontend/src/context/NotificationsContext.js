import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Create a context for notifications
const NotificationsContext = createContext();

// Custom hook to use the notifications context
export const useNotifications = () => {
  return useContext(NotificationsContext);
};

// Provider component to wrap the app
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, severity = 'info', autoHideDuration = 1000) => {
    setNotifications([...notifications, { message, severity, autoHideDuration }]);
  };

  const handleClose = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <NotificationsContext.Provider value={{ showNotification }}>
      {children}
      {notifications.map((notification, index) => (
        <Snackbar
          key={index}
          open
          autoHideDuration={notification.autoHideDuration}
          onClose={() => handleClose(index)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => handleClose(index)} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationsContext.Provider>
  );
};
