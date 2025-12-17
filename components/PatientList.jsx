import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Ideally use environment variable for API URL
    axios.get('http://localhost:8000/api/patients/')
      .then(response => setPatients(response.data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Patients</Typography>
      <List>
        {patients.map(patient => (
          <ListItem 
            key={patient.id} 
            secondaryAction={
              <Button component={Link} to={`/patients/${patient.id}`} variant="outlined">
                View Record
              </Button>
            }
          >
            <ListItemText 
              primary={`${patient.first_name} ${patient.last_name}`} 
              secondary={`DOB: ${patient.date_of_birth} | Gender: ${patient.gender}`} 
            />
          </ListItem>
        ))}
        {patients.length === 0 && <Typography>No patients found.</Typography>}
      </List>
    </Paper>
  );
};

export default PatientList;
