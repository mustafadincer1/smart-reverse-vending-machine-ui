/* src/pages/AdminPage.jsx */
import React from 'react';
import Layout from '../components/Layout';
import './AdminPage.css';

const AdminPage = () => (
    <Layout>
        <div className="admin-page">
            <section className="hero">
                <div className="door-controls">
                    <button className="door-button upper" onClick={() => {/* üst kapıyı aç */ }}>
                        <i className="bi bi-box-arrow-up"></i> Üst Kapıyı Aç
                    </button>
                    <button className="door-button" onClick={() => {/* alt kapıyı aç */ }}>
                        <i className="bi bi-box-arrow-down"></i> Alt Kapıyı Aç
                    </button>
                </div>
            </section>
        </div>
    </Layout>
);

export default AdminPage;