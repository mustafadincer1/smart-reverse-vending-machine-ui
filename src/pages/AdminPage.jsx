import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
    const { token } = useAuth();
    const [loadingUpper, setLoadingUpper] = useState(false);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleOpenUpper = async () => {
        try {
            setLoadingUpper(true);
            setError("");
            setMessage("");
            await axios.post(
                "http://192.168.1.102:5190/api/Door/open-upper",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Üst kapı başarıyla açıldı.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.Error || "Üst kapı açılamadı.");
        } finally {
            setLoadingUpper(false);
        }
    };

    const handleOpenBottom = async () => {
        try {
            setLoadingBottom(true);
            setError("");
            setMessage("");
            await axios.post(
                "http://192.168.1.102:5190/api/Door/open-bottom",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Alt kapı başarıyla açıldı.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.Error || "Alt kapı açılamadı.");
        } finally {
            setLoadingBottom(false);
        }
    };

    const handleCloseApp = () => {
        window.close();
    };

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <div className="admin-page">
            <header className="header">
                <h1>Akıllı Geri Dönüşüm Otomatı</h1>
                <img
                    src="ikons/atkazan.png"
                    alt="At Kazan Logo"
                    className="header-logo"
                />
            </header>

            <main className="main">
                <section className="hero">
                    <div className="door-controls">
                        <button
                            className="door-button upper"
                            onClick={handleOpenUpper}
                            disabled={loadingUpper}
                        >
                            {loadingUpper ? 'Bekleniyor...' : (
                                <><i className="bi bi-box-arrow-up"></i> Üst Kapıyı Aç</>
                            )}
                        </button>
                        <button
                            className="door-button"
                            onClick={handleOpenBottom}
                            disabled={loadingBottom}
                        >
                            {loadingBottom ? 'Bekleniyor...' : (
                                <><i className="bi bi-box-arrow-down"></i> Alt Kapıyı Aç</>
                            )}
                        </button>
                    </div>

                    {message && <div className="alert alert-success mt-3">{message}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                    <div className="action-buttons">
                        <button className="footer-button close-app" onClick={handleCloseApp}>
                            Uygulamayı Kapat
                        </button>
                        <button className="footer-button go-home" onClick={handleGoHome}>
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminPage;
