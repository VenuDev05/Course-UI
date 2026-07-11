import React, { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import CourseCard from "../components/CourseCard.jsx";
import CourseFormModal from "../components/CourseFormModal.jsx";

export default function MyEnrollments() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/courses/enrolled/me");
      setCourses(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load your enrollments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleDrop = async (courseId) => {
    setActionLoading(true);
    setError("");
    try {
      await api.post(`/courses/${courseId}/drop`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to drop course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (formValues) => {
    const { data } = await api.put(`/courses/${editingCourse._id}`, formValues);
    setCourses((prev) => prev.map((c) => (c._id === data._id ? data : c)));
    setEditingCourse(null);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete course");
    } finally {
      setActionLoading(false);
    }
  };

  // Enroll never fires from this view since every card here is already
  // enrolled, but CourseCard still expects the handler prop.
  const noop = () => {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My enrollments</h1>
          <p className="page-subtitle">Courses you're currently signed up for.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-block">Loading your enrollments…</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't enrolled in anything yet</h3>
          <p>Head over to the catalog and find a course that fits.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              currentUserId={user?.id}
              onEnroll={noop}
              onDrop={handleDrop}
              onEdit={setEditingCourse}
              onDelete={handleDelete}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {editingCourse && (
        <CourseFormModal
          initialCourse={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
