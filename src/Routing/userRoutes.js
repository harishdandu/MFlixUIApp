import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/user/login';
import Registration from '../components/user/registration';
import ForgotPassword from '../components/user/forgetPassword';
import PdfPreview from '../components/user/PdfPreview';

function UserRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/pdf" element={<PdfPreview />} />
            <Route path="/" element={<Login />} />
        </Routes>
    );
}

export default UserRoutes;
