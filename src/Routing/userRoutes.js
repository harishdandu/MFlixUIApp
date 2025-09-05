import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/user/login';
import Registration from '../components/user/registration';
import ForgotPassword from '../components/user/forgetPassword';


function UserRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/" element={<Login />} />
        </Routes>
    );
}

export default UserRoutes;
