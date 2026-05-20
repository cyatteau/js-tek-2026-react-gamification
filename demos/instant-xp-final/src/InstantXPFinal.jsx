import {
  Activity,
  useOptimistic,
  useReducer,
  useState,
  useTransition,
} from "react";
import { flushSync } from "react-dom";

import "./InstantXPFinal.css";

const gamesUpgrades = [
  {
    id: "gamified-ui",
    letter: "G",
    title: "Gamified UI",
    shortLabel: "Visible feedback",
    description: "XP, progress, badges, and reward messages respond to state.",
    reactPart: "Derived UI",
    reward: 25,
    badge: "Feedback Loop",
  },
  {
    id: "advanced-state",
    letter: "A",
    title: "Advanced State",
    shortLabel: "Reward rules",
    description: "A reducer owns XP, streaks, badges, and claimed rewards.",
    reactPart: "useReducer",
    reward: 30,
    badge: "Reward Architect",
  },
  {
    id: "modern-optimization",
    letter: "M",
    title: "Modern Optimization",
    shortLabel: "Clean boundaries",
    description: "Focused components keep this app ready for React Compiler.",
    reactPart: "Compiler-friendly components",
    reward: 35,
    badge: "Render Wrangler",
  },
  {
    id: "efficient-rendering",
    letter: "E",
    title: "Efficient Rendering",
    shortLabel: "Instant feedback",
    description: "Optimistic UI shows the reward while the save is pending.",
    reactPart: "useOptimistic + useTransition",
    reward: 40,
    badge: "Instant Reward",
  },
  {
    id: "social-interaction",
    letter: "S",
    title: "Social Interaction",
    shortLabel: "Share progress",
    description: "Progress becomes portable with a copyable summary.",
    reactPart: "Shareable UI state",
    reward: 45,
    badge: "Social Spark",
  },
];

const initialGameState = {
  xp: 0,
  streak: 0,
  claimedIds: [],
  badges: [],
  lastReward: null,
};

function saveReward() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

function getLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function getProgressToNextLevel(xp) {
  return xp % 100;
}

function getRewardById(rewardId) {
  return gamesUpgrades.find((upgrade) => upgrade.id === rewardId);
}

function applyReward(state, rewardId, options = {}) {
  const reward = getRewardById(rewardId);

  if (!reward || state.claimedIds.includes(rewardId)) {
    return state;
  }

  const streakBonus = state.streak >= 2 ? 10 : 0;
  const earnedXP = reward.reward + streakBonus;
  const nextXP = state.xp + earnedXP;
  const nextStreak = state.streak + 1;

  const nextBadges = new Set(state.badges);
  nextBadges.add(reward.badge);

  if (nextXP >= 75) {
    nextBadges.add("Momentum Builder");
  }

  if (nextStreak >= 3) {
    nextBadges.add("Three Quest Streak");
  }

  if (state.claimedIds.length + 1 === gamesUpgrades.length) {
    nextBadges.add("G.A.M.E.S. Complete");
  }

  return {
    ...state,
    xp: nextXP,
    streak: nextStreak,
    claimedIds: [...state.claimedIds, rewardId],
    badges: Array.from(nextBadges),
    lastReward: {
      id: reward.id,
      letter: reward.letter,
      title: reward.title,
      badge: reward.badge,
      xp: earnedXP,
      optimistic: options.optimistic ?? false,
      message:
        streakBonus > 0
          ? `+${earnedXP} XP with streak bonus`
          : `+${earnedXP} XP earned`,
    },
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "CONFIRM_REWARD":
      return applyReward(state, action.rewardId);

    case "RESET":
      return initialGameState;

    default:
      return state;
  }
}

