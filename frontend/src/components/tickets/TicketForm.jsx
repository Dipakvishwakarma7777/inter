import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { PRIORITIES } from "../../utils/constants";
import { validateTicket } from "../../utils/validation";
import api from "../../services/api";
export default function TicketForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    category: initialValues.category?._id || initialValues.category || "",
    priority: initialValues.priority || "medium",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    const v = validateTicket(form);
    if (Object.keys(v).length) return setErrors(v);
    setErrors({});
    await onSubmit(form);
  };
  return (
    <form className="form-card" onSubmit={submit}>
      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={change}
        error={errors.title}
        required
        placeholder="Briefly describe your issue"
      />
      <div className="form-grid">
        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={change}
          options={[
            { value: "", label: "General" },
            ...categories.map((c) => ({ value: c._id, label: c.name })),
          ]}
        />
        <Select
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={change}
          options={PRIORITIES}
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          className={`form-input textarea ${errors.description ? "input-error" : ""}`}
          name="description"
          value={form.description}
          onChange={change}
          rows="7"
        />
        {errors.description && (
          <small className="form-error">{errors.description}</small>
        )}
      </div>
      <Button type="submit" loading={loading}>
        Create Ticket
      </Button>
    </form>
  );
}
