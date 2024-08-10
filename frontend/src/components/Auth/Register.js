import * as React from 'react';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ApiService from '../../api'; // Importez le service ApiService

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const validationSchema = Yup.object({
  nom: Yup.string().required('Nom est requis'),
  prenom: Yup.string().required('Prénom est requis'),
  email: Yup.string().email('Email invalide').required('Email est requis'),
  motDePasse: Yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Mot de passe est requis'),
  confirmerMotDePasse: Yup.string().oneOf([Yup.ref('motDePasse'), null], 'Les mots de passe ne correspondent pas').required('Confirmation du mot de passe est requise'),
  telephone: Yup.string().matches(/^\d+$/, 'Le téléphone doit contenir uniquement des chiffres').required('Téléphone est requis'),
});

const Register = ({ close, switchToLogin }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      confirmerMotDePasse: '',
      telephone: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await ApiService.register({
          role: 'utilisateur',
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          motDePasse: values.motDePasse,
          telephone: values.telephone,
        });
        alert('Inscription réussie');
        switchToLogin(); // Bascule vers le formulaire de connexion après une inscription réussie
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response);
          setErrorMessage(error.response.data.message || 'Une erreur s\'est produite lors de l\'inscription');
        } else {
          console.error('Error:', error.message);
          setErrorMessage('Échec de l\'inscription');
        }
      }
      setSubmitting(false);
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inscription
          </Typography>
          {errorMessage && (
            <Box sx={{ mt: 2 }}>
              <Typography color="error">{errorMessage}</Typography>
            </Box>
          )}
          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="prenom"
                  required
                  fullWidth
                  id="prenom"
                  label="Prénom"
                  autoFocus
                  value={formik.values.prenom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prenom && Boolean(formik.errors.prenom)}
                  helperText={formik.touched.prenom && formik.errors.prenom}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="nom"
                  label="Nom"
                  name="nom"
                  autoComplete="family-name"
                  value={formik.values.nom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nom && Boolean(formik.errors.nom)}
                  helperText={formik.touched.nom && formik.errors.nom}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="motDePasse"
                  label="Mot de passe"
                  type="password"
                  id="motDePasse"
                  autoComplete="new-password"
                  value={formik.values.motDePasse}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.motDePasse && Boolean(formik.errors.motDePasse)}
                  helperText={formik.touched.motDePasse && formik.errors.motDePasse}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmerMotDePasse"
                  label="Confirmer le mot de passe"
                  type="password"
                  id="confirmerMotDePasse"
                  autoComplete="new-password"
                  value={formik.values.confirmerMotDePasse}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmerMotDePasse && Boolean(formik.errors.confirmerMotDePasse)}
                  helperText={formik.touched.confirmerMotDePasse && formik.errors.confirmerMotDePasse}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="telephone"
                  label="Téléphone"
                  id="telephone"
                  autoComplete="tel"
                  value={formik.values.telephone}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^\d*$/.test(value)) {
                      formik.handleChange(e);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.telephone && Boolean(formik.errors.telephone)}
                  helperText={formik.touched.telephone && formik.errors.telephone}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
            >
              Inscription
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={switchToLogin}>
                  Vous avez déjà un compte ? Connectez-vous
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Register;
