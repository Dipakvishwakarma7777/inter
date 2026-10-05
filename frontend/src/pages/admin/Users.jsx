import { useEffect, useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Loader from "../../components/common/Loader";
import userService from "../../services/userService";
import adminService from "../../services/adminService";
import Button from "../../components/common/Button";
export default function Users() {
  const [users, setUsers] = useState([]),
    [loading, setLoading] = useState(true);
  const load = async () => {
    try {
      const r = await userService.getUsers();
      setUsers(r.users || r.data || r || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <DashboardHeader
        title="Users"
        description="Manage registered customers."
      />
      <div className="section-card">
        {loading ? (
          <Loader />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.isActive === false ? "Inactive" : "Active"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          adminService
                            .setStatus(u._id || u.id, u.isActive === false)
                            .then(load)
                        }
                      >
                        Toggle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
