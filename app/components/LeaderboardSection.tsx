"use client";

import { useState, useEffect } from "react";
import { Trophy, FileText, Zap, Award } from "lucide-react";

const DUMMY_DATA = [
  { id: "d1", name: "Michael Sterling",  rankName: "Legendary Builder",  points: 15200, prds: 342, avatar: "MS" },
  { id: "d2", name: "Sarah Jenkins",     rankName: "Master Architect",   points: 12850, prds: 285, avatar: "SJ" },
  { id: "d3", name: "David Chen",        rankName: "Senior Visionary",   points: 10214, prds: 214, avatar: "DC" },
  { id: "d4", name: "Emily Carter",      rankName: "Visionary",          points: 9198,  prds: 198, avatar: "EC" },
  { id: "d5", name: "James Harrison",    rankName: "Rising Star",        points: 8156,  prds: 156, avatar: "JH" },
  { id: "d6", name: "Rachel Patel",      rankName: "Product Maker",      points: 7134,  prds: 134, avatar: "RP" },
  { id: "d7", name: "Daniel Foster",     rankName: "Idea Sprout",        points: 6112,  prds: 112, avatar: "DF" },
  { id: "d8", name: "Olivia Bennett",    rankName: "Idea Sprout",        points: 5095,  prds: 95,  avatar: "OB" },
];

const RANK_BADGE: Record<number, { label: string; color: string }> = {
  1: { label: "#1", color: "var(--color-signal)" },
  2: { label: "#2", color: "#CBD5E1" },
  3: { label: "#3", color: "#D97706" },
};

function SkeletonRow() {
  return (
    <div className="lb-row lb-skeleton">
      <div className="lb-rank"><div className="skel" style={{ width: 22, height: 22, borderRadius: 4 }} /></div>
      <div className="lb-avatar skel" />
      <div className="lb-user-info">
        <div className="skel" style={{ width: 130, height: 14, borderRadius: 3, marginBottom: 6 }} />
        <div className="skel" style={{ width: 100, height: 11, borderRadius: 3 }} />
      </div>
      <div className="lb-metrics">
        <div className="skel" style={{ width: 58, height: 20, borderRadius: 3 }} />
        <div className="skel" style={{ width: 68, height: 20, borderRadius: 3 }} />
      </div>
    </div>
  );
}

