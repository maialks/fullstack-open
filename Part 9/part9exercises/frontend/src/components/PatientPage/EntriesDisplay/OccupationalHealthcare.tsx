import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { OccupationalHealthcareEntry } from '../../../types';
import HealingIcon from '@mui/icons-material/Healing';

function OccupationalHealthcareDisplay({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) {
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
            <HealingIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${entry.employerName}: (${entry.date}) ${entry.description}`}
            secondary={entry.specialist}
          />
        </ListItem>
        {entry.sickLeave && (
          <ListItemText
            primary={'Sick Leave'}
            secondary={`${entry.sickLeave.startDate} - ${entry.sickLeave.endDate}`}
          />
        )}
      </List>
    </ListItem>
  );
}

export default OccupationalHealthcareDisplay;
