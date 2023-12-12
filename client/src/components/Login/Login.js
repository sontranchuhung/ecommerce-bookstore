import React, { useState } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Store the token in your preferred way (e.g., localStorage or a state management library)
                console.log('Token:', token);

                // Redirect to the desired route after successful login
                history.push('/');
            } else {
                // If login fails, set the error state
                setError('Invalid email or password. Please try again.');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error during login:', error);
            setError('Could not connect to the server. Please try again later.');
        }
    };

    const handleContinueShopping = () => {
        // Redirect to the home page or any other desired route
        history.push('/');
      };

      return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Login
            </Button>
          </form>
          
          {error && (
            <div style={{ marginTop: '10px', color: 'red' }}>
              {error}
              <br />
              <Button variant="outlined" color="primary" onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      );
    };
    
    export default Login;