export default function LeaderboardSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const json = await res.json();
        let realData: any[] = [];
        if (json.success && Array.isArray(json.data)) realData = json.data;

        const padded = [...realData];
        let di = 0;
        while (padded.length < 8 && di < DUMMY_DATA.length) {
          padded.push(DUMMY_DATA[di++]);
        }
        padded.sort((a, b) => b.points - a.points);
        setData(padded.slice(0, 8));
      } catch {
        setData(DUMMY_DATA.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <section id="leaderboard" className="lb-section">
      <div className="lb-container">
        {/* Header */}
        <div className="lb-header">
          <div className="lb-header-pill">
            <Trophy size={12} aria-hidden="true" />
            Top Visionaries
          </div>
          <h2 className="lb-heading">
            Meet the{" "}
            <span style={{ color: "var(--color-signal)" }}>Top PRD Creators</span>
          </h2>
          <p className="lb-subheading">
            Celebrating the top 8 visionaries turning ideas into structured PRDs with Piardify.
          </p>
        </div>

        {/* List */}
        <div className="lb-list" role="list" aria-label="Leaderboard">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            : data.map((user, index) => {
                const rank = index + 1;
                const badge = RANK_BADGE[rank];

                return (
                  <div
                    key={user.id}
                    className={`lb-row ${rank === 1 ? "lb-row--gold" : rank === 2 ? "lb-row--silver" : rank === 3 ? "lb-row--bronze" : ""}`}
                    role="listitem"
                  >
                    {/* Rank */}
                    <div className="lb-rank">
                      {badge ? (
                        <span
                          className="lb-rank-badge"
                          style={{ color: badge.color, borderColor: badge.color }}
                        >
                          {badge.label}
                        </span>
                      ) : (
                        <span className="lb-rank-num">{rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="lb-avatar" aria-hidden="true">
                      {user.avatar && typeof user.avatar === "string" && user.avatar.startsWith("http") ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        user.avatar
                      )}
                    </div>

                    {/* Name + rank */}
                    <div className="lb-user-info">
                      <h4 className="lb-name">{user.name}</h4>
                      <div className="lb-role">
                        <Award size={11} aria-hidden="true" />
                        {user.rankName}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="lb-metrics">
                      <div className="lb-metric">
                        <FileText size={13} aria-hidden="true" />
                        <span>
                          {user.prds}{" "}
                          <span className="lb-metric-label">PRDs</span>
                        </span>
                      </div>
                      <div className="lb-metric">
                        <Zap size={13} aria-hidden="true" />
                        <span>
                          {user.points.toLocaleString("id-ID")}{" "}
                          <span className="lb-metric-label">pts</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      <style>{`
        .lb-section {
          padding: 112px 24px 128px;
          position: relative;
          background: var(--bg-surface);
        }
        .lb-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .lb-container {
          max-width: 760px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lb-header {
          text-align: left;
          margin-bottom: 48px;
        }
        .lb-header-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 12px;
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-signal);
          margin-bottom: 18px;
        }
        .lb-heading {
          font-family: var(--font-display);
          font-size: clamp(1.875rem, 3.5vw, 2.5rem);
          font-weight: 800;
          line-height: 1.15;
          color: var(--fg-primary);
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        .lb-subheading {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--color-mist);
          max-width: 520px;
          line-height: 1.6;
        }

        /* List */
        .lb-list {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-lg);
          overflow: hidden;
          max-width: 100%;
          overflow-x: auto;
        }

        /* Row */
        .lb-row {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border-hairline);
          background: var(--bg-base);
          transition: background 0.15s;
          position: relative;
        }
        .lb-row:last-child { border-bottom: none; }
        .lb-row:hover:not(.lb-skeleton) { background: var(--bg-elevated); }

        /* Top-3 left accent bar */
        .lb-row--gold::before   { content:""; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--color-signal); }
        .lb-row--silver::before { content:""; position:absolute; left:0; top:0; bottom:0; width:2px; background:#CBD5E1; }
        .lb-row--bronze::before { content:""; position:absolute; left:0; top:0; bottom:0; width:2px; background:#D97706; }

        /* Skeleton */
        .lb-skeleton { pointer-events: none; }
        .skel {
          background: var(--bg-elevated);
          position: relative;
          overflow: hidden;
        }
        .skel::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 100% { transform: translateX(100%); } }

        /* Rank column */
        .lb-rank {
          width: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }
        .lb-rank-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 2px 6px;
          border: 1px solid currentColor;
          border-radius: var(--radius-xs);
        }
        .lb-rank-num {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          color: var(--fg-muted);
          letter-spacing: 0.04em;
        }

        /* Avatar */
        .lb-avatar {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-hairline);
          background: var(--bg-elevated);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 12px;
          color: var(--color-mist);
          margin-left: 10px;
          margin-right: 14px;
          flex-shrink: 0;
          overflow: hidden;
          letter-spacing: 0.04em;
        }

        /* User info */
        .lb-user-info { flex: 1; min-width: 0; }
        .lb-name {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--fg-primary);
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-role {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--color-mist);
          text-transform: uppercase;
        }

        /* Metrics */
        .lb-metrics { display: flex; align-items: center; gap: 18px; }
        .lb-metric {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 700;
          color: var(--fg-primary);
          letter-spacing: -0.01em;
        }
        .lb-metric svg { color: var(--color-mist); }
        .lb-metric-label {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          color: var(--fg-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .lb-row { padding: 12px 14px; }
          .lb-avatar { width: 32px; height: 32px; margin-left: 6px; margin-right: 10px; }
          .lb-metrics { flex-direction: column; align-items: flex-end; gap: 3px; }
          .lb-metric { font-size: 12px; }
          .lb-rank { width: 34px; }
        }
      `}</style>
    </section>
  );
}
