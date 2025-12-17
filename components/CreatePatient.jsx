import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, Button, Box, Typography, Paper, Grid, 
  MenuItem, Checkbox, FormControlLabel, FormControl, FormLabel 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreatePatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    paternal_last_name: '',
    maternal_last_name: '',
    date_of_birth: '',
    gender: '',
    place_of_residence: '',
    marital_status: '',
    sexual_orientation: '',
    address: '',
    landline_number: '',
    mobile_number: '',
    whatsapp_is_mobile: false,
    email: '',
    consultation_date: new Date().toISOString().split('T')[0] // Default to today
  });

  const [ageDisplay, setAgeDisplay] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    if (formData.date_of_birth) {
      calculateAge(formData.date_of_birth);
    }
  }, [formData.date_of_birth]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    // Adjust months calculation if day is earlier
    if (today.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) months += 12;
    }
    
    // Let's stick to a simpler approximation or standard library logic if available.
    // Correct logic:
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        m += 12;
    }
    // If we decremented year, m is correct. 
    
    setAgeDisplay(`${years} años, ${m % 12} meses`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/patients/', formData)
      .then(() => {
        navigate('/');
      })
      .catch(error => console.error('Error creating patient:', error));
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Ficha de Identificación del Paciente</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Names */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Nombre" name="first_name" onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Apellido Paterno" name="paternal_last_name" onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Apellido Materno" name="maternal_last_name" onChange={handleChange} />
          </Grid>

          {/* Demographics */}
          <Grid item xs={12} sm={4}>
            <TextField 
                fullWidth 
                label="Fecha de nacimiento" 
                name="date_of_birth" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                onChange={handleChange} 
                required 
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
                fullWidth 
                label="Edad" 
                value={ageDisplay} 
                InputProps={{ readOnly: true }} 
                helperText="Calculada automáticamente"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
             <TextField select fullWidth label="Sexo" name="gender" value={formData.gender} onChange={handleChange} required>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
             </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Lugar de residencia" name="place_of_residence" onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={3}>
             <TextField select fullWidth label="Estado Civil" name="marital_status" value={formData.marital_status} onChange={handleChange}>
                <MenuItem value="Soltero/a">Soltero/a</MenuItem>
                <MenuItem value="Casado/a">Casado/a</MenuItem>
                <MenuItem value="Divorciado/a">Divorciado/a</MenuItem>
                <MenuItem value="Viudo/a">Viudo/a</MenuItem>
                <MenuItem value="Unión Libre">Unión Libre</MenuItem>
             </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Orientación Sexual" name="sexual_orientation" onChange={handleChange} />
          </Grid>

          {/* Contact */}
          <Grid item xs={12}>
            <TextField fullWidth label="Domicilio" name="address" multiline rows={2} onChange={handleChange} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Número Celular" name="mobile_number" onChange={handleChange} />
            <FormControlLabel
                control={<Checkbox checked={formData.whatsapp_is_mobile} onChange={handleChange} name="whatsapp_is_mobile" />}
                label="WhatsApp es el mismo"
            />
          </Grid>
           <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Número de Contacto (Fijo/Otro)" name="landline_number" onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Correo electrónico" name="email" type="email" onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
                fullWidth 
                label="Fecha de contacto" 
                name="consultation_date" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                value={formData.consultation_date}
                onChange={handleChange} 
            />
          </Grid>

        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
             <Button type="submit" variant="contained" size="large">Guardar</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePatient;
