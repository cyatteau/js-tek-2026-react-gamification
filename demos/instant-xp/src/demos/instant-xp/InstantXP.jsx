import { useState } from "react";
// LIVE STEP 1: swap this import in
// import { useOptimistic, useState, useTransition } from "react";

import "./InstantXP.css";

function saveReward() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export default function InstantXP() {
  const [xp, setXp] = useState(0);
  const [saving, setSaving] = useState(false);
  // BEFORE: the UI only shows committed state
  const displayXP = xp;
  const pending = saving;

  // LIVE STEP 2: optimistic display state
  // const [displayXP, addOptimisticXP] = useOptimistic(
  //   xp, (currentXP, reward) => currentXP + reward
  // );

  // LIVE STEP 3: pending state for the async action
  // const [pending, startTransition] = useTransition();

  async function claimReward() {
    setSaving(true);
    await saveReward();
    setXp((currentXP) => currentXP + 25);
    setSaving(false);
  }

  // LIVE STEP 4: replace the handler with this
  // function claimReward() {
  //   startTransition(async () => {
  //     addOptimisticXP(25);
  //     await saveReward();
  //     setXp((currentXP) => currentXP + 25);
  //   });
  // }

  return (
    <main className="instant-xp-app">
      <section className="instant-xp-card">
        <p className="eyebrow">Demo 1</p>

        <div className="top-row">
          <div>
            <h1>Instant XP</h1>
            <p className="subtitle">One button. One delayed reward.</p>
          </div>

          <div className="reward-badge">+25</div>
        </div>

        <div className="xp-card">
          <span>Current XP</span>
          <strong>{displayXP}</strong>
        </div>

        <button onClick={claimReward} disabled={pending}>
          {pending ? "Saving..." : "Claim reward"}
        </button>

        {displayXP >= 75 && (
          <p className="achievement">🏆 Achievement unlocked: Feedback Loop</p>
        )}

        {pending && (
          <p className="pending">
            Reward shown instantly. Save still in progress.
          </p>
        )}

        <p className="note">
          Same button. Same save. Watch the feedback timing.
        </p>
      </section>
    </main>
  );
}
