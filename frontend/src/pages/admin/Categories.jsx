import { useEffect, useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import adminService from "../../services/adminService";
export default function Categories() {
  const [categories, setCategories] = useState([]),
    [open, setOpen] = useState(false),
    [name, setName] = useState("");
  const load = async () => {
    try {
      const r = await adminService.getCategories();
      setCategories(r.categories || r.data || r || []);
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await adminService.createCategory({ name });
    setName("");
    setOpen(false);
    load();
  };
  const remove = async (id) => {
    if (window.confirm("Delete this category?")) {
      await adminService.deleteCategory(id);
      load();
    }
  };
  return (
    <>
      <DashboardHeader
        title="Categories"
        description="Organize tickets with reusable categories."
        action={<Button onClick={() => setOpen(true)}>Add Category</Button>}
      />
      <div className="section-card">
        <div className="category-list">
          {categories.map((c) => (
            <div className="category-row" key={c._id || c.id}>
              <strong>{c.name}</strong>
              <Button
                size="sm"
                variant="danger"
                onClick={() => remove(c._id || c.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Category">
        <form onSubmit={create}>
          <Input
            label="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </>
  );
}
