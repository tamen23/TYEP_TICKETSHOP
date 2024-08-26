import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Checkbox, FormControlLabel, Link, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // Ajout pour le placement du footer en bas
  minHeight: '100vh', // Assure que la hauteur est de 100% de la vue
  justifyContent: 'space-between', // Espace entre le contenu et le footer
  background: `url(${require('./img.png')}) no-repeat center center fixed`,
  backgroundSize: 'cover',
}));

const FormContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(4),
  borderRadius: '8px',
  maxWidth: '500px',
  marginTop: theme.spacing(8), // Ajout pour espacer le formulaire du haut
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
  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseColor, setResponseColor] = useState('');
  const [showForm, setShowForm] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(recipient)) {
      setResponseMessage('Invalid email address');
      setResponseColor('red');
      return;
    }

    const contactData = {
      firstName: name,
      lastName: recipient,
      email: recipient,
      subject: subject,
      message: message,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/email/contact', contactData);

      if (response.status === 201) {
        setResponseMessage('Message sent successfully!');
        setResponseColor('green');
        setName('');
        setRecipient('');
        setSubject('');
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
        <Footer /> {/* Footer ajouté ici */}
      </Root>
    );
  }

  return (
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last name"
                variant="outlined"
                fullWidth
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email address"
                variant="outlined"
                fullWidth
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="subject"
                variant="outlined"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
      <Footer /> {/* Footer ajouté ici */}
    </Root>
  );
}

export default ContactForm;
