import { useEffect, useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");
  useEffect(
    () => setForm({ name: user?.name || "", email: user?.email || "" }),
    [user],
  );
  const save = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(user._id || user.id, {
        name: form.name,
      });
      updateUser(response.data);
      setForm({ name: response.data.name, email: response.data.email });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update profile.");
    }
  };
  return (
    <>
      <DashboardHeader
        title="Profile"
        description="Manage your account details."
      />
      <div className="narrow-content">
        <form className="form-card" onSubmit={save}>
          {message && <div className="alert alert-info">{message}</div>}
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            readOnly
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </>
  );
}
