import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Checkbox, FormControlLabel, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '120vh',
  alignItems: 'center',
  justifyContent: 'center',
  background: `url(${require('./img.png')}) no-repeat center center fixed`,
  backgroundSize: 'cover',
}));

const FormContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(4),
  borderRadius: '8px',
  maxWidth: '500px',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#3f51b5',
  color: 'white',
}));

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [object, setObject] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseColor, setResponseColor] = useState('');
  const [showForm, setShowForm] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setResponseMessage('Invalid email address');
      setResponseColor('red');
      return;
    }

    const contactData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      Object: object,
      message: message,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/email/contact', contactData);

      if (response.status === 201) {
        setResponseMessage('Message sent successfully!');
        setResponseColor('green');
        setFirstName('');
        setLastName('');
        setEmail('');
        setObject('');
        setMessage('');
        setTimeout(() => {
          setShowForm(false);
        }, 3000);
      } else {
        setResponseMessage('An error occurred while sending the message.');
        setResponseColor('red');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred while sending the message.');
      setResponseColor('red');
    }
  };

  if (!showForm) {
    return (
      <div>
          <Root>
          <FormContainer>
            <Typography variant="h5" gutterBottom style={{ color: responseColor }}>
              {responseMessage}
            </Typography>
            {responseColor === 'green' && (
              <Typography variant="body1" gutterBottom>
                <Link href="/contact" style={{ color: '#3f51b5' }}>
                  Send a new message
                </Link>
              </Typography>
            )}
          </FormContainer>
         
      </Root>
      </div>
    );
  }

  return (
  <>
    <Root>
      <FormContainer>
        <Typography variant="h4" gutterBottom>
          Let's talk about the future
        </Typography>
        <Typography variant="body1" gutterBottom>
          We're here to answer your questions and discuss the decentralized future of the internet.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First name"
                variant="outlined"
                fullWidth
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last name"
                variant="outlined"
                fullWidth
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email address"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Object"
                variant="outlined"
                fullWidth
                required
                value={object}
                onChange={(e) => setObject(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                required
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="I agree to the terms of use and privacy policy."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <SubmitButton variant="contained" fullWidth type="submit">
                Submit
              </SubmitButton>
            </Grid>
          </Grid>
        </form>
      </FormContainer>
    </Root>
    <Footer/>
    </>
    
  );
}

export default ContactForm;
