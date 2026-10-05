import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { validateLogin } from "../../utils/validation";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const v = validateLogin(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const user = await login(form);
      const role = user?.role;
      const fallback =
        role === "admin"
          ? "/admin/dashboard"
          : role === "agent"
            ? "/agent/dashboard"
            : "/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link className="auth-brand" to="/">
          SupportDesk
        </Link>
        <h1>Welcome back</h1>
        <p>Sign in to continue to your support workspace.</p>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={submit}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            required
            placeholder="••••••••"
          />
          <div className="form-row-between">
            <span></span>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <Button type="submit" loading={loading} className="full-width">
            Login
          </Button>
        </form>
        <p className="auth-bottom">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
