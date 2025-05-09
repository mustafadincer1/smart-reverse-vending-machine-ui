import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
    const { token } = useAuth();
    const [loadingUpper, setLoadingUpper] = useState(false);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleOpenUpper = async () => {
        try {
            setLoadingUpper(true);
            setMessage('');
            setError('');
            await axios.post(
                'http://192.168.1.102:5190/api/Door/open-upper',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Üst kapı başarıyla açıldı.');
        } catch (err) {
            setError(err.response?.data?.Error || 'Üst kapı açılamadı.');
        } finally {
            setLoadingUpper(false);
        }
    };

    const handleOpenBottom = async () => {
        try {
            setLoadingBottom(true);
            setMessage('');
            setError('');
            await axios.post(
                'http://192.168.1.102:5190/api/Door/open-bottom',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Alt kapı başarıyla açıldı.');
        } catch (err) {
            setError(err.response?.data?.Error || 'Alt kapı açılamadı.');
        } finally {
            setLoadingBottom(false);
        }
    };

    return (
        <Layout>
            <section className="hero admin-hero">
                <div className="door-controls">
                    <button
                        className="door-button upper"
                        onClick={handleOpenUpper}
                        disabled={loadingUpper}
                    >
                        {loadingUpper ? 'Bekleniyor...' : <><i className="bi bi-box-arrow-up"></i> Üst Kapıyı Aç</>}
                    </button>
                    <button
                        className="door-button"
                        onClick={handleOpenBottom}
                        disabled={loadingBottom}
                    >
                        {loadingBottom ? 'Bekleniyor...' : <><i className="bi bi-box-arrow-down"></i> Alt Kapıyı Aç</>}
                    </button>
                </div>

                {message && <div className="message success">{message}</div>}
                {error && <div className="message error">{error}</div>}

                <div className="action-buttons">
                    <button className="footer-button close-app" onClick={() => window.close()}>
                        Uygulamayı Kapat
                    </button>
                    <button className="footer-button go-home" onClick={() => window.location.href = '/'}>
                        Ana Sayfaya Dön
                    </button>
                </div>
            </section>
        </Layout>
    );
};

export default AdminPage;