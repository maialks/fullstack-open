import { useNotification } from '../contexts/NotificationContext';
import { Box, SxProps, Typography } from '@mui/material';

function Notification() {
  const { notification } = useNotification();
  const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '6%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    p: 2,
    backgroundColor: '#ff4a4aff',
    zIndex: 9999,
  };

  return (
    <div>
      {notification && (
        <Box sx={style}>
          <Typography variant='h5'>{notification}</Typography>
        </Box>
      )}
    </div>
  );
}

export default Notification;
