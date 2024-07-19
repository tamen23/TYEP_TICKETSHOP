import React, { useRef, useState, useEffect } from 'react';
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
        dateDeNaissance: '',
        telephone: '',
        nationalite: '',
        typeIdentification: '',
        motDePasse: '',
        confirmerMotDePasse: '',
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
                dateDeNaissance: form.dateDeNaissance,
                telephone: form.telephone,
                nationalite: form.nationalite,
                typeIdentification: form.typeIdentification,
                motDePasse: form.motDePasse,
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
                    <h2>S'inscrire</h2>
                    <p>Entrez vos informations ci-dessous pour créer votre compte et commencer.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="prenom"
                                placeholder="Prénom"
                                value={form.prenom}
                                onChange={handleChange}
                            />
                        </div>
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
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="date"
                                name="dateDeNaissance"
                                placeholder="Date de naissance"
                                value={form.dateDeNaissance}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                name="telephone"
                                placeholder="Téléphone"
                                value={form.telephone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <select
                                name="nationalite"
                                value={form.nationalite}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Nationalité</option>
                                <option value="France">France</option>
                                <option value="Brazil">Brésil</option>
                                {/* Ajoutez plus d'options ici */}
                            </select>
                        </div>
                        <div className="input-group">
                            <select
                                name="typeIdentification"
                                value={form.typeIdentification}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Type d'identification</option>
                                <option value="Passport">Passeport</option>
                                <option value="ID Card">Carte d'identité</option>
                                {/* Ajoutez plus d'options ici */}
                            </select>
                        </div>
                        <div className="input-group password-input">
                            <input
                                type={form.showPassword ? "text" : "password"}
                                name="motDePasse"
                                placeholder="Mot de passe"
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
