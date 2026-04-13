// src/pages/UsersPage.jsx
import { useEffect, useState } from "react";
import { Users, UserPlus, Pencil, Trash2, X } from "lucide-react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service.js";

const emptyForm = {
  first_name: "",
  last_name: "",
  job_title: "",
  user_email: "",
  user_psw: "",
  company_id: "",
  role_id: "",
  department_id: "",
  is_active: true,
};

const UsersPage = () => {
  const [users, setUsers]         = useState([]);
  const [form, setForm]           = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      alert("Error cargando usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const payload = { ...form };
        if (!payload.user_psw)   delete payload.user_psw;
        if (!payload.user_email) delete payload.user_email;
        await updateUser(editingId, payload);
      } else {
        await createUser(form);
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error guardando usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      first_name:    user.first_name    || "",
      last_name:     user.last_name     || "",
      job_title:     user.job_title     || "",
      user_email:    "",
      user_psw:      "",
      company_id:    user.company_id    || "",
      role_id:       user.role_id       || "",
      department_id: user.department_id || "",
      is_active:     user.is_active     ?? true,
    });
    setEditingId(user.user_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error eliminando usuario");
    }
  };

  const closeModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-900/30">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-500">{users.length} registered users</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-900/30 transition-all hover:from-purple-700 hover:to-violet-700"
        >
          <UserPlus size={16} />
          New User
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="p-4 text-left font-medium text-gray-500">Code</th>
              <th className="p-4 text-left font-medium text-gray-500">Name</th>
              <th className="p-4 text-left font-medium text-gray-500">Job Title</th>
              <th className="p-4 text-left font-medium text-gray-500">Status</th>
              <th className="p-4 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.user_id}
                  className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="p-4">
                    <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      {u.int_cod_user}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {u.first_name} {u.last_name}
                  </td>
                  <td className="p-4 text-gray-500">{u.job_title}</td>
                  <td className="p-4">
                    {u.is_active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.user_id)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-600">
                  <UserPlus size={15} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? "Edit User" : "New User"}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="space-y-4">

                {/* Nombre y apellido */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">First Name</label>
                    <input
                      name="first_name"
                      placeholder="John"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Last Name</label>
                    <input
                      name="last_name"
                      placeholder="Doe"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* Job title */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Job Title</label>
                  <input
                    name="job_title"
                    placeholder="e.g. Support Agent"
                    value={form.job_title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">
                    Email {editingId && <span className="text-gray-400">(optional)</span>}
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    placeholder="john@example.com"
                    value={form.user_email}
                    onChange={handleChange}
                    required={!editingId}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">
                    Password {editingId && <span className="text-gray-400">(optional)</span>}
                  </label>
                  <input
                    type="password"
                    name="user_psw"
                    placeholder="••••••••"
                    value={form.user_psw}
                    onChange={handleChange}
                    required={!editingId}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* IDs — en el futuro serán selects */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Company ID</label>
                    <input
                      name="company_id"
                      placeholder="ID"
                      value={form.company_id}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Role ID</label>
                    <input
                      name="role_id"
                      placeholder="ID"
                      value={form.role_id}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Department ID</label>
                    <input
                      name="department_id"
                      placeholder="ID"
                      value={form.department_id}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* Active */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 accent-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Active user</span>
                </label>

              </div>
            </form>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="user-form"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-900/20 transition hover:from-purple-700 hover:to-violet-700 disabled:opacity-60"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UsersPage;