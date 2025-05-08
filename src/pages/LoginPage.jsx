/* src/pages/LoginPage.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
    const [values, setValues] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOptimalSize, setIsOptimalSize] = useState(true);
    const navigate = useNavigate();
    const { setToken, setTransactionNumber } = useAuth();

    useEffect(() => {
        const checkSize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const ok = w === 800 && h === 1280;
            setIsOptimalSize(ok);
            if (!ok) console.warn(`Optimal ekran 800×1280. Şu anki boyut: ${w}×${h}`);
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        const phoneNumber = values.phone.replace(/\s/g, '');
        if (!phoneNumber || !values.password) return setError('Lütfen tüm alanları doldurun.');
        if (!/^[0-9]{10}$/.test(phoneNumber)) return setError('Telefon numarası 10 haneli olmalıdır.');

        try {
            setLoading(true);
            const loginRes = await axios.post('http://localhost:5190/api/Auth/login', { phoneNumber, password: values.password });
            setToken(loginRes.data.token);
            const startRes = await axios.post('http://localhost:5190/api/Transaction/start', {}, { headers: { Authorization: `Bearer ${loginRes.data.token}` } });
            setTransactionNumber(startRes.data.transactionNumber);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.Error || 'Giriş başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="login-page">
                {!isOptimalSize && (
                    <div className="size-warning">
                        Uyarı: Ekran boyutu 800×1280 değil. Optimal görünüm için lütfen tableti doğru oryantasyona getirin.
                    </div>
                )}
                <main className="main">
                    {/* orijinal giriş formu içerikleri buraya */}
                </main>
            </div>
        </Layout>
    );
};

export default LoginPage;
