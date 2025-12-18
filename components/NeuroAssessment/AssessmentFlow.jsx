import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';

const SUBTESTS = [
    { id: 'orientation', label: 'Orientación' },
    { id: 'attention', label: 'Atención/Concentración', hasPractice: true },
    { id: 'memory_encoding', label: 'Memoria Verbal (Codificación)' },
    { id: 'fluency', label: 'Fluidez Verbal', timed: true },
    { id: 'comprehension', label: 'Comprensión' },
    { id: 'sense', label: 'Sentido' },
    { id: 'executive', label: 'Funciones Ejecutivas/Motoras' },
    // Add all 15... limiting for brevity/prototype
];

const AssessmentFlow = () => {
    const { id: patientId } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [scores, setScores] = useState({});
    const [trafficLight, setTrafficLight] = useState('gray'); // gray, green, yellow, red

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleScoreChange = (subtestId, score) => {
        setScores(prev => ({ ...prev, [subtestId]: score }));
        // Update traffic light logic here based on score threshold
        // This is a simplified "real-time" feedback
        if (score < 3) setTrafficLight('red');
        else if (score < 7) setTrafficLight('yellow');
        else setTrafficLight('green');
    };

    const currentSubtest = SUBTESTS[activeStep];

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Evaluación Neuropsicológica</Typography>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: trafficLight, border: '1px solid #ccc' }} />
            </Paper>

            <Stepper activeStep={activeStep} alternativeLabel>
                {SUBTESTS.map((subtest) => (
                    <Step key={subtest.id}>
                        <StepLabel>{subtest.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Paper sx={{ p: 4, mt: 4, minHeight: '300px' }}>
                {activeStep === SUBTESTS.length ? (
                    <Typography>Evaluación Completada</Typography>
                ) : (
                    <Box>
                        <Typography variant="h6" gutterBottom>{currentSubtest.label}</Typography>
                        {currentSubtest.hasPractice && (
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                * Ejecutar ejemplo de práctica. Si falla repetidamente, suspender prueba.
                            </Typography>
                        )}
                        {currentSubtest.timed && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                * Cronómetro requerido para esta prueba.
                            </Typography>
                        )}

                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={() => handleScoreChange(currentSubtest.id, 0)}>0 (Fallo)</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" onClick={() => handleScoreChange(currentSubtest.id, 5)}>5 (Regular)</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" onClick={() => handleScoreChange(currentSubtest.id, 10)}>10 (Bien)</Button>
                            </Grid>
                        </Grid>

                        <Typography sx={{ mt: 2 }}>Puntuación Actual: {scores[currentSubtest.id] || 0}</Typography>
                    </Box>
                )}
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                    Atrás
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext}>
                    {activeStep === SUBTESTS.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
            </Box>
        </Box>
    );
};

export default AssessmentFlow;
