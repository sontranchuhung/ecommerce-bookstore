import React from 'react';
import { Typography, Button, Paper } from '@material-ui/core';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h5" component="h3">
          Page Not Found
        </Typography>
        <Typography variant="body1">
          The page you are looking for does not exist.
        </Typography>
        <Button variant="contained" color="primary" href="/">
          Go to Home
        </Button>
      </Paper>
    </div>
  );
};

export default NotFound;
