import React, { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import FilterBar from "../components/FilterBar.jsx";
import CourseCard from "../components/CourseCard.jsx";
import CourseFormModal from "../components/CourseFormModal.jsx";
import SummaryPanel from "../components/SummaryPanel.jsx";

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await api.get("/courses/summary");
      setSummary(data);
    } catch (err) {
      // Summary is secondary; fail quietly so it doesn't block the catalog
      console.error("Failed to load summary", err);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (category) params.category = category;
      if (level) params.level = level;
      const { data } = await api.get("/courses", { params });
      setCourses(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [category, level]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleCreate = async (formValues) => {
    const { data } = await api.post("/courses", formValues);
    setCourses((prev) => [data, ...prev]);
    setShowCreateModal(false);
    fetchSummary();
  };

  const handleEditSubmit = async (formValues) => {
    const { data } = await api.put(`/courses/${editingCourse._id}`, formValues);
    setCourses((prev) => prev.map((c) => (c._id === data._id ? data : c)));
    setEditingCourse(null);
    fetchSummary();
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      fetchSummary();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setActionLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/courses/${courseId}/enroll`);
      setCourses((prev) => prev.map((c) => (c._id === courseId ? data : c)));
      fetchSummary();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to enroll in course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDrop = async (courseId) => {
    setActionLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/courses/${courseId}/drop`);
      setCourses((prev) => prev.map((c) => (c._id === courseId ? data : c)));
      fetchSummary();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to drop course");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Course catalog</h1>
          <p className="page-subtitle">Browse open courses, or publish one of your own.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Create course
        </button>
      </div>

      <div className="dashboard-grid">
        <div>
          <FilterBar
            category={category}
            level={level}
            onCategoryChange={setCategory}
            onLevelChange={setLevel}
            onClear={() => {
              setCategory("");
              setLevel("");
            }}
          />

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading-block">Loading courses…</div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <h3>No courses found</h3>
              <p>Try clearing your filters, or create the first course in this category.</p>
            </div>
          ) : (
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  currentUserId={user?.id}
                  onEnroll={handleEnroll}
                  onDrop={handleDrop}
                  onEdit={setEditingCourse}
                  onDelete={handleDelete}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>

        <SummaryPanel summary={summary} />
      </div>

      {showCreateModal && (
        <CourseFormModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} />
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
