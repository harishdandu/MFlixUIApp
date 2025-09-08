import React, { useState } from 'react';
import '../../App.css';
import '../../stylesheets/registration.css';
import { registrationAPI } from '../../services//registrationService';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Registration data:', formData);
        const response = await registrationAPI(formData);
        if (response) {
            console.log("Registration successful:", response);
        } else {
            console.log("Registration failed");
        }

    };

    return (
        <div className="registration-container">
            <div className="bubbles"></div>
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
                <div className="text-center mt-3">
                    <a href="/User/login" className="text-decoration-underline">
                        Login
                    </a>

                </div>
            </form>

        </div>
    );
}

export default Registration;