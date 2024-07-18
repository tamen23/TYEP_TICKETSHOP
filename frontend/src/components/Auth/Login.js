import React, { useRef, useEffect, useState, useContext } from 'react';
import { MdHideSource } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import './login.scss';
import ModalAuth from "../Shared/ModalAuth";
import Register from "./Register";

const Login = ({ close }) => {
    const outLogin = useRef(null);
    const registerRef = useRef(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
        showPassword: false
    });

    const { login } = useContext(AuthContext);

    const handleRegister = () => {
        setIsRegistered(true);
    };

    const closeRegisterModal = () => {
        setIsRegistered(false);
    };

    const toggleShowPassword = () => {
        setForm({ ...form, showPassword: !form.showPassword });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClickOutside = (event) => {
        if (
            outLogin.current &&
            !outLogin.current.contains(event.target) &&
            (!registerRef.current || !registerRef.current.contains(event.target))
        ) {
            close();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form.email, form.password);
            alert('Connexion réussie');
            close();
        } catch (error) {
            alert('Échec de la connexion');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                <p className='p'><d>Vous n'avez pas de compte ?</d> <a href="#" onClick={handleRegister}>Inscrivez-vous gratuitement</a></p>
            </div>
       
            {
                isRegistered && <ModalAuth show={isRegistered} onClose={closeRegisterModal}>
                    <Register closeRegisterModal={closeRegisterModal} openLoginModal={close} registerRef={registerRef} />
                </ModalAuth>
            }
        </div>
    );
};

export default Login;
