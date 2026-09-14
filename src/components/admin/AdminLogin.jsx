import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Key, Eye, EyeOff, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { hashPassword, encryptPAT, decryptPAT } from "../../utils/crypto";
import "./admin.css";

const ADMIN_HASH = "d7acae03ba1d5e71745718fe6cb2dcbef3f4ee56659cc94367dcc1d646f761fb";
const VERIFICATION_TOKEN = "PORTFOLIO_ADMIN_OK";

export default function AdminLogin() {
  const navigate = useNavigate();

  const isFirstSetup = !localStorage.getItem("admin_enc_verify");
  const [mode, setMode] = useState(isFirstSetup ? "setup" : "login");

  const [password, setPassword] = useState("");
  const [pat, setPat] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPat, setShowPat] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const hash = await hashPassword(password);
      if (hash !== ADMIN_HASH) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      // Decrypt verification token to double-check
      const encVerify = localStorage.getItem("admin_enc_verify");
      const decrypted = await decryptPAT(encVerify, password);
      if (decrypted !== VERIFICATION_TOKEN) {
        setError("Stored credentials corrupted. Please reset.");
        setLoading(false);
        return;
      }

      // Store password in sessionStorage for the session
      sessionStorage.setItem("admin_pwd", password);
      navigate("/admin/dashboard");
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Verify password hash
      const hash = await hashPassword(password);
      if (hash !== ADMIN_HASH) {
        setError("Incorrect admin password.");
        setLoading(false);
        return;
      }

      // Validate PAT format
      if (!pat.startsWith("ghp_") && !pat.startsWith("github_pat_")) {
        setError("Invalid token format. Must start with ghp_ or github_pat_");
        setLoading(false);
        return;
      }

      // Validate PAT against GitHub API
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${pat}` },
      });
      if (!res.ok) {
        setError("Token is invalid or expired. Check permissions.");
        setLoading(false);
        return;
      }

      // Encrypt and store verification token + PAT
      const encVerify = await encryptPAT(VERIFICATION_TOKEN, password);
      const encPat = await encryptPAT(pat, password);

      localStorage.setItem("admin_enc_verify", encVerify);
      localStorage.setItem("admin_enc_pat", encPat);
      sessionStorage.setItem("admin_pwd", password);

      navigate("/admin/dashboard");
    } catch {
      setError("Setup failed. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    localStorage.removeItem("admin_enc_verify");
    localStorage.removeItem("admin_enc_pat");
    sessionStorage.removeItem("admin_pwd");
    setMode("setup");
    setPassword("");
    setPat("");
    setError("");
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" />
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Shield size={32} />
          </div>
          <h1>{mode === "setup" ? "Admin Setup" : "Admin Login"}</h1>
          <p>
            {mode === "setup"
              ? "Set up your admin credentials to get started."
              : "Enter your password to access the dashboard."}
          </p>
        </div>

        <form onSubmit={mode === "setup" ? handleSetup : handleLogin}>
          <div className="admin-form-group">
            <label htmlFor="admin-password">
              <Lock size={14} /> Password
            </label>
            <div className="admin-input-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === "setup" && (
            <div className="admin-form-group">
              <label htmlFor="admin-pat">
                <Key size={14} /> GitHub Personal Access Token
              </label>
              <div className="admin-input-wrapper">
                <input
                  id="admin-pat"
                  type={showPat ? "text" : "password"}
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="admin-input-toggle"
                  onClick={() => setShowPat(!showPat)}
                  tabIndex={-1}
                >
                  {showPat ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="admin-form-hint">
                Needs <code>repo</code> scope.{" "}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create one →
                </a>
              </span>
            </div>
          )}

          {error && (
            <div className="admin-error">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? (
              <span className="admin-spinner" />
            ) : (
              <>
                {mode === "setup" ? "Complete Setup" : "Unlock"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {mode === "login" && (
          <button className="admin-reset-link" onClick={handleReset}>
            Reset credentials
          </button>
        )}

        <a href="#/" className="admin-back-link">
          ← Back to portfolio
        </a>
      </div>
    </div>
  );
}
