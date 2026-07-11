import React from "react";

const CATEGORIES = ["Web", "Data", "Mobile", "Design"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function FilterBar({ category, level, onCategoryChange, onLevelChange, onClear }) {
  const hasFilters = Boolean(category || level);

  return (
    <div className="filter-bar">
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select value={level} onChange={(e) => onLevelChange(e.target.value)}>
        <option value="">All levels</option>
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button className="filter-clear" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
