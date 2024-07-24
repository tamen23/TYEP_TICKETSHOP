import React, { useState } from 'react';
import api from '../../api';
import './register.scss';

const Register = ({ close }) => {
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        confirmerMotDePasse: '',
        telephone: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            setForm({ ...form, telephone: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.motDePasse !== form.confirmerMotDePasse) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            await api.post('/auth/register', {
                role: 'utilisateur',
                nom: form.nom,
                prenom: form.prenom,
                email: form.email,
                motDePasse: form.motDePasse,
                telephone: form.telephone,
            });
            alert('Inscription réussie');
            close();
        } catch (error) {
            alert('Échec de l\'inscription');
        }
    };

    return (
        <div className="modalAuth-content">
            <form onSubmit={handleSubmit}>
                <h2>INSCRIVEZ-VOUS</h2>
                <p>Please authorize to continue</p>
                <div className="wrapper">
                    <div className='wrapper-flex'>
                        <div className='wrapper'>
                            <label>Nom</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="inputLogin"
                                    placeholder="Nom"
                                    name="nom"
                                    value={form.nom}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='wrapper'>
                            <label>Prénom</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="inputLogin"
                                    placeholder="Prénom"
                                    name="prenom"
                                    value={form.prenom}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="wrapper">
                    <label>Téléphone</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="inputLogin"
                            placeholder="Téléphone"
                            name="telephone"
                            value={form.telephone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                </div>
                <div className="wrapper">
                    <label>Email</label>
                    <div className="input-group">
                        <input
                            type="email"
                            className="inputLogin"
                            placeholder="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="wrapper">
                    <label>Mot de passe</label>
                    <div className="input-group">
                        <input
                            type="password"
                            className="inputLogin"
                            placeholder="Mot de passe"
                            name="motDePasse"
                            value={form.motDePasse}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="wrapper">
                    <label>Confirmer le mot de passe</label>
                    <div className="input-group">
                        <input
                            type="password"
                            className="inputLogin"
                            placeholder="Confirmer le mot de passe"
                            name="confirmerMotDePasse"
                            value={form.confirmerMotDePasse}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="wrapper">
                    <button type="submit" className="login-button">Inscrivez-vous</button>
                </div>
                <div className="wrapper">
                    <a href="#" className="forgot-password">Forgot your password?</a>
                </div>
                <div className="wrapper">
                    <a href="#" className="create-account" onClick={close}>Connectez-vous</a>
                </div>
            </form>
        </div>
    );
};

export default Register;
