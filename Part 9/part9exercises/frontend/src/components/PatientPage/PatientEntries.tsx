import type { Entry, Diagnosis } from '../../types';
import { List } from '@mui/material';
import HospitalEntryDisplay from './EntriesDisplay/Hospital';
import OccupationalHealthcareDisplay from './EntriesDisplay/OccupationalHealthcare';
import HealthCheckDisplay from './EntriesDisplay/HealthCheck';

function EntriesList({
  entries,
}: // diagnosesData,
{
  entries: Entry[];
  diagnosesData: Diagnosis[];
}) {
  return (
    <List>
      {entries.map((entry: Entry) => (
        <div key={entry.id}>
          {(() => {
            switch (entry.type) {
              case 'Hospital':
                return <HospitalEntryDisplay entry={entry} />;
              case 'OccupationalHealthcare':
                return <OccupationalHealthcareDisplay entry={entry} />;
              case 'HealthCheck':
                return <HealthCheckDisplay entry={entry} />;
              default:
                const _exaustiveCheck: never = entry;
                return _exaustiveCheck;
            }
          })()}
        </div>
      ))}
    </List>
  );
}

export default EntriesList;
