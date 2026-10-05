import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    try {
      await authService.resetPassword({ token: params.get("token"), password });
      navigate("/login");
    } catch (e) {
      setError(e.response?.data?.message || "Reset failed.");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link className="auth-brand" to="/">
          SupportDesk
        </Link>
        <h1>Set new password</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={128}
            required
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" className="full-width">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
