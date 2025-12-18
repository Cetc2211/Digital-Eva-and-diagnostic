import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox, Paper } from '@mui/material';
import axios from 'axios';

const ClinicalHistoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    laterality: '',
    father_education: 0,
    mother_education: 0,
    consultation_reason: '',
    alert_state: '',
    medical_family_history: {
        epilepsy: { personal: false, family: false },
        adhd: { personal: false, family: false },
        anxiety: { personal: false, family: false },
        depression: { personal: false, family: false },
        diabetes: { personal: false, family: false },
        hypertension: { personal: false, family: false },
    },
    development_history: {
        motor: { achieved: false, age: '' },
        language: { achieved: false, age: '' },
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHistoryChange = (condition, type) => (e) => {
    setFormData(prev => ({
        ...prev,
        medical_family_history: {
            ...prev.medical_family_history,
            [condition]: {
                ...prev.medical_family_history[condition],
                [type]: e.target.checked
            }
        }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, check if history exists to PUT or POST.
      // For now assume POST or generic save endpoint.
      // But models.py has OneToOne.
      await axios.post(`/api/clinical_histories/`, { ...formData, patient: id });
      alert('Historia guardada');
      navigate(`/patients/${id}`);
    } catch (error) {
        console.error("Error saving clinical history", error);
        alert('Error al guardar');
    }
  };

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>Historia Clínica</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <InputLabel>Lateralidad</InputLabel>
                    <Select name="laterality" value={formData.laterality} onChange={handleChange} label="Lateralidad">
                        <MenuItem value="right">Diestro</MenuItem>
                        <MenuItem value="left">Zurdo</MenuItem>
                        <MenuItem value="ambidextrous">Ambidextro</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Escolaridad Padre (años)" type="number" name="father_education" value={formData.father_education} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Escolaridad Madre (años)" type="number" name="mother_education" value={formData.mother_education} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Motivo de Consulta" name="consultation_reason" value={formData.consultation_reason} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Estado de Alerta" name="alert_state" value={formData.alert_state} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h6">Antecedentes Médicos y Heredofamiliares</Typography>
                <Grid container>
                    {['epilepsy', 'adhd', 'anxiety', 'depression'].map(cond => (
                        <Grid item xs={6} md={3} key={cond}>
                            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>{cond}</Typography>
                            <FormControlLabel control={<Checkbox checked={formData.medical_family_history[cond]?.personal} onChange={handleHistoryChange(cond, 'personal')} />} label="Personal" />
                            <FormControlLabel control={<Checkbox checked={formData.medical_family_history[cond]?.family} onChange={handleHistoryChange(cond, 'family')} />} label="Familiar" />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">Guardar Historia</Button>
            </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ClinicalHistoryForm;
