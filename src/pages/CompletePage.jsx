import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompletePage.css";

const CompletePage = () => {
    const navigate = useNavigate();
    const [showScroll, setShowScroll] = useState(false);

    // 8 saniye sonra ana sayfaya yönlendir
    useEffect(() => {
        const timer = setTimeout(() => navigate("/"), 8000);
        return () => clearTimeout(timer);
    }, [navigate]);

    // Scroll-to-Top butonunu göster/gizle
    useEffect(() => {
        const onScroll = () => {
            setShowScroll(window.pageYOffset > 300);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () =>
        window.scrollTo({ top: 0, behavior: "smooth" });

    const icons = [
        { alt: "Denizleri Koru", src: "ikons/denizleri-koru.png" },
        { alt: "Ormanları Koru", src: "ikons/ormanlari-koru.png" },
        { alt: "Havayı Koru", src: "ikons/havayi-koru.png" },
        { alt: "Geleceği Koru", src: "ikons/gelecegi-koru.png" },
    ];

    return (
        <div className="complete-page">
            <header className="header">
                <h1>Akıllı Geri Dönüşüm Otomatı</h1>
                <img
                    src="ikons/atkazan.png"
                    alt="At Kazan Logo"
                    className="header-logo"
                />
            </header>

            <main className="hero">
                <img
                    src="ikons/atkazan-harfli.png"
                    alt="AtKazan Logo"
                    className="logo-main"
                />

                <div className="message-box">
                    <h1 className="complete-title">
                        İŞLEMİNİZ TAMAMLANMIŞTIR
                    </h1>
                    <p className="points-info">
                        PUANLARINIZ 15 dk. İÇİNDE YÜKLENECEKTİR
                    </p>
                </div>

                <div className="icons-container">
                    {icons.map((item) => (
                        <div key={item.alt} className="icon-item">
                            <img src={item.src} alt={item.alt} />
                        </div>
                    ))}
                </div>
            </main>

            {showScroll && (
                <button
                    className="scroll-top"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default CompletePage;
