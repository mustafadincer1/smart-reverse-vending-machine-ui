// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { token, transactionNumber } = useAuth();

    const [profile, setProfile] = useState({
        firstName: 'Ali',
        lastName: 'Yılmaz',
        email: 'ali.yilmaz@example.com',
        phone: '0555 123 4567',
        petCount: 45,
        canCount: 23,
        totalReward: 17.5,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // only fetch if we have a token and a transactionNumber
        if (!token || !transactionNumber) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(
                    `http://192.168.1.102:5190/api/user/${transactionNumber}/profile`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = res.data;
                setProfile(prev => ({
                    // keep phone from dummy state (or extend API to return it)
                    phone: prev.phone,
                    firstName: data.FirstName,
                    lastName: data.LastName,
                    email: data.Email,
                    // map API counts to your UI props
                    petCount: data.PlasticCount,
                    canCount: data.MetalCount,
                    totalReward: data.TotalReward,
                }));
            } catch (err) {
                console.warn('Profil yüklenirken hata:', err);
                setError('Profil verisi alınamadı.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, transactionNumber]);

    const handleRecycle = () => {
        navigate('/recycle');
    };

    return (
        <Layout>
            <div className="profile-wrapper">
                <h2 className="profile-title">Profil Bilgileri</h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <div className="profile-container">
                    {/* Sol Panel - Kullanıcı Bilgileri */}
                    <div className="profile-section user-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Ad: </label>
                                <span>{profile.firstName}</span>
                            </div>
                            <div className="info-item">
                                <label>Soyad: </label>
                                <span>{profile.lastName}</span>
                            </div>
                            <div className="info-item">
                                <label>E-posta: </label>
                                <span>{profile.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Telefon: </label>
                                <span>{profile.phone}</span>
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
                                <img src="/ikons/water.png" alt="PET şişe" />
                                <div className="stat-data">
                                    <div className="stat-label">PET Şişe</div>
                                    <div className="stat-value">
                                        {loading ? '…' : profile.petCount}
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <img src="/ikons/can.png" alt="Metal kutu" />
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

                <div className="action-button">
                    <img
                        src={`${process.env.PUBLIC_URL}/ikons/geri-donusume-basla.png`}
                        alt="Geri Dönüşüme Başla"
                        onClick={handleRecycle}
                        className="action-button_icon"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;

