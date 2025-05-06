import React from "react";
import "./AdminPage.css";

const AdminPage = () => {
    // TODO: Burada üst/alt kapı açma fonksiyonlarını ekleyebilirsin.
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
                            onClick={() => {
                                /* üst kapıyı aç */
                            }}
                        >
                            <i className="bi bi-box-arrow-up"></i>
                            Üst Kapıyı Aç
                        </button>
                        <button
                            className="door-button"
                            onClick={() => {
                                /* alt kapıyı aç */
                            }}
                        >
                            <i className="bi bi-box-arrow-down"></i>
                            Alt Kapıyı Aç
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminPage;
