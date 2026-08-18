import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      // Store JWT token
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Go to dashboard
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={loginCardStyle}>

        {/* Logo */}

        <div style={logoStyle}>
          🚨
        </div>

        <h1 style={titleStyle}>
          Disaster AI
        </h1>

        <p style={subtitleStyle}>
          AI Disaster Response Management System
        </p>

        <h2 style={loginTitleStyle}>
          Admin Login
        </h2>

        {/* Error */}

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {/* Login Form */}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading
                ? "#475569"
                : "#2563eb",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}

        <div style={registerContainerStyle}>
          <span style={registerTextStyle}>
            New user?
          </span>

          <Link
            to="/register"
            style={registerLinkStyle}
          >
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}


// =========================================
// PAGE STYLE
// =========================================

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0f172a",
  color: "white",
};


// =========================================
// LOGIN CARD
// =========================================

const loginCardStyle = {
  width: "400px",
  padding: "40px",
  background: "#1e293b",
  borderRadius: "16px",
  boxShadow:
    "0 20px 50px rgba(0, 0, 0, 0.4)",
  textAlign: "center",
};


// =========================================
// LOGO
// =========================================

const logoStyle = {
  fontSize: "50px",
  marginBottom: "5px",
};


// =========================================
// TITLE
// =========================================

const titleStyle = {
  margin: "0",
  fontSize: "30px",
  color: "#f8fafc",
};


// =========================================
// SUBTITLE
// =========================================

const subtitleStyle = {
  color: "#94a3b8",
  fontSize: "14px",
  marginBottom: "30px",
};


// =========================================
// LOGIN TITLE
// =========================================

const loginTitleStyle = {
  fontSize: "24px",
  marginBottom: "25px",
  color: "#e2e8f0",
};


// =========================================
// INPUT
// =========================================

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  fontSize: "15px",
  outline: "none",
};


// =========================================
// LOGIN BUTTON
// =========================================

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
};


// =========================================
// REGISTER SECTION
// =========================================

const registerContainerStyle = {
  marginTop: "25px",
  paddingTop: "20px",
  borderTop: "1px solid #334155",
  fontSize: "14px",
};


const registerTextStyle = {
  color: "#94a3b8",
  marginRight: "6px",
};


const registerLinkStyle = {
  color: "#60a5fa",
  textDecoration: "none",
  fontWeight: "bold",
};


// =========================================
// ERROR
// =========================================

const errorStyle = {
  background: "#7f1d1d",
  color: "#fecaca",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "14px",
};


export default Login;