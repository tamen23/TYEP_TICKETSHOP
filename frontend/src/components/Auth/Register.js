import React, { useState, useEffect } from 'react';
import { MdHideSource } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import api from '../../api';
import './register.scss';
import Login from './Login'; // Import the Login component

const Register = ({ closeRegisterModal, openLoginModal, registerRef }) => {
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        telephone: '',
        showPassword: false
    });
    const [isRegistered, setIsRegistered] = useState(false); // State to control login modal

    const toggleShowPassword = () => {
        setForm({ ...form, showPassword: !form.showPassword });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLoginLinkClick = (e) => {
        e.preventDefault();
        closeRegisterModal();
        openLoginModal();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.motDePasse !== form.confirmerMotDePasse) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            const response = await api.post('/auth/register', {
                role: 'utilisateur',
                nom: form.nom,
                prenom: form.prenom,
                email: form.email,
                motDePasse: form.motDePasse,
                telephone: form.telephone,
            });
            alert('Inscription réussie');
            closeRegisterModal(); // Close the registration modal
            setIsRegistered(true); // Set state to show login component
        } catch (error) {
            alert('Échec de l\'inscription');
        }
    };

    const handleClickOutside = (event) => {
        if (registerRef.current && !registerRef.current.contains(event.target)) {
            closeRegisterModal();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);  

    return (
        <div className="auth-container" ref={registerRef}>
            {!isRegistered ? (
                <>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="nom"
                                placeholder="Nom"
                                value={form.nom}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                name="prenom"
                                placeholder="Prenom"
                                value={form.prenom}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                name="telephone"
                                placeholder="Telephone"
                                value={form.telephone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group password-input">
                            <input
                                type={form.showPassword ? "text" : "password"}
                                name="motDePasse"
                                placeholder="Mot de Passe"
                                value={form.motDePasse}
                                onChange={handleChange}
                            />
                            <span className='span' onClick={toggleShowPassword}>
                                {form.showPassword ? <MdHideSource className='hideD' /> : <BiShowAlt className='showD' />}
                            </span>
                        </div>
                        <div className="input-group">
                            <input
                                type={form.showPassword ? "text" : "password"}
                                name="confirmerMotDePasse"
                                placeholder="Confirmer le mot de passe"
                                value={form.confirmerMotDePasse}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="buttons">
                            <button className='button cancel' type="button" onClick={closeRegisterModal}>Annuler</button>
                            <button className='button confirm' type="submit">Confirmer</button>
                        </div>
                    </form>
                    <p>Vous avez déjà un compte ? <a href="#" onClick={handleLoginLinkClick}>Connectez-vous</a></p>
                </>
            ) : (
                <Login close={closeRegisterModal} />
            )}
        </div>
    );
};

export default Register;
