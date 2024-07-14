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
            alert('Login successful');
            close();
        } catch (error) {
            alert('Login failed');
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
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group password-input">
                        <input
                            type={form.showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <span className='toggle-password' onClick={toggleShowPassword}>
                            {form.showPassword ? <MdHideSource className='hide' /> : <BiShowAlt className='show' />}
                        </span>
                    </div>
                    <button className='button' type="submit">Validate</button>
                </form>
                <p>Don't have an account? <a href="#" onClick={handleRegister}>Register now.</a></p>
            </div>
            <div className='close' onClick={close}>
                <IoMdClose />
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
