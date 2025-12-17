import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Typography, Paper, Box, Grid, Card, CardContent, Divider, List, ListItem, ListItemText, Button, Tab, Tabs } from '@mui/material';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await axios.get(`http://localhost:8000/api/patients/${id}/`);
        setPatient(pRes.data);
        
        const aRes = await axios.get('http://localhost:8000/api/assessments/');
        setAssessments(aRes.data.filter(a => a.patient === parseInt(id)));

        const iRes = await axios.get('http://localhost:8000/api/instruments/');
        setInstruments(iRes.data);
      } catch (error) {
        console.error("Error fetching patient details", error);
      }
    };
    fetchData();
  }, [id]);

  const handleAssign = async (instrumentId) => {
    try {
        await axios.post('http://localhost:8000/api/assessments/', {
            patient: id,
            instrument: instrumentId
        });
        const aRes = await axios.get('http://localhost:8000/api/assessments/');
        setAssessments(aRes.data.filter(a => a.patient === parseInt(id)));
    } catch(err) {
        console.error("Error assigning", err);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!patient) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
                {patient.first_name} {patient.paternal_last_name} {patient.maternal_last_name}
            </Typography>
            <Typography variant="h6" color="primary">Folio: {patient.folio_number}</Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Fecha de Nacimiento</Typography>
            <Typography>{patient.date_of_birth}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Sexo</Typography>
            <Typography>{patient.gender}</Typography>
          </Grid>
           <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Estado Civil</Typography>
            <Typography>{patient.marital_status || '-'}</Typography>
          </Grid>
           <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Lugar de Residencia</Typography>
            <Typography>{patient.place_of_residence || '-'}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Celular</Typography>
            <Typography>{patient.mobile_number} {patient.whatsapp_is_mobile && '(WhatsApp)'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Otro Contacto</Typography>
            <Typography>{patient.landline_number || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
            <Typography>{patient.email || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">Fecha Consulta</Typography>
            <Typography>{patient.consultation_date || '-'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">Domicilio</Typography>
            <Typography>{patient.address || '-'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>Expediente Clínico</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Pruebas Psicológicas" />
            <Tab label="Entrevistas y Notas" />
            <Tab label="Diagnóstico" />
        </Tabs>
      </Box>

      {/* Pruebas Tab */}
      <div role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
             <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                     <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6">Pruebas Asignadas</Typography>
                            <List>
                                {assessments.map(a => (
                                    <ListItem key={a.id} divider secondaryAction={
                                        a.status === 'pending' ? 
                                        <Button component={Link} to={`/assessments/${a.id}`} size="small" variant="contained">Aplicar</Button> :
                                        <Button size="small" variant="outlined" color="success">Ver Resultados</Button>
                                    }>
                                        <ListItemText 
                                            primary={`Instrumento ID: ${a.instrument}`} 
                                            secondary={`Estado: ${a.status} ${a.result ? `| Score: ${a.result.score}` : ''}`} 
                                        />
                                    </ListItem>
                                ))}
                                {assessments.length === 0 && <Typography sx={{p:2}}>No hay pruebas asignadas.</Typography>}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>Asignar Nueva Prueba</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {instruments.map(inst => (
                                    <Button key={inst.id} variant="outlined" size="small" onClick={() => handleAssign(inst.id)}>
                                        {inst.name}
                                    </Button>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
             </Grid>
        )}
      </div>

      {/* Entrevistas Tab */}
      <div role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
             <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6">Notas y Entrevistas</Typography>
                    <List>
                        {patient.notes && patient.notes.map(note => (
                            <ListItem key={note.id}>
                                <ListItemText primary={note.title} secondary={note.date} />
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" sx={{mt:2}}>Nueva Nota</Button>
                </CardContent>
            </Card>
        )}
      </div>

       {/* Diagnostico Tab */}
       <div role="tabpanel" hidden={tabValue !== 2}>
        {tabValue === 2 && (
             <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6">Integración Diagnóstica</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Aquí se visualizará el resumen del caso y la conclusión diagnóstica (Norma 004).
                    </Typography>
                </CardContent>
            </Card>
        )}
      </div>

    </Box>
  );
};

export default PatientDetail;
