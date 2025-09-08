import React, { useState, useEffect } from 'react';
import '../../App.css';
import '../../stylesheets/login.css';
import { loginAPI } from '../../services/loginService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login submitted:", formData);
        // API integration here
        const response = await loginAPI(formData);
        if (response) {
            console.log("Login successful:", response);
        }else{
            console.log("Login failed");
        }
    };

    return (
        <div className="login-container">
            {/* Bubble background */}
            <div className="bubbles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Login card */}
            <div className="login-card shadow-lg p-4 rounded">
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <a href="/User/register" className="text-decoration-underline">
                        Create an account
                    </a>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;