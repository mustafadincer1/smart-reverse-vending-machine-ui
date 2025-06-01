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
/*    const [isOptimalSize, setIsOptimalSize] = useState(true);*/
    const navigate = useNavigate();
    const { setToken } = useAuth();

    //useEffect(() => {
    //    const checkSize = () => {
    //        const w = window.innerWidth;
    //        const h = window.innerHeight;
    //        const ok = w === 800 && h === 1280;
    //        setIsOptimalSize(ok);
    //        if (!ok) console.warn(`Optimal ekran 800×1280. Şu anki boyut: ${w}×${h}`);
    //    };
    //    checkSize();
    //    window.addEventListener('resize', checkSize);
    //    return () => window.removeEventListener('resize', checkSize);
    //}, []);

    const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });
    const goToMain = () => {
        navigate('/');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const phoneNumber = values.phone.replace(/\s/g, '');
        if (!phoneNumber || !values.password) return setError('Lütfen tüm alanları doldurun.');
        if (!/^[0-9]{10}$/.test(phoneNumber)) return setError('Telefon numarası 10 haneli olmalıdır.');

        try {
            setLoading(true);
            setError('');
            const loginRes = await axios.post(
                'http://192.168.1.102:5190/api/Auth/login',
                { phoneNumber, password: values.password }
            );
            const { token, isAdmin } = loginRes.data;
            setToken(token);
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.Error || 'Giriş başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <main className="main">
                <div className="login-form">
                    <h2>GİRİŞ YAP</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="phone">Telefon Numarası</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={values.phone}
                            onChange={handleChange}
                            inputMode="numeric"     
                            pattern="[0-9]*"        
                            placeholder="5XX XXX XXXX"
                            required
                        />

                        <label htmlFor="password">Parola</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={values.password}
                            onChange={handleChange}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                        />

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Yükleniyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                    <div className="form-links">
                        <button
                            type="button"
                            className="forgot-password"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Parolamı Unuttum?
                        </button>

                    </div>
                    <div className="register-link">
                        Hesabınız yok mu? <a href="#/register">Kayıt Ol</a>
                    </div>

                </div>
                <div className="back-container" onClick={goToMain}>
                    <img
                        src={`${process.env.PUBLIC_URL}/ikons/left.png`}
                        alt="Ana sayfaya dön"
                        className="return-icon"
                    />
                    <span className="back-text">Ana sayfaya dön</span>
                </div>
            </main>
        </Layout>
    );
};

export default LoginPage;
