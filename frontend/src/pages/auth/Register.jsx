import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { validateRegister } from "../../utils/validation";
export default function Register() {
  const { register } = useAuth(),
    navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({}),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const v = validateRegister(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
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
        <h1>Create account</h1>
        <p>Start managing your support requests.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
            placeholder="Your name"
          />
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
            minLength={8}
            placeholder="At least 8 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
            required
            placeholder="Repeat password"
          />
          <Button type="submit" loading={loading} className="full-width">
            Create Account
          </Button>
        </form>
        <p className="auth-bottom">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
