import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@material-ui/core';

const VerifyAccount = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const history = useHistory();
    const { email } = location.state || {};

    const isValidOtp = (otp) => {
        return otp.length === 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidOtp(otp)) {
            setError('Invalid OTP. Please enter a valid 6-digit code.');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        };
        console.log('Request Options:', requestOptions);

        try {
            const response = await fetch('http://localhost:3010/auth/resetAccount/verify-otp', requestOptions);

            console.log('Response Status:', response.status); // Log the response status

            if (!response.ok) {
                throw new Error('Error occurred during OTP verification.');
            }

            const responseData = await response.text(); // Parse the response content as text

            console.log('Response Data:', responseData); // Log the response data

            if (responseData.includes('OTP verified successfully')) {
                history.push('/reset-password', { email });
            } else {
                setError('Authentication failed: ' + responseData);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    return (

        <Container style={{ marginTop: '40px' }} maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4">Verify Account</Typography>
                <Typography variant="subtitle1">{`Email: ${email}`}</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="OTP"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
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
                        Verify OTP
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default VerifyAccount;
