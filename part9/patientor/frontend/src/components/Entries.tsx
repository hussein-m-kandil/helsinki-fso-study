import {
  Favorite,
  MedicalInformation,
  MedicalServices,
  Work,
} from '@mui/icons-material';
import {
  Card,
  List,
  ListItem,
  Typography,
  TypographyTypeMap,
} from '@mui/material';
import {
  Diagnosis,
  DiagnosisCode,
  Entry,
  EntryType,
  HealthCheckRating,
} from '../types';
import { createContext, useContext } from 'react';
import { assertNever } from '../utils';
import { green, orange, red, yellow } from '@mui/material/colors';

const DiagnosesContext = createContext<Diagnosis[]>([]);

const EntryDescription = ({ description }: { description: string }) => {
  return (
    <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
      {description}
    </Typography>
  );
};

const EntryDiagnoses = ({ codes }: { codes: DiagnosisCode[] }) => {
  const diagnoses = useContext(DiagnosesContext);

  return (
    <List aria-labelledby="diagnoses-label">
      <Typography
        id="diagnoses-label"
        variant="subtitle1"
        sx={{ fontWeight: 'bold' }}
      >
        Diagnoses
      </Typography>
      {codes.map((code) => (
        <ListItem key={code}>
          <Typography variant="body2">
            <Typography
              variant="body2"
              component="strong"
              sx={{ fontWeight: 'bold' }}
            >
              {code}
            </Typography>{' '}
            <Typography
              variant="body2"
              component="em"
              sx={{ fontStyle: 'italic' }}
            >
              {diagnoses.find((d) => d.code === code)?.name}
            </Typography>
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

const EntryCard = ({ entry }: { entry: Entry }) => {
  const titleProps: TypographyTypeMap['props'] = {
    variant: 'subtitle1',
    sx: { fontWeight: 'bold' },
  };

  const description = <EntryDescription description={entry.description} />;

  return (
    <Card sx={{ border: '1px solid #777', padding: '0.5rem 1rem' }}>
      {(() => {
        switch (entry.type) {
          case EntryType.Hospital:
            return (
              <>
                <Typography {...titleProps}>
                  {entry.date}{' '}
                  <MedicalInformation sx={{ verticalAlign: 'top' }} />
                </Typography>
                <Typography variant="caption" component="p">
                  <strong>discharge date:</strong> {entry.discharge.date}
                </Typography>
                <Typography variant="caption" component="p">
                  <strong>discharge criteria:</strong>{' '}
                  {entry.discharge.criteria}
                </Typography>
                {description}
              </>
            );
          case EntryType.HealthCheck:
            return (
              <>
                <Typography {...titleProps}>
                  {entry.date} <MedicalServices sx={{ verticalAlign: 'top' }} />
                </Typography>
                {description}
                <Favorite
                  sx={{
                    display: 'block',
                    color: (() => {
                      switch (entry.healthCheckRating) {
                        case HealthCheckRating.LowRisk:
                          return yellow[700];
                        case HealthCheckRating.HighRisk:
                          return orange[700];
                        case HealthCheckRating.CriticalRisk:
                          return red[700];
                        default:
                          return green[700];
                      }
                    })(),
                  }}
                />
              </>
            );
          case EntryType.OccupationalHealthcare:
            return (
              <>
                <Typography {...titleProps}>
                  {entry.date} <Work sx={{ verticalAlign: 'top' }} />{' '}
                  {entry.employerName}
                </Typography>
                {description}
                {entry.sickLeave && (
                  <Typography variant="caption" component="p">
                    start: {entry.sickLeave.startDate} - end:{' '}
                    {entry.sickLeave.endDate}
                  </Typography>
                )}
              </>
            );
          default:
            assertNever(entry);
        }
      })()}
      {entry.diagnosisCodes && <EntryDiagnoses codes={entry.diagnosisCodes} />}
      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
        diagnose by {entry.specialist}
      </Typography>
    </Card>
  );
};

const Entries = ({
  entries,
  diagnoses,
}: {
  entries: Entry[];
  diagnoses: Diagnosis[];
}) => {
  return (
    <List aria-labelledby="entries-label">
      <Typography
        id="entries-label"
        variant="h6"
        component="h3"
        sx={{ fontWeight: 'bold' }}
      >
        Entries
      </Typography>
      {entries.length ? (
        entries.map((entry) => (
          <ListItem key={entry.id}>
            <DiagnosesContext value={diagnoses}>
              <EntryCard entry={entry} />
            </DiagnosesContext>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <Typography>There are no entries</Typography>
        </ListItem>
      )}
    </List>
  );
};

export default Entries;
