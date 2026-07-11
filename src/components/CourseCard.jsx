import React from "react";
import SeatLedger from "./SeatLedger.jsx";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CourseCard({
  course,
  currentUserId,
  onEnroll,
  onDrop,
  onEdit,
  onDelete,
  actionLoading,
}) {
  const enrolledIds = (course.enrolledStudents || []).map((s) => (typeof s === "string" ? s : s._id));
  const isEnrolled = currentUserId && enrolledIds.includes(currentUserId);
  const isOwner =
    currentUserId && course.createdBy && (course.createdBy._id || course.createdBy) === currentUserId;
  const seatsRemaining =
    typeof course.seatsRemaining === "number"
      ? course.seatsRemaining
      : Math.max(course.totalSeats - enrolledIds.length, 0);
  const isFull = seatsRemaining <= 0;
  const canEnroll = course.status === "Open" && !isFull && !isEnrolled;

  return (
    <div className="course-card">
      <div className="course-card-top">
        <span className={`tag tag-${course.category}`}>{course.category}</span>
        <span className={`status-pill status-${course.status}`}>{course.status}</span>
      </div>

      <div>
        <h3 className="course-title">{course.title}</h3>
        <div className="course-meta">
          <span className="course-instructor">Taught by {course.instructor}</span>
          <span>
            <span className="course-level">{course.level}</span> · Starts {formatDate(course.startDate)}
          </span>
        </div>
      </div>

      <SeatLedger totalSeats={course.totalSeats} enrolledCount={enrolledIds.length} />

      <div className="course-actions">
        {isEnrolled ? (
          <button
            className="btn btn-outline"
            onClick={() => onDrop(course._id)}
            disabled={actionLoading}
          >
            Drop course
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => onEnroll(course._id)}
            disabled={!canEnroll || actionLoading}
            title={
              isFull && !isEnrolled
                ? "This course is full"
                : course.status !== "Open"
                ? "Enrollment is closed"
                : undefined
            }
          >
            {isEnrolled ? "Enrolled" : isFull ? "Full" : "Enroll"}
          </button>
        )}
      </div>

      {isOwner && (
        <div className="course-owner-row">
          <button className="btn btn-outline btn-sm" onClick={() => onEdit(course)}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(course._id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
