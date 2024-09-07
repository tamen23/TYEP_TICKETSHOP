import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, IconButton, InputAdornment } from '@mui/material';
import { MdHideSource } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import axios from 'axios';
import Login from '../Auth/Login';

const OrganisateurSignUp = ({ switchToLogin }) => {
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        emailConfirm: '',
        motDePasse: '',
        passwordConfirm: '',
        telephone: '',
        adresse: '',
        pays: '',
        ville: '',
        codePostal: '',
        nomDeStructure: '',
        showPassword: false
    });

    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const toggleShowPassword = () => {
        setForm((prevForm) => ({ ...prevForm, showPassword: !prevForm.showPassword }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (form.email !== form.emailConfirm) {
            setError('Les adresses e-mail ne correspondent pas.');
            return;
        }
        if (form.motDePasse !== form.passwordConfirm) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', {
                role: 'organisateur',
                nom: form.nom,
                prenom: form.prenom,
                email: form.email,
                motDePasse: form.motDePasse,
                telephone: form.telephone,
                nomDeStructure: form.nomDeStructure,
                adresse: form.adresse,
                pays: form.pays,
                ville: form.ville,
                codePostal: form.codePostal
            });

            console.log('Registration Response:', response.data);
            alert('Inscription réussie');
            setIsRegistered(true);
        } catch (error) {
            console.error('Registration Error:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.msg : 'L\'inscription a échoué');
        }
    };

    return (
        <>
            {!isRegistered ? (
                <>
                    <Container maxWidth="sm">
                        <Typography variant="h4" gutterBottom>INSCRIVEZ-VOUS</Typography>
                        {error && <Typography color="error">{error}</Typography>}
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom *"
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Prénom *"
                                        name="prenom"
                                        value={form.prenom}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Adresse e-mail *"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Répétez adresse e-mail *"
                                        name="emailConfirm"
                                        type="email"
                                        value={form.emailConfirm}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Mot de passe *"
                                        type={form.showPassword ? "text" : "password"}
                                        name="motDePasse"
                                        value={form.motDePasse}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={toggleShowPassword}>
                                                        {form.showPassword ? <MdHideSource /> : <BiShowAlt />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Répétez mot de passe *"
                                        type={form.showPassword ? "text" : "password"}
                                        name="passwordConfirm"
                                        value={form.passwordConfirm}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={toggleShowPassword}>
                                                        {form.showPassword ? <MdHideSource /> : <BiShowAlt />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="N° Téléphone *"
                                        name="telephone"
                                        value={form.telephone}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Adresse *"
                                        name="adresse"
                                        value={form.adresse}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Pays *"
                                        name="pays"
                                        value={form.pays}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ville *"
                                        name="ville"
                                        value={form.ville}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Code postal *"
                                        name="codePostal"
                                        value={form.codePostal}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nom de l'organisation *"
                                        name="nomDeStructure"
                                        value={form.nomDeStructure}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth variant="contained" color="primary" type="submit">
                                        S'inscrire
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body2"
                                        align="center"
                                        className="alreadyRegistered"
                                        onClick={switchToLogin}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Déjà inscrit
                                    </Typography>
                                </Grid>
                            </Grid>
                        </form>
                    </Container>
                </>
            ) : (
                <Login />
            )}
        </>
    );
};

export default OrganisateurSignUp;
