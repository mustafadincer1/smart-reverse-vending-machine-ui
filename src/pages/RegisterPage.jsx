import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import './RegisterPage.css';

const RegisterPage = () => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Timeout için referans
    const timeoutRef = useRef(null);

    // Timeout sıfırlama fonksiyonu
    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            navigate('/');
        }, 45000);
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
    const handleChange = e => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const goToMain = () => {
        navigate('/');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const phoneNumber = values.phone.replace(/\s/g, '');
        if (
            !values.firstName ||
            !values.lastName ||
            !phoneNumber ||
            !values.email ||
            !values.password ||
            !values.confirmPassword
        ) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            setError('Telefon numarası 10 haneli olmalıdır.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(values.email)) {
            setError('Geçerli bir e-posta adresi girin.');
            return;
        }
        if (values.password !== values.confirmPassword) {
            setError('Parolalar uyuşmuyor.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await axios.post('http://192.168.1.102:5190/api/Auth/register', {
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber,
                email: values.email,
                password: values.password
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.Error || 'Kayıt başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <main className="main">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2>KAYIT OL</h2>
                    {error && <div className="error-message">{error}</div>}

                    <label htmlFor="firstName">İsim</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        inputMode="text"
                        pattern="[a-zA-ZğüşöçıİĞÜŞÖÇ\s]*"
                        placeholder="Adınız"
                        autoComplete="given-name"
                        required
                    />

                    <label htmlFor="lastName">Soyisim</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        inputMode="text"
                        pattern="[a-zA-ZğüşöçıİĞÜŞÖÇ\s]*"
                        placeholder="Soyadınız"
                        autoComplete="family-name"
                        required
                    />

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
                        data-type="numeric"
                        enterKeyHint="next"
                        autoComplete="tel"
                        required
                    />

                    <label htmlFor="email">E-posta</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={values.email}
                        onChange={handleChange}
                        inputMode="email"
                        placeholder="ornek@mail.com"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Parola</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />

                    <label htmlFor="confirmPassword">Parola Tekrar</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />

                    <button type="submit" className="btn-register" disabled={loading}>
                        {loading ? 'Yükleniyor...' : 'Kayıt Ol'}
                    </button>

                    <div className="login-link">
                        Zaten hesabınız var mı? <a href="#/login">Giriş Yap</a>
                    </div>
                </form>

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

export default RegisterPage;