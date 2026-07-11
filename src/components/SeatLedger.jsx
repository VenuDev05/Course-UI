import React from "react";

const MAX_TICKS = 30; // above this, fall back to a smooth proportional bar

export default function SeatLedger({ totalSeats, enrolledCount }) {
  const remaining = Math.max(totalSeats - enrolledCount, 0);
  const isFull = remaining === 0;
  const pct = totalSeats > 0 ? Math.min((enrolledCount / totalSeats) * 100, 100) : 0;

  return (
    <div className="seat-ledger">
      <div className="seat-ledger-row">
        <span className="seat-ledger-label">Seats</span>
        <span className="seat-ledger-count">
          {enrolledCount}/{totalSeats} filled
        </span>
      </div>

      {totalSeats <= MAX_TICKS ? (
        <div className="seat-ledger-track" aria-hidden="true">
          {Array.from({ length: totalSeats }).map((_, i) => (
            <div
              key={i}
              className={
                "seat-ledger-tick" + (i < enrolledCount ? " filled" + (isFull ? " full" : "") : "")
              }
            />
          ))}
        </div>
      ) : (
        <div className="seat-ledger-bar" aria-hidden="true">
          <div
            className={"seat-ledger-bar-fill" + (isFull ? " full" : "")}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
