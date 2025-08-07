import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import type { HospitalEntry } from '../../../types';

function HospitalEntryDisplay({ entry }: { entry: HospitalEntry }) {
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
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText
            primary={`(${entry.date}) ${entry.description}`}
            secondary={entry.specialist}
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText
            primary={`Discharge: ${entry.discharge.criteria} - ${entry.discharge.date}`}
            sx={{ fontStyle: 'italic', pl: '4ch' }}
          />
        </ListItem>
      </List>
    </ListItem>
  );
}

export default HospitalEntryDisplay;
