import React, {useRef, useEffect, useState} from 'react';
import './register.scss';
import { MdHideSource } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";


const Register = ({ closeRegisterModal, openLoginModal, registerRef }) => { // Add registerRef here
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        showPassword: false
    });

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

    return (
        <div className="auth-container" ref={registerRef}> {/* Add ref here */}
            <h2>Register</h2>
            <form>
                <div className="input-group">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={form.lastName}
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
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group password-input">
                    <input
                        type={form.showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <span className='span' onClick={toggleShowPassword}>
                        {form.showPassword ? <MdHideSource className='hideD'/> : <BiShowAlt className='showD'/>}
                    </span>
                </div>
                <button className='button' type="submit">Validate</button>
            </form>
            <p>Already have an account? <a href="#" onClick={handleLoginLinkClick}>Log in now.</a></p>
        </div>
    );
};

export default Register;
