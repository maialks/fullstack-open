import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MasksIcon from '@mui/icons-material/Masks';
import { HealthCheckEntry, HealthCheckRating } from '../../../types';

function HealthCheckDisplay({ entry }: { entry: HealthCheckEntry }) {
  let ratingColor = '';
  switch (entry.healthCheckRating) {
    case HealthCheckRating.Healthy:
      ratingColor = '🟩';
      break;
    case HealthCheckRating.LowRisk:
      ratingColor = '🟨';
      break;
    case HealthCheckRating.HighRisk:
      ratingColor = '🟧';
      break;
    case HealthCheckRating.CriticalRisk:
      ratingColor = '🟥';
      break;
    default:
      return null;
  }
  return (
    <ListItem
      disablePadding
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: '1px solid black',
        borderRadius: '5px',
        mb: 2,
        p: 2,
      }}
    >
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemIcon sx={{ minWidth: '24px', mr: '1ch' }}>
            <MasksIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${ratingColor} (${entry.date}) ${entry.description}`}
            secondary={entry.specialist}
          />
        </ListItem>
      </List>
    </ListItem>
  );
}

export default HealthCheckDisplay;
