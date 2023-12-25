import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Container,
  Box,
} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Login = ({ onLoginSuccess }) => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleContinueShopping = () => {
    history.push('/');
  };

  const checkAuthentication = async () => {
    try {
      const response = await fetch('http://localhost:3010/auth/protected', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        console.log('Token is valid, go to checkout page!');
        onLoginSuccess();
      } else {
        console.log("failed check authentication (fetch protected return response != ok)");
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Start fetch login...');

      const response = await fetch('http://localhost:3010/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Login successful, response: ', response);
        checkAuthentication();
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Could not connect to the server. Please try again later.');
    }
    setLoading(false);

  };

  const handleRegisterAccount = () => {
    history.push('/register');
  };

  const handleForgotPassword = () => {
    history.push('/forgot-password');
  };


  return (
    <Container style={{ marginTop: '50px' }} maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginTop="20px"
        height="100vh"
        background="#f5f5f5"
      >
        <img
          src="./herologo1.png"
          alt="Logo"
          style={{
            maxWidth: '100%',
            marginBottom: '20px',
            width: 'auto',
            maxHeight: '30vh',
          }}
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          border="1px solid #ccc"
          padding="20px"
          borderRadius="5px"
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', margin: '0 8px' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ margin: '0 20px' }}

              >
                Login
              </Button>
              <p>OR</p>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleContinueShopping}
                fullWidth
                style={{ margin: '0 20px' }}

              >
                Continue Shopping
              </Button>
            </div>
          </form>


          {error && (
            <Typography variant="body1" color="error" style={{ marginTop: '10px' }}>
              {error}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="primary"
            onClick={handleForgotPassword}
            style={{ cursor: 'pointer', marginLeft: '8px', marginTop: '15px' }} // Adjust the margin as needed
          >
            Forgot your password?
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleRegisterAccount}
            style={{ marginLeft: '8px', marginTop: '15px' }} // Adjust the margin as needed
          >
            Register New Account
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" m={2}>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Box>
    </Container>);
};

export default Login;
