import React, { useState } from "react";

const CATEGORIES = ["Web", "Data", "Mobile", "Design"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function CourseFormModal({ initialCourse, onClose, onSubmit }) {
  const isEdit = Boolean(initialCourse);

  const [form, setForm] = useState({
    title: initialCourse?.title || "",
    instructor: initialCourse?.instructor || "",
    category: initialCourse?.category || "Web",
    level: initialCourse?.level || "Beginner",
    startDate: toDateInputValue(initialCourse?.startDate) || toDateInputValue(new Date()),
    totalSeats: initialCourse?.totalSeats || 20,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.instructor.trim()) {
      setError("Title and instructor are required");
      return;
    }
    if (Number(form.totalSeats) < 1) {
      setError("Total seats must be at least 1");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        totalSeats: Number(form.totalSeats),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Edit course" : "Create a course"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="Intro to React"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="instructor">Instructor</label>
            <input
              id="instructor"
              type="text"
              value={form.instructor}
              onChange={handleChange("instructor")}
              placeholder="Jordan Lee"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={handleChange("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="level">Level</label>
              <select id="level" value={form.level} onChange={handleChange("level")}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="startDate">Start date</label>
              <input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange("startDate")}
              />
            </div>

            <div className="form-field">
              <label htmlFor="totalSeats">Total seats</label>
              <input
                id="totalSeats"
                type="number"
                min="1"
                value={form.totalSeats}
                onChange={handleChange("totalSeats")}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Create course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
