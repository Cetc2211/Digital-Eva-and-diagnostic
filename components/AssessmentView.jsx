import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, CircularProgress } from '@mui/material';

const AssessmentView = () => {
  const { id } = useParams(); // Assessment ID
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Assessment details including instrument and questions
    // Note: In a real app, we might need a separate endpoint or nested serializers to get questions easily.
    // For this prototype, I'll fetch the assessment, then the instrument/questions.
    
    const fetchData = async () => {
      try {
        const assessRes = await axios.get(`http://localhost:8000/api/assessments/${id}/`);
        setAssessment(assessRes.data);
        
        // Fetch instrument details to get questions
        // In the serializer, we might need to expose the instrument ID to fetch it.
        // Or better, let's update the backend to include questions in the assessment response if possible, 
        // OR fetch the instrument separately.
        // Assuming assessment.instrument is the ID.
        
        const instRes = await axios.get(`http://localhost:8000/api/instruments/${assessRes.data.instrument}/`);
        setQuestions(instRes.data.questions);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading assessment", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleResponseChange = (questionId, value, type) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: { value, type }
    }));
  };

  const handleSubmit = async () => {
    // Format responses for API
    const formattedResponses = Object.keys(responses).map(qId => {
      const resp = responses[qId];
      return {
        question_id: qId,
        value: resp.type === 'likert' || resp.type === 'choice' ? resp.value : null,
        text: resp.type === 'text' ? resp.value : ''
      };
    });

    try {
      await axios.post(`http://localhost:8000/api/assessments/${id}/submit_responses/`, {
        responses: formattedResponses
      });
      alert('Assessment submitted!');
      navigate('/'); // Go back to home or patient view
    } catch (error) {
      console.error("Error submitting", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (!assessment) return <Typography>Assessment not found.</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>{assessment.instrument_name}</Typography>
      
      {questions.map((q, index) => (
        <Box key={q.id} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>{index + 1}. {q.text}</Typography>
          
          {q.question_type === 'text' && (
             <TextField 
               fullWidth 
               multiline 
               rows={3} 
               variant="outlined"
               onChange={(e) => handleResponseChange(q.id, e.target.value, 'text')}
             />
          )}

          {(q.question_type === 'likert' || q.question_type === 'choice') && (
            <FormControl component="fieldset">
              <RadioGroup
                onChange={(e) => handleResponseChange(q.id, parseInt(e.target.value), q.question_type)}
              >
                {/* Assuming options is a list of objects or strings. If not provided, use default Likert */}
                {q.options && q.options.length > 0 ? (
                  q.options.map((opt, idx) => (
                    <FormControlLabel 
                      key={idx} 
                      value={opt.value} 
                      control={<Radio />} 
                      label={opt.label} 
                    />
                  ))
                ) : (
                  // Default Likert 1-5 if no options
                  [1, 2, 3, 4, 5].map(val => (
                    <FormControlLabel key={val} value={val} control={<Radio />} label={val.toString()} />
                  ))
                )}
              </RadioGroup>
            </FormControl>
          )}
        </Box>
      ))}

      <Button variant="contained" size="large" onClick={handleSubmit}>
        Submit Assessment
      </Button>
    </Paper>
  );
};

export default AssessmentView;
