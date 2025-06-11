import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
    const [values, setValues] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setToken } = useAuth();

    // Timeout için referans
    const timeoutRef = useRef(null);

    // Timeout sıfırlama fonksiyonu
    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            navigate('/');
        }, 45000); // 45 saniye
    }, [navigate]);

    useEffect(() => {
        const resetter = () => resetTimeout();
        window.addEventListener("mousemove", resetter);
        window.addEventListener("keydown", resetter);
        window.addEventListener("mousedown", resetter);
        window.addEventListener("touchstart", resetter);

        resetTimeout();

        return () => {
            window.removeEventListener("mousemove", resetter);
            window.removeEventListener("keydown", resetter);
            window.removeEventListener("mousedown", resetter);
            window.removeEventListener("touchstart", resetter);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [resetTimeout]);

    // Telefon numarası için özel değişiklik fonksiyonu
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Sadece rakamları kabul et
        const numericValue = value.replace(/[^0-9]/g, '');
        setValues({ ...values, phone: numericValue });
    };

    // Telefon input'una focus olduğunda sayısal klavyeyi zorunlu kıl
    const handlePhoneFocus = (e) => {
        e.target.setAttribute('inputmode', 'numeric');
        e.target.setAttribute('pattern', '[0-9]*');
        // Electron için ek ayarlar
        if (window.electronAPI) {
            window.electronAPI.setVirtualKeyboard('numeric');
        }
    };

    // Klavye tuşlarını kontrol et
    const handlePhoneKeyPress = (e) => {
        // Sadece sayıları, backspace, delete, tab, enter tuşlarına izin ver
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'];
        if (!allowedKeys.includes(e.key) && !/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    // Diğer alanlar için normal değişiklik fonksiyonu
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
                            onChange={handlePhoneChange}
                            onFocus={handlePhoneFocus}
                            onKeyDown={handlePhoneKeyPress}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="5XXXXXXXXX"
                            maxLength="10"
                            autoComplete="tel"
                            data-type="numeric"
                            enterKeyHint="next"
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
                            autoComplete="current-password"
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