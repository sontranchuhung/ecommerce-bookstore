import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@material-ui/core';

const RestoreAccount = () => {
    const [email, setEmail] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format');
            return;
        }

        try {
            const response = await fetch('http://localhost:3010/resetAccount/send-opt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                history.push('/verifyAccount', { email, step: 'verify' });
            } else {
                alert('Failed to send OTP. Please try again later.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('An error occurred while sending OTP. Please try again later.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4">Restore Account</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: 16 }}
                    >
                        Send OTP
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default RestoreAccount;
