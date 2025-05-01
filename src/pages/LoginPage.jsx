import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./LoginPage.css";

function LoginPage() {
  const [values, setValues] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setToken, setTransactionNumber } = useAuth();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumber = values.phone.replace(/\s/g, "");

    // Basit validasyon
    if (!phoneNumber || !values.password) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setError("Telefon numarası 10 haneli olmalıdır.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. Giriş isteği
      const loginRes = await axios.post("http://localhost:5190/api/Auth/login", {
        phoneNumber,
        password: values.password,
      });

      const token = loginRes.data.token;
      setToken(token); // Context'e token'ı aktar

      // 2. İşlem başlatma isteği
      const startRes = await axios.post(
        "http://localhost:5190/api/Transaction/start",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTransactionNumber(startRes.data.transactionNumber); // Context'e transaction'ı aktar
      navigate("/recycle"); // Recycle sayfasına yönlen
    } catch (err) {
      const msg = err.response?.data?.Error || "Giriş başarısız.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="header fixed-top d-flex align-items-center">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="logo d-flex align-items-center">
            <h1>Akıllı Geri Dönüşüm Otomatı</h1>
          </div>
          <div>
            <img src="ikons/atkazan.png" width="170px" alt="Logo" />
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero section d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8 col-sm-10">
                <div className="login-form">
                  <h2 className="text-center">Giriş Yap</h2>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                      <label htmlFor="phone">Telefon Numarası</label>
                      <input
                        type="tel"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="5XX XXX XXXX"
                        required
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="password">Parola</label>
                      <input
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-login w-100"
                      disabled={loading}
                    >
                      {loading ? "Yükleniyor..." : "Giriş Yap"}
                    </button>
                    <div className="register-link mt-3">
                      Hesabınız yok mu? <a href="/register">Kayıt Ol</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
