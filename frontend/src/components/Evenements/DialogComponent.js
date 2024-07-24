import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const DialogComponent = ({
    open,
    handleClose,
    handleEmailSubmit,
    user,
    email,
    setEmail,
    emailError
}) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Redirecting to Event Page</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {user
                        ? 'A mail will be sent to your account. Click submit to continue.'
                        : 'Please enter your email address to be redirected to the event page.'
                    }
                </DialogContentText>
                {!user && (
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleEmailSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogComponent;
