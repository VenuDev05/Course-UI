import React from "react";

export default function SummaryPanel({ summary }) {
  if (!summary) {
    return (
      <aside className="summary-panel">
        <h3>Registrar summary</h3>
        <p className="summary-sub">Loading figures…</p>
      </aside>
    );
  }

  const { totalCourses, totalSeats, totalEnrolled, seatsAvailable, byCategory } = summary;

  return (
    <aside className="summary-panel">
      <h3>Registrar summary</h3>
      <p className="summary-sub">Live totals across the catalog</p>

      <div className="summary-stats">
        <div className="summary-stat">
          <div className="num">{totalCourses}</div>
          <div className="label">Courses</div>
        </div>
        <div className="summary-stat">
          <div className="num">{totalSeats}</div>
          <div className="label">Total seats</div>
        </div>
        <div className="summary-stat">
          <div className="num">{totalEnrolled}</div>
          <div className="label">Enrolled</div>
        </div>
        <div className="summary-stat">
          <div className="num">{seatsAvailable}</div>
          <div className="label">Available</div>
        </div>
      </div>

      <div className="summary-cats">
        {Object.entries(byCategory || {}).map(([cat, count]) => (
          <div className="summary-cat-row" key={cat}>
            <span className={`tag tag-${cat}`}>{cat}</span>
            <span className="num">{count}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
