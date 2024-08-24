import React, { useRef, useEffect, useState, useContext } from 'react';
import { MdHideSource } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import AuthContext from '../../context/AuthContext';
import './login.scss';
import ModalAuth from "../Shared/ModalAuth";
import Register from "./Register";

const Login = ({ onClose }) => {
    const outLogin = useRef(null);  // Reference for detecting clicks outside login modal
    const registerRef = useRef(null);  // Reference for the registration modal
    const [isRegistered, setIsRegistered] = useState(false);  // State to toggle registration modal
    const [form, setForm] = useState({
        email: '',
        password: '',
        showPassword: false
    });

    const { login } = useContext(AuthContext);  // Authentication context for login

    // Function to open registration modal
    const handleRegister = () => {
        setIsRegistered(true);
    };

    // Function to close registration modal
    const closeRegisterModal = () => {
        setIsRegistered(false);
    };

    // Function to toggle password visibility
    const toggleShowPassword = () => {
        setForm({ ...form, showPassword: !form.showPassword });
    };

    // Function to handle input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form.email, form.password);
            alert('Connexion réussie');
            onClose();  // Call the onClose prop to close the modal after successful login
        } catch (error) {
            alert('Échec de la connexion');
        }
    };

    // Adding and cleaning up the event listener for clicks outside the modal
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Function to handle clicks outside the login modal
    const handleClickOutside = (event) => {
        if (
            outLogin.current &&
            !outLogin.current.contains(event.target) &&
            (!registerRef.current || !registerRef.current.contains(event.target))
        ) {
            // Handle closing logic if needed
        }
    };

    return (
        <div className='outme' ref={outLogin}>
            <div className="auth-container">
                <h2>Bienvenue</h2>
                <p>Ravi de vous revoir 👋<br />Connectez-vous à votre compte ci-dessous</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            className="input"
                            type="email"
                            name="email"
                            placeholder="Entrez votre email..."
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group password-input">
                        <input
                            className="input"
                            type={form.showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Entrez votre mot de passe..."
                            value={form.password}
                            onChange={handleChange}
                        />
                        <span className='toggle-password' onClick={toggleShowPassword}>
                            {form.showPassword ? <MdHideSource className='hide' /> : <BiShowAlt className='show' />}
                        </span>
                    </div>
                    <button className='button' type="submit">Connexion</button>
                </form>
                <p className='p'>Vous n'avez pas de compte ? <a href="#" onClick={handleRegister}>Inscrivez-vous gratuitement</a></p>
            </div>
       
            {
                isRegistered && <ModalAuth show={isRegistered} onClose={closeRegisterModal}>
                    <Register closeRegisterModal={closeRegisterModal} openLoginModal={() => setIsRegistered(false)} registerRef={registerRef} />
                </ModalAuth>
            }
        </div>
    );
};

export default Login;
