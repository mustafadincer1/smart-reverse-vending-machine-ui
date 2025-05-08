// LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./LoginPage.css";

function LoginPage() {
    const [values, setValues] = useState({ phone: "", password: "" });
    const [error, setError] = useState("");
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
            if (!ok) {
                console.warn(`Optimal ekran 800×1280. Şu anki boyut: ${w}×${h}`);
            }
        };
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    const handleChange = (e) =>
        setValues({ ...values, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phoneNumber = values.phone.replace(/\s/g, "");

        if (!phoneNumber || !values.password) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            setError("Telefon numarası 10 haneli olmalıdır.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const loginRes = await axios.post(
                "http://192.168.1.102:5190/api/Auth/login",
                { phoneNumber, password: values.password }
            );
            const token = loginRes.data.token;
            setToken(token);

            const startRes = await axios.post(
                "http://192.168.1.102:5190/api/Transaction/start",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTransactionNumber(startRes.data.transactionNumber);

            navigate("/profile");
        } catch (err) {
            const msg = err.response?.data?.Error || "Giriş başarısız.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {!isOptimalSize && (
                <div className="size-warning">
                    Uyarı: Ekran boyutu 800×1280 değil. Optimal görünüm için lütfen tableti
                    doğru oryantasyona getirin.
                </div>
            )}

            <header className="header fixed-top d-flex align-items-center">
                <div className="container-fluid d-flex align-items-center justify-content-between">
                    <button className="modern-back-btn" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <div className="logo d-flex align-items-center">
                        <h1>Akıllı Geri Dönüşüm Otomatı</h1>
                    </div>
                    <div>
                        <img src="ikons/atkazan.png" width="170" alt="Logo" />
                    </div>
                </div>
            </header>

            <main className="main">
                <section className="hero section d-flex align-items-center">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8 col-sm-10">
                                <div className="login-form">
                                    <h2 className="text-center">Giriş Yap</h2>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-4">
                                            <label htmlFor="phone">Telefon Numarası</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="5XX XXX XXXX"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-4">
                                            <label htmlFor="password">Parola</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-login w-100"
                                            disabled={loading}
                                        >
                                            {loading ? "Yükleniyor..." : "Giriş Yap"}
                                        </button>
                                        <div className="register-link mt-3 text-center">
                                            Hesabınız yok mu?{' '}
                                            <a href="#/register" className="link-button">
                                                Kayıt Ol
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LoginPage;