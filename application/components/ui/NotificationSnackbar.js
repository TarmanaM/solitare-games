'use client';

import { Snackbar, Alert } from '@mui/material';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// In-app notifications using native Material UI Snackbar
export default function NotificationSnackbar() {
  const notification = useSolitaireStore((state) => state.notification);
  const hideNotification = useSolitaireStore((state) => state.hideNotification);

  if (!notification) return null;

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={3000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.severity || 'info'}
        variant="filled"
        sx={{
          width: '100%',
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
