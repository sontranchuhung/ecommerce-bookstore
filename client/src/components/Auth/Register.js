import React, { useState, useEffect } from 'react';
import {
    Typography,
    TextField,
    Button,
    Container,
    Box
} from '@material-ui/core';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [countdown, setCountdown] = useState(10);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isValidEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
      
        if (!isValidEmail(formData.email)) {
          setError('Invalid email address.');
          return;
        }
      
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
      
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        };
      
        try {
          const response = await fetch('http://localhost:3010/auth/register', requestOptions);
          const data = await response.json();
      
          if (response.status === 201) {
            alert('Registration successful.'); // Show an alert message
            window.location.href = '/login'; // Redirect to login page
          } else {
            // 409 Conflict status code
            if (response.status === 409) {
              setError('This email has already been registered.');
            } else {
              throw new Error(data.message || 'Error occurred during registration.');
            }
          }
        } catch (error) {
          setError(error.message);
        }
      };
      
      const handleToLogin = () => {
        setCountdown(0); 
    };

    useEffect(() => {
        if (countdown === 0) {
            window.location.href = '/login'; // Redirect to login page
        }
    }, [countdown]);

    return (
      <Container style={{ marginTop: '40px', border: '1px solid #ccc', borderRadius: '5px', padding: '20px' }} maxWidth="sm">
          <Box my={4} display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h4">Register</Typography>
              <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
                  <TextField
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                  />
                  <TextField
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                  />
                  <TextField
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                  />
                  {error && (
                      <Typography color="error">{error}</Typography>
                  )}
                  {successMessage && (
                      <Typography color="primary">{successMessage} ({countdown})</Typography>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                      <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleToLogin}
                          >
                          Back to Login
                      </Button>
                      <Button
                          type="submit"
                          color="primary"
                          variant="contained"
                      >
                          Register
                      </Button>
                  </div>
              </form>
          </Box>
      </Container>
  );
}

export default Register;
