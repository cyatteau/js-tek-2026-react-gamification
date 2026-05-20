import React from "react";
import "./QuestStatus.css";

const QuestStatus = ({ questStarted, foundLandmarks, totalLandmarks }) => {
  if (!questStarted) return null;

  const safeTotal = Math.max(totalLandmarks || 0, 1);
  const progressPercentage = Math.min(
    100,
    Math.round((foundLandmarks / safeTotal) * 100),
  );

  return (
    <div className="quest-status-container">
      <h3>Quest Started!</h3>

      <p>
        You have found {foundLandmarks} out of {totalLandmarks} landmarks.
      </p>

      <div
        className="quest-progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progressPercentage}
        aria-label={`Quest progress: ${foundLandmarks} of ${totalLandmarks} landmarks found`}
      >
        <div
          className="quest-progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
        <span className="quest-progress-label">{progressPercentage}%</span>
      </div>
    </div>
  );
};

export default QuestStatus;
