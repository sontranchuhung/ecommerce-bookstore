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
            const response = await fetch('http://localhost:3010/register', requestOptions);
            const data = await response.json();

            if (response.status === 201) {
                setSuccessMessage('Registration successful. You will be redirected to login page in 10 seconds.');
                const intervalId = setInterval(() => {
                  setCountdown((prevCountdown) => prevCountdown - 1);
                }, 1000);

                setTimeout(() => {
                  clearInterval(intervalId);
                  window.location.href = '/login'; // Redirect to login page
                }, 10000);
            } else {
                throw new Error(data.message || 'Error occurred during registration.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
      if (countdown === 0) {
        window.location.href = '/login'; // Redirect to login page
      }
    }, [countdown]);

    return (
        <Container style={{ marginTop: '40px' }} maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4">Register</Typography>
                <form onSubmit={handleSubmit} noValidate>
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
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: 16 }}
                    >
                        Register
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Register;
