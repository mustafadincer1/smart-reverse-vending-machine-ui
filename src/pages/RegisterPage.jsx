// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

function RegisterPage() {
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phoneNumber = values.phone.replace(/\s/g, "");

        // Basit validasyon
        if (
            !values.firstName ||
            !values.lastName ||
            !phoneNumber ||
            !values.email ||
            !values.password ||
            !values.confirmPassword
        ) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            setError("Telefon numarası 10 haneli olmalıdır.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(values.email)) {
            setError("Geçerli bir e-posta adresi girin.");
            return;
        }
        if (values.password !== values.confirmPassword) {
            setError("Parolalar uyuşmuyor.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Kayıt isteği
            await axios.post("http://localhost:5190/api/Auth/register", {
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber,
                email: values.email,
                password: values.password,
            });

            // Kayıt başarılıysa login sayfasına yönlendir
            navigate("/login");
        } catch (err) {
            const msg = err.response?.data?.Error || "Kayıt başarısız.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <header className="header fixed-top d-flex align-items-center">
                <div className="container-fluid d-flex align-items-center justify-content-between">
                    <div className="logo d-flex align-items-center">
                        <h1>Akıllı Geri Dönüşüm Otomatı</h1>
                    </div>
                    <div>
                        <img src="ikons/atkazan.png" width="170px" alt="Logo" />
                    </div>
                </div>
            </header>

            <main className="main">
                <section className="hero section d-flex align-items-center">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8 col-sm-10">
                                <div className="register-form">
                                    <h2 className="text-center">Kayıt Ol</h2>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="firstName">İsim</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Adınız"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="lastName">Soyisim</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Soyadınız"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
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
                                        <div className="form-group mb-3">
                                            <label htmlFor="email">E-posta</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="ornek@mail.com"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
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
                                        <div className="form-group mb-4">
                                            <label htmlFor="confirmPassword">Parola Tekrar</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-register w-100"
                                            disabled={loading}
                                        >
                                            {loading ? "Yükleniyor..." : "Kayıt Ol"}
                                        </button>
                                        <div className="login-link mt-3">
                                            Zaten hesabınız var mı? <a href="#/login">Giriş Yap</a>
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

export default RegisterPage;
