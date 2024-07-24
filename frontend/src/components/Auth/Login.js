import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import './login.scss';

const Login = ({ close }) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

    return (
        <div className="modalAuth-content">
            <form onSubmit={handleSubmit}>
                <h2>CONNECTEZ-VOUS</h2>
                <p>Please authorize to continue</p>
                <div className="wrapper">
                    <label>Email</label>
                    <input
                        type="email"
                        className="inputLogin"
                        placeholder="iloveyou@gmail.com"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="wrapper">
                    <label>Password</label>
                    <input
                        type="password"
                        className="inputLogin"
                        placeholder="Enter password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="wrapper">
                    <button type="submit" className="login-button">Connectez-vous</button>
                </div>
                <div className="wrapper">
                    <a href="#" className="forgot-password">Forgot your password?</a>
                </div>
                <div className="wrapper">
                    <a href="#" className="create-account">Create account</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
