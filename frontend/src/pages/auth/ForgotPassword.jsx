import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setResetUrl("");
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setResetUrl(response?.data?.resetUrl || "");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process request.");
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
        <h1>Reset password</h1>
        <p>
          Enter your account email to generate a reset link for local testing.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {resetUrl ? (
          <div className="alert alert-success">
            <strong>Reset link generated.</strong>
            <p className="mt-2">
              Email delivery is disabled in this local project.
            </p>
            <a href={resetUrl}>Open password reset page</a>
          </div>
        ) : (
          <form onSubmit={submit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button className="full-width" type="submit" loading={loading}>
              Generate Reset Link
            </Button>
          </form>
        )}

        <p className="auth-bottom">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
