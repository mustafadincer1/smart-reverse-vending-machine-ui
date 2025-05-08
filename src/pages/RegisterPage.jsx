/* src/pages/RegisterPage.jsx */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from '../components/Layout';
import './RegisterPage.css';

const RegisterPage = () => {
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        // kayıt işlemi
    };

    return (
        <Layout>
            <div className="register-page">
                <main>
                    {/* orijinal kayıt içeriği buraya */}
                </main>
            </div>
        </Layout>
    );
};

export default RegisterPage;