/* src/pages/CompletePage.jsx */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './CompletePage.css';

const CompletePage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [showScroll, setShowScroll] = useState(false);
    const [countdown, setCountdown] = useState(8);

    // İlk işlemden gelen seçenekler (TransactionPage'den)
    const selectedOption = state?.selectedOption || 'Bağış Seçeneği';
    const totalReward = state?.totalReward || 0;

    // Otomatik yönlendirme için geri sayım
    useEffect(() => {
        const timer = setTimeout(() => navigate('/'), 8000);

        // Geri sayım için ayrı bir interval
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }, [navigate]);

    // Scroll kontrolü
    useEffect(() => {
        const onScroll = () => setShowScroll(window.pageYOffset > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // İkonlar - çevre koruma ve sürdürülebilirlik simgeleri
    const icons = [
        { alt: 'Denizleri Koru', src: 'ikons/denizleri-koru.png' },
        { alt: 'Ormanları Koru', src: 'ikons/ormanlari-koru.png' },
        { alt: 'Havayı Koru', src: 'ikons/havayi-koru.png' },
        { alt: 'Geleceği Koru', src: 'ikons/gelecegi-koru.png' },
    ];

    return (
        <Layout>
           
                <img
                    src="ikons/atkazan-harfli.png"
                    alt="AtKazan Logo"
                    className="logo-main"
                />

                <div className="message-box">
                    <h1 className="complete-title">İŞLEMİNİZ TAMAMLANMIŞTIR</h1>

                    {totalReward > 0 && (
                        <p className="points-info">
                            {selectedOption === 'Kendi Hesabıma Aktar'
                                ? `₺${totalReward.toFixed(2)} HESABINIZA 15 dk. İÇİNDE AKTARILACAKTIR`
                                : `₺${totalReward.toFixed(2)} TUTARINDA ${selectedOption} BAĞIŞINIZ YAPILMIŞTIR`
                            }
                        </p>
                    )}

                    {!state && (
                        <p className="points-info">PUANLARINIZ 15 dk. İÇİNDE YÜKLENECEKTİR</p>
                    )}
                </div>

                <div className="icons-container">
                    {icons.map(item => (
                        <div key={item.alt} className="icon-item">
                            <img src={item.src} alt={item.alt} />
                        </div>
                    ))}
                </div>

                {/* Ana Sayfaya Dön Butonu */}
                <button
                    className="home-button"
                    onClick={() => navigate("/")}
                >
                    Ana Sayfaya Dön ({countdown})
                </button>

                {showScroll && (
                    <button
                        className="scroll-top"
                        onClick={scrollToTop}
                        aria-label="Yukarı Çık"
                    >
                        ↑
                    </button>
                )}

        </Layout>
    );
};

export default CompletePage;