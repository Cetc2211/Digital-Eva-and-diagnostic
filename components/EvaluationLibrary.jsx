import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Typography, Paper, Box, Tabs, Tab, Grid, Card, CardContent, 
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Chip 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EvaluationLibrary = () => {
  const [value, setValue] = useState(0);
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    // Fetch all instruments
    axios.get('http://localhost:8000/api/instruments/')
      .then(res => setInstruments(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Helper to filter instruments
  const getInstruments = (cat, subcat = null) => {
    return instruments.filter(i => i.category === cat && (!subcat || i.subcategory === subcat));
  };

  const renderSection = (category, subcategories) => {
    return (
      <Box sx={{ mt: 2 }}>
        {subcategories.map(sub => (
          <Accordion key={sub.key} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{sub.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {getInstruments(category, sub.key).map(inst => (
                  <Grid item xs={12} sm={6} md={4} key={inst.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">{inst.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{inst.description}</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Chip label="Ver detalle" size="small" onClick={() => alert('Detalle de prueba (Próximamente)')} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {getInstruments(category, sub.key).length === 0 && (
                  <Grid item xs={12}><Typography variant="body2" sx={{ fontStyle: 'italic' }}>No hay pruebas disponibles.</Typography></Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
        {/* Render items without subcategory or explicitly general */}
        {getInstruments(category, null).length > 0 && subcategories.length === 0 && (
             <Grid container spacing={2} sx={{p:2}}>
                {getInstruments(category).map(inst => (
                  <Grid item xs={12} sm={6} md={4} key={inst.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">{inst.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{inst.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
             </Grid>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Evaluación</Typography>
      <Paper elevation={3}>
        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Estado de Ánimo" />
          <Tab label="Eva. Neuropsicológica" />
          <Tab label="Entrevistas" />
          <Tab label="Formatería" />
        </Tabs>
      </Paper>

      {/* 1. Estado de Ánimo */}
      <div role="tabpanel" hidden={value !== 0}>
        {value === 0 && renderSection('mood', [
            { key: 'depression', label: 'Depresión' },
            { key: 'anxiety', label: 'Ansiedad' },
            { key: 'self_harm', label: 'Autolesivos' }
        ])}
      </div>

      {/* 2. Eva. Neuropsicológica */}
      <div role="tabpanel" hidden={value !== 1}>
        {value === 1 && renderSection('neuro', [
            { key: 'mental_status', label: 'Estado Mental' },
            { key: 'executive_functions', label: 'Funciones Ejecutivas' },
            { key: 'perception', label: 'Percepción' },
            { key: 'intelligence', label: 'Inteligencia' },
            { key: 'damage', label: 'Evaluaciones por Daño' }
        ])}
      </div>

      {/* 3. Entrevistas */}
      <div role="tabpanel" hidden={value !== 2}>
        {value === 2 && renderSection('interview', [
            { key: 'clinical', label: 'Clínica' },
            { key: 'cbt', label: 'Cognitivo Conductual' },
            { key: 'afc', label: 'AFC' }
        ])}
      </div>

      {/* 4. Formatería */}
      <div role="tabpanel" hidden={value !== 3}>
         {value === 3 && renderSection('forms', [
             { key: 'general', label: 'Formatos Generales' }
         ])}
      </div>
    </Box>
  );
};

export default EvaluationLibrary;
