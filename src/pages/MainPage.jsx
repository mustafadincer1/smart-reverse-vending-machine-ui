import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";


const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    const toggleScrolled = () => {
      const body = document.querySelector("body");
      if (window.scrollY > 100) {
        body.classList.add("scrolled");
      } else {
        body.classList.remove("scrolled");
      }
    };

    const scrollTopBtn = document.querySelector(".scroll-top");

    const toggleScrollTop = () => {
      if (window.scrollY > 100) {
        scrollTopBtn?.classList.add("active");
      } else {
        scrollTopBtn?.classList.remove("active");
      }
    };

    scrollTopBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleScrolled);
    window.addEventListener("scroll", toggleScrollTop);
    window.addEventListener("load", toggleScrolled);
    window.addEventListener("load", toggleScrollTop);

    return () => {
      window.removeEventListener("scroll", toggleScrolled);
      window.removeEventListener("scroll", toggleScrollTop);
    };
  }, []);

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className="index-page">
     <header id="header" className="header fixed-top d-flex align-items-center">
  <div className="container-fluid d-flex align-items-center justify-content-between">
    <div className="logo d-flex align-items-center">
      <h1 data-aos="fade-up">Akıllı Geri Dönüşüm Otomatı</h1>
    </div>
    <div>
      <img src="ikons/atkazan.png" width="170px" alt="At Kazan Logo" />
    </div>
  </div>
</header>


      <main className="main">
        <section className="hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 text-center text-lg-start">
                <h1 data-aos="fade-up">AT KAZAN</h1>
                <p data-aos="fade-up" data-aos-delay="100">
                  Doğayı Kurtarmak İçin Geri Dönüştür
                </p>
              </div>
              <div className="col-lg-6 text-center hero-img" data-aos="zoom-out">
              <img
                  src={`${process.env.PUBLIC_URL}/ikons/basla.png`}
                  alt="Geri Dönüşüme Başla"
                  onClick={handleStart}
                />

              </div>
            </div>
          </div>
        </section>
      </main>

      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
};

export default MainPage;
