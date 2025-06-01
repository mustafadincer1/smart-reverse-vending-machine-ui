// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { token, setTransactionNumber } = useAuth();

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        petCount: 0,
        canCount: 0,
        totalReward: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch actual user profile
                const res = await axios.post(
                    'http://192.168.1.102:5190/api/user/profile',
                    {}, 
                    { headers: { Authorization: `Bearer ${token}` } } // headers burada
                    );
                const data = res.data;
                setProfile({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phoneNumber || '',
                    petCount: data.plasticCount ?? 0,
                    canCount: data.metalCount ?? 0,
                    totalReward: data.totalReward ?? 0,
                });
            } catch (err) {
                console.warn('Profil yüklenirken hata:', err);
                setError('Profil verisi alınamadı.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleRecycle = async () => {
        try {
            setError('');
            // Start new transaction when user clicks
            const startRes = await axios.post(
                'http://192.168.1.102:5190/api/Transaction/start',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTransactionNumber(startRes.data.transactionNumber);
            navigate('/recycle');
        } catch (err) {
            console.error('İşlem başlatılamadı:', err);
            setError('Yeni işlem başlatılamadı.');
        }
    };

    const goToMain = () => {
        navigate('/');
    };

    return (
        <Layout>
            <div className="profile-wrapper">
                <div className="profile-header">
                    <div className="back-container-profile" onClick={goToMain}>
                        <img
                            src={`${process.env.PUBLIC_URL}/ikons/left.png`}
                            alt="Ana sayfaya dön"
                            className="return-icon-profile"
                        />
                        {/*<span className="back-text-profile">Ana sayfaya dön</span>*/}
                    </div>
                    <h2 className="profile-title">Profil Bilgileri</h2>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <div className="profile-container">
                    {/* Sol Panel - Kullanıcı Bilgileri */}
                    <div className="profile-section user-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Ad: </label>
                                <span>{profile.firstName || (loading ? '…' : '')}</span>
                            </div>
                            <div className="info-item">
                                <label>Soyad: </label>
                                <span>{profile.lastName || (loading ? '…' : '')}</span>
                            </div>
                            <div className="info-item">
                                <label>E-posta: </label>
                                <span>{profile.email || (loading ? '…' : '')}</span>
                            </div>
                            <div className="info-item">
                                <label>Telefon: </label>
                                <span>{profile.phone || (loading ? '…' : '')}</span>
                            </div>
                        </div>

                        <button className="change-pw-btn">
                            Şifre Değiştir
                        </button>
                    </div>

                    {/* Sağ Panel - İstatistikler */}
                    <div className="profile-section stats-section">
                        <h3 className="stats-title">Geri Dönüşüm İstatistikleri</h3>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <img src={`${process.env.PUBLIC_URL}/ikons/water.png`} alt="PET şişe" />
                                <div className="stat-data">
                                    <div className="stat-label">PET Şişe</div>
                                    <div className="stat-value">
                                        {loading ? '…' : profile.petCount}
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <img src={`${process.env.PUBLIC_URL}/ikons/can.png`} alt="Metal kutu" />
                                <div className="stat-data">
                                    <div className="stat-label">Metal Kutu</div>
                                    <div className="stat-value">
                                        {loading ? '…' : profile.canCount}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="total-card">
                            <div className="total-label">Toplam Kazanç</div>
                            <div className="total-value">
                                {loading
                                    ? '…'
                                    : profile.totalReward.toFixed(2) + ' TL'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-button" onClick={handleRecycle}>
                    <img
                        src={`${process.env.PUBLIC_URL}/ikons/geri-donusume-basla.png`}
                        alt="Geri Dönüşüme Başla"
                        className="action-button_icon"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;