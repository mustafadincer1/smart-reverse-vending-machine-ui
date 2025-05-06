import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    // Başlangıçta boş obje ile başla, loading state yok
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        petCount: 0,
        canCount: 0,
        totalReward: 0
    });

    useEffect(() => {
        fetch('/api/profile')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                // Gelen veriyi doğrudan state'e ata; eksik alan varsa boş bırakır
                setProfile(prev => ({ ...prev, ...data }));
            })
            .catch(err => {
                console.error('Profile yüklenemedi, varsayılan değerlerle devam ediliyor:', err);
                // Hata durumunda da kullanıcı sayfayı boş veriyle görecek
            });
    }, []);

    const {
        firstName,
        lastName,
        email,
        phone,
        petCount,
        canCount,
        totalReward
    } = profile;

    return (
        <div className="profile-page">
            <header className="header">
                <div className="container-fluid">
                    <a className="logo d-flex align-items-center">
                        <h1>Akıllı Geri Dönüşüm Otomatı</h1>
                    </a>
                    <a>
                        <img
                            src="ikons/atkazan.png"
                            alt="At Kazan Logo"
                            className="logo-img"
                        />
                    </a>
                </div>
            </header>

            <main className="main hero section">
                <div className="profile-container">
                    {/* Sol panel */}
                    <div className="profile-info">
                        <div className="info-item">
                            <label>İsim Soyisim</label>
                            <span>{firstName || '—'} {lastName || ''}</span>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <span>{email || '—'}</span>
                        </div>
                        <div className="info-item">
                            <label>Telefon</label>
                            <span>{phone || '—'}</span>
                        </div>
                        <button
                            className="change-pw-btn"
                            onClick={() => {
                                /* parolayı değiştirme fonksiyonu */
                            }}
                        >
                            Parolayı Değiştir
                        </button>
                    </div>

                    {/* Sağ panel */}
                    <div className="profile-stats">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <img src="ikons/water.png" alt="Dönüştürülen PET" />
                                <div className="stat-label">Dönüştürülen PET</div>
                                <div className="stat-value">{petCount}</div>
                            </div>
                            <div className="stat-item">
                                <img src="ikons/can.png" alt="Dönüştürülen Teneke" />
                                <div className="stat-label">Dönüştürülen Teneke</div>
                                <div className="stat-value">{canCount}</div>
                            </div>
                        </div>

                        <div className="total-earnings">
                            <div className="stat-label">Toplam Kazanç</div>
                            <div className="stat-value">₺{totalReward.toFixed(2)}</div>
                        </div>

                        <button
                            className="start-btn"
                            onClick={() => navigate('/recycle')}
                        >
                            Yeni İşleme Başla
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
