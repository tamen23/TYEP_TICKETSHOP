import React, { useState } from 'react';
import './organisateurSignUp.scss';
import OrganisateurModal from '../Shared/OrganisateurModal';
import axios from 'axios';
import { MdHideSource } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import Login from '../Auth/Login'; // Correct import of Login component

const OrganisateurSignUp = ({ onClose, show }) => {
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
    const [isRegistered, setIsRegistered] = useState(false); // State to control login modal

    const toggleShowPassword = () => {
        setForm({ ...form, showPassword: !form.showPassword });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        // Validate email and password confirmation
        if (form.email !== form.emailConfirm) {
            setError('Email addresses do not match');
            return;
        }
        if (form.motDePasse !== form.passwordConfirm) {
            setError('Passwords do not match');
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
            alert('Registration successful');
            setIsRegistered(true); // Set state to show login component
        } catch (error) {
            console.error('Registration Error:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.msg : 'Registration failed');
        }
    };

    return (
        <>
            {!isRegistered ? (
                <OrganisateurModal onClose={onClose} show={show}>
                    <div className="signUpForm">
                        <h2>INSCRIVEZ-VOUS</h2>
                        {error && <p className="error">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="formGroup">
                                <input
                                    type="text"
                                    name="nom"
                                    placeholder="Nom *"
                                    value={form.nom}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="prenom"
                                    placeholder="Prénom *"
                                    value={form.prenom}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formGroup">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Adresse e-mail"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                <input
                                    type="email"
                                    name="emailConfirm"
                                    placeholder="Répétez adresse e-mail *"
                                    value={form.emailConfirm}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formGroup password-input">
                                <input
                                    type={form.showPassword ? "text" : "password"}
                                    name="motDePasse"
                                    placeholder="Mot de passe"
                                    value={form.motDePasse}
                                    onChange={handleChange}
                                />
                                <input
                                    type={form.showPassword ? "text" : "password"}
                                    name="passwordConfirm"
                                    placeholder="Répétez mot de passe *"
                                    value={form.passwordConfirm}
                                    onChange={handleChange}
                                />
                                <span className='toggle-password' onClick={toggleShowPassword}>
                                    {form.showPassword ? <MdHideSource className='hide' /> : <BiShowAlt className='show' />}
                                </span>
                            </div>
                            <div className="formGroup">
                                <input
                                    type="text"
                                    name="telephone"
                                    placeholder="N° Téléphone *"
                                    value={form.telephone}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="adresse"
                                    placeholder="Adresse *"
                                    value={form.adresse}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formGroup">
                                <select
                                    name="pays"
                                    value={form.pays}
                                    onChange={handleChange}
                                >
                                    <option value="">Pays</option>
                                    <option value="France">France</option>
                                    <option value="Belgique">Belgique</option>
                                    {/* Add other countries as needed */}
                                </select>
                                <input
                                    type="text"
                                    name="ville"
                                    placeholder="Ville"
                                    value={form.ville}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="codePostal"
                                    placeholder="Code postal *"
                                    value={form.codePostal}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formGroup">
                                <input
                                    type="text"
                                    name="nomDeStructure"
                                    placeholder="Nom de l'organisation *"
                                    value={form.nomDeStructure}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit">S'inscrire</button>
                            <p className="alreadyRegistered">Déjà inscrit</p>
                        </form>
                    </div>
                </OrganisateurModal>
            ) : (
                <OrganisateurModal onClose={onClose} show={show}>
                    <Login close={onClose} />
                </OrganisateurModal>
            )}
        </>
    );
};

export default OrganisateurSignUp;