export default function InstantXPFinal() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [selectedUpgradeId, setSelectedUpgradeId] = useState("gamified-ui");
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [displayState, addOptimisticReward] = useOptimistic(
    gameState,
    (currentState, rewardId) =>
      applyReward(currentState, rewardId, { optimistic: true }),
  );

  const selectedUpgrade = getRewardById(selectedUpgradeId);
  const level = getLevel(displayState.xp);
  const progress = getProgressToNextLevel(displayState.xp);
  const completedCount = displayState.claimedIds.length;
  const allComplete = completedCount === gamesUpgrades.length;
  const selectedClaimed = displayState.claimedIds.includes(selectedUpgradeId);

  function claimReward(rewardId) {
    setCopied(false);

    startTransition(async () => {
      addOptimisticReward(rewardId);

      await saveReward();

      startTransition(() => {
        dispatch({
          type: "CONFIRM_REWARD",
          rewardId,
        });
      });
    });
  }

  function selectUpgrade(rewardId) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (document.startViewTransition && !prefersReducedMotion) {
      document.startViewTransition(() => {
        flushSync(() => {
          setSelectedUpgradeId(rewardId);
        });
      });

      return;
    }

    setSelectedUpgradeId(rewardId);
  }

  function toggleActivityPanel() {
    startTransition(() => {
      setShowActivityPanel((current) => !current);
    });
  }

  function resetDemo() {
    setCopied(false);
    setShowActivityPanel(false);
    dispatch({ type: "RESET" });
  }

  return (
    <main className="instant-xp-app">
      <section className="instant-xp-card final-xp-card">
        <p className="eyebrow">Final hosted demo</p>

        <div className="top-row">
          <div>
            <h1>Instant XP</h1>
            <p className="subtitle">
              Same reward loop. Now upgraded with G.A.M.E.S.
            </p>
          </div>

          <div className="reward-badge">+{selectedUpgrade.reward}</div>
        </div>

        <section className="xp-card final-stats">
          <div className="xp-main">
            <span>Current XP</span>
            <strong>{displayState.xp}</strong>
          </div>

          <div className="mini-stat-grid">
            <div>
              <span>Level</span>
              <strong>{level}</strong>
            </div>

            <div>
              <span>Upgrades</span>
              <strong>
                {completedCount}/{gamesUpgrades.length}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{isPending ? "Saving" : "Ready"}</strong>
            </div>
          </div>

          <div className="progress-area">
            <div className="progress-label">
              <span>Progress to next level</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="games-strip" aria-label="G.A.M.E.S. upgrades">
          {gamesUpgrades.map((upgrade) => {
            const selected = selectedUpgradeId === upgrade.id;
            const claimed = displayState.claimedIds.includes(upgrade.id);

            return (
              <button
                key={upgrade.id}
                className={`game-chip ${selected ? "selected" : ""} ${
                  claimed ? "claimed" : ""
                }`}
                onClick={() => selectUpgrade(upgrade.id)}
                type="button"
              >
                <span>{upgrade.letter}</span>
                <strong>{upgrade.title}</strong>
                {claimed && <small>✓</small>}
              </button>
            );
          })}
        </section>

        <section className="upgrade-panel">
          <div className="upgrade-copy">
            <p className="eyebrow">Selected upgrade</p>
            <h2>
              {selectedUpgrade.letter}: {selectedUpgrade.title}
            </h2>
            <p>{selectedUpgrade.description}</p>

            <div className="pattern-row">
              <span>{selectedUpgrade.reactPart}</span>
              <span>Badge: {selectedUpgrade.badge}</span>
            </div>
          </div>

          <button
            className="primary-action"
            disabled={selectedClaimed || isPending}
            onClick={() => claimReward(selectedUpgradeId)}
            type="button"
          >
            {selectedClaimed
              ? "Upgrade claimed"
              : isPending
                ? "Saving..."
                : "Claim upgrade"}
          </button>
        </section>

        {displayState.lastReward ? (
          <section className="achievement">
            <div>
              <span>
                {displayState.lastReward.optimistic
                  ? "Optimistic reward"
                  : "Confirmed reward"}
              </span>
              <strong>
                🏆 {displayState.lastReward.badge} ·{" "}
                {displayState.lastReward.message}
              </strong>
            </div>
            <small>{isPending ? "Save still in progress" : "Saved"}</small>
          </section>
        ) : (
          <section className="empty-reward">
            Claim an upgrade to see the feedback loop in action.
          </section>
        )}

        <section className="badge-shelf">
          {displayState.badges.length === 0 ? (
            <span>No badges yet</span>
          ) : (
            displayState.badges.map((badge) => (
              <span key={badge}>🏆 {badge}</span>
            ))
          )}
        </section>

        <section className="modern-row">
          <button
            className="secondary-action"
            onClick={toggleActivityPanel}
            type="button"
          >
            {showActivityPanel ? "Hide Activity note" : "Show Activity note"}
          </button>

          <ShareButton
            gameState={displayState}
            level={level}
            allComplete={allComplete}
            copied={copied}
            onCopied={() => setCopied(true)}
          />

          <button className="secondary-action subtle" onClick={resetDemo}>
            Reset
          </button>
        </section>

        <Activity mode={showActivityPanel ? "visible" : "hidden"}>
          <ActivityPanel badges={displayState.badges} />
        </Activity>

        <p className="note">
          One reward loop upgraded with reducer rules, optimistic feedback,
          transitions, Activity, and shareable progress.
        </p>
      </section>
    </main>
  );
}

function ActivityPanel({ badges }) {
  const [note, setNote] = useState("");

  return (
    <section className="activity-panel">
      <div>
        <p className="eyebrow">Activity demo</p>
        <strong>Hidden UI, preserved state</strong>
      </div>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Try typing: reward meaningful progress."
      />

      <div className="mini-badge-row">
        {badges.length === 0 ? (
          <span>No badges yet</span>
        ) : (
          badges.slice(0, 3).map((badge) => <span key={badge}>🏆 {badge}</span>)
        )}
      </div>
    </section>
  );
}

function ShareButton({ gameState, level, allComplete, copied, onCopied }) {
  const shareText = allComplete
    ? `I completed Instant XP: G.A.M.E.S. Mode with ${gameState.xp} XP, level ${level}, and ${gameState.badges.length} badges.`
    : `I reached ${gameState.xp} XP, level ${level}, and unlocked ${gameState.badges.length} badges in Instant XP: G.A.M.E.S. Mode.`;

  async function copyShareText() {
    try {
      await navigator.clipboard.writeText(shareText);
      onCopied();
    } catch {
      window.prompt("Copy your progress:", shareText);
    }
  }

  return (
    <button className="secondary-action" onClick={copyShareText} type="button">
      {copied ? "Copied!" : "Copy share text"}
    </button>
  );
}
