import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import AssessmentView from './components/AssessmentView';
import CreatePatient from './components/CreatePatient';
import EvaluationLibrary from './components/EvaluationLibrary';
import ClinicalHistoryForm from './components/ClinicalHistoryForm';
import AssessmentFlow from './components/NeuroAssessment/AssessmentFlow';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clinical Assessments
          </Typography>
          <Button color="inherit" component={Link} to="/">Pacientes</Button>
          <Button color="inherit" component={Link} to="/evaluation">Evaluación</Button>
          <Button color="inherit" component={Link} to="/patients/new">Nuevo Paciente</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<PatientList />} />
          <Route path="/patients/new" element={<CreatePatient />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/:id/history" element={<ClinicalHistoryForm />} />
          <Route path="/assessments/:id" element={<AssessmentView />} />
          <Route path="/neuro-assessment/:id" element={<AssessmentFlow />} />
          <Route path="/evaluation" element={<EvaluationLibrary />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
