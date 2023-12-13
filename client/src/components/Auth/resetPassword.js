import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@material-ui/core';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const location = useLocation();
    const { email } = location.state || {};

    if (!email) {
        return <p>No email provided.</p>;
    }

    const isValidPassword = (password) => {
        return password.length >= 6; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidPassword(password)) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        };

        try {
            const response = await fetch('http://localhost:3010/resetAccount/reset-password', requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error occurred during password reset.');
            }

            alert('Password reset successfully.');
            history.push('/login'); 
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4">Reset Password</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!error}
                        helperText={error}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: 16 }}
                    >
                        Reset Password
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default ResetPassword;
