// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        firstName: 'Ali',
        lastName: 'Yılmaz',
        email: 'ali.yilmaz@example.com',
        phone: '0555 123 4567',
        petCount: 45,
        canCount: 23,
        totalReward: 17.5
    });

    useEffect(() => {
        // TODO: API'den profil verisini çekip setProfile ile güncelle
    }, []);

    return (
        <Layout>
            <div className="profile-wrapper">
                <h2 className="profile-title">Profil Bilgileri</h2>

                <div className="profile-container">
                    {/* Sol Panel - Kullanıcı Bilgileri */}
                    <div className="profile-section user-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Ad</label>
                                <span>{profile.firstName}</span>
                            </div>
                            <div className="info-item">
                                <label>Soyad</label>
                                <span>{profile.lastName}</span>
                            </div>
                            <div className="info-item">
                                <label>E-posta</label>
                                <span>{profile.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Telefon</label>
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
                                    <div className="stat-value">{profile.petCount}</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <img src="/ikons/can.png" alt="Metal kutu" />
                                <div className="stat-data">
                                    <div className="stat-label">Metal Kutu</div>
                                    <div className="stat-value">{profile.canCount}</div>
                                </div>
                            </div>
                        </div>

                        <div className="total-card">
                            <div className="total-label">Toplam Kazanç</div>
                            <div className="total-value">{profile.totalReward.toFixed(2)} TL</div>
                        </div>
                    </div>
                </div>

                <button
                    className="action-button"
                    onClick={() => navigate('/recycle')}
                >
                    Yeni İşleme Başla
                </button>
            </div>
        </Layout>
    );
};

export default ProfilePage;