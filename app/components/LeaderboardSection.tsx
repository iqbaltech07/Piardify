"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Crown, TrendingUp, Trophy, FileText, Zap, Award } from "lucide-react";

const DUMMY_DATA = [
  { id: "d1", name: "Michael Sterling", rankName: "Legendary Builder", points: 15200, prds: 342, avatar: "MS" },
  { id: "d2", name: "Sarah Jenkins", rankName: "Master Architect", points: 12850, prds: 285, avatar: "SJ" },
  { id: "d3", name: "David Chen", rankName: "Senior Visionary", points: 10214, prds: 214, avatar: "DC" },
  { id: "d4", name: "Emily Carter", rankName: "Visionary", points: 9198, prds: 198, avatar: "EC" },
  { id: "d5", name: "James Harrison", rankName: "Rising Star", points: 8156, prds: 156, avatar: "JH" },
  { id: "d6", name: "Rachel Patel", rankName: "Product Maker", points: 7134, prds: 134, avatar: "RP" },
  { id: "d7", name: "Daniel Foster", rankName: "Idea Sprout", points: 6112, prds: 112, avatar: "DF" },
  { id: "d8", name: "Olivia Bennett", rankName: "Idea Sprout", points: 5095, prds: 95, avatar: "OB" },
];

export default function LeaderboardSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const json = await res.json();
        let realData = [];
        if (json.success && Array.isArray(json.data)) {
          realData = json.data;
        }
        
        const paddedData = [...realData];
        let dummyIndex = 0;
        while (paddedData.length < 8 && dummyIndex < DUMMY_DATA.length) {
          paddedData.push(DUMMY_DATA[dummyIndex]);
          dummyIndex++;
        }
        
        // Ensure the combined array is logically sorted by points (highest to lowest)
        paddedData.sort((a, b) => b.points - a.points);
        
        setData(paddedData.slice(0, 8));
      } catch (err) {
        console.error(err);
        setData(DUMMY_DATA.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="leaderboard" className="lb-section">
      <div className="lb-container">
        {/* Header */}
        <motion.div 
          className="lb-header"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <motion.div variants={headerVariants} className="lb-header-pill">
            <Trophy className="w-3.5 h-3.5" />
            Top Visionaries
          </motion.div>
          
          <motion.h2 variants={headerVariants} className="lb-heading">
            Meet the <span className="gradient-text">Top PRD Creators</span>
          </motion.h2>
          
          <motion.p variants={headerVariants} className="lb-subheading">
            Celebrating the top 8 visionaries who are turning ideas into structured PRDs with Piardify.
          </motion.p>
        </motion.div>

        {/* Leaderboard List */}
        <motion.div 
          key={loading ? "loading" : "loaded"}
          className="lb-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} className="lb-row lb-skeleton" variants={itemVariants}>
                <div className="lb-rank">
                  <div className="skeleton-box" style={{ width: 24, height: 24, borderRadius: '50%' }}></div>
                </div>
                <div className="lb-avatar skeleton-box" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                <div className="lb-user-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton-box" style={{ width: '130px', height: '16px', borderRadius: '4px' }}></div>
                  <div className="skeleton-box" style={{ width: '100px', height: '12px', borderRadius: '4px' }}></div>
                </div>
                <div className="lb-metrics" style={{ display: 'flex', gap: '20px' }}>
                  <div className="skeleton-box" style={{ width: '60px', height: '22px', borderRadius: '4px' }}></div>
                  <div className="skeleton-box" style={{ width: '70px', height: '22px', borderRadius: '4px' }}></div>
                </div>
              </motion.div>
            ))
          ) : data.map((user, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            
            // Determine crown color based on rank
            let crownColor = "";
            let rowClass = "lb-row";
            if (rank === 1) {
              crownColor = "text-yellow-400";
              rowClass += " lb-row--first";
            } else if (rank === 2) {
              crownColor = "text-slate-300";
              rowClass += " lb-row--second";
            } else if (rank === 3) {
              crownColor = "text-amber-600";
              rowClass += " lb-row--third";
            }

            return (
              <motion.div 
                key={user.id} 
                className={rowClass}
                variants={itemVariants}
                whileHover={{ scale: 1.01, translateX: 5 }}
              >
                {/* Rank Indicator */}
                <div className="lb-rank">
                  {isTop3 ? (
                    <div className={`lb-crown-wrap ${crownColor}`}>
                      <Crown size={22} strokeWidth={2.5} className={crownColor === 'text-yellow-400' ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : ''} />
                    </div>
                  ) : (
                    <span className="lb-rank-num">{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="lb-avatar">
                  {user.avatar && typeof user.avatar === 'string' && user.avatar.startsWith('http') ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                  ) : (
                    user.avatar
                  )}
                </div>

                {/* User Info */}
                <div className="lb-user-info">
                  <h4 className="lb-name">{user.name}</h4>
                  <div className="lb-role" style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    {user.rankName}
                  </div>
                </div>

                {/* Metrics */}
                <div className="lb-metrics">
                  <div className="lb-metric">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>{user.prds} <span className="lb-metric-label">PRDs</span></span>
                  </div>
                  <div className="lb-metric">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{user.points.toLocaleString('id-ID')} <span className="lb-metric-label">{user.points === 1 ? 'Point' : 'Points'}</span></span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style>{`
        .lb-section {
          padding: 100px 24px 120px;
          position: relative;
          background: linear-gradient(180deg, transparent 0%, rgba(129, 140, 248, 0.03) 100%);
        }
        
        .lb-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .lb-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .lb-header-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--purple-400, #c084fc);
          margin-bottom: 24px;
        }

        .lb-heading {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          line-height: 1.15;
          color: var(--fg-primary);
          letter-spacing: -0.03em;
          margin-bottom: 18px;
        }

        .lb-subheading {
          font-size: 16px;
          color: var(--fg-secondary);
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .lb-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .lb-row {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .lb-skeleton {
          pointer-events: none;
        }
        .skeleton-box {
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }
        .skeleton-box::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        .lb-row:hover:not(.lb-skeleton) {
          background: rgba(30, 41, 59, 0.7);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.3);
        }

        .lb-row--first {
          background: linear-gradient(90deg, rgba(234, 179, 8, 0.1) 0%, rgba(30, 41, 59, 0.6) 100%);
          border-color: rgba(234, 179, 8, 0.2);
        }
        
        .lb-row--first::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #facc15;
          box-shadow: 0 0 10px #facc15;
        }

        .lb-row--second {
          background: linear-gradient(90deg, rgba(148, 163, 184, 0.1) 0%, rgba(30, 41, 59, 0.6) 100%);
          border-color: rgba(148, 163, 184, 0.15);
        }
        
        .lb-row--second::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #cbd5e1;
        }

        .lb-row--third {
          background: linear-gradient(90deg, rgba(180, 83, 9, 0.1) 0%, rgba(30, 41, 59, 0.6) 100%);
          border-color: rgba(180, 83, 9, 0.15);
        }
        
        .lb-row--third::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #d97706;
        }

        .lb-rank {
          width: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .lb-rank-num {
          font-size: 18px;
          font-weight: 700;
          color: var(--fg-muted, #94a3b8);
          font-variant-numeric: tabular-nums;
        }

        .lb-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.5px;
          margin-left: 12px;
          margin-right: 16px;
          flex-shrink: 0;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.2);
        }

        .lb-user-info {
          flex: 1;
          min-width: 0;
        }

        .lb-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--fg-primary);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lb-role {
          font-size: 13px;
          color: var(--fg-secondary);
        }

        .lb-metrics {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .lb-metric {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 16px;
          font-weight: 700;
          color: var(--fg-primary);
          font-variant-numeric: tabular-nums;
        }

        .lb-metric-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--fg-muted);
          letter-spacing: 0.05em;
        }

        @media (max-width: 640px) {
          .lb-row {
            padding: 12px 16px;
          }
          .lb-avatar {
            width: 38px;
            height: 38px;
            font-size: 13px;
            margin-left: 4px;
            margin-right: 12px;
          }
          .lb-name {
            font-size: 15px;
          }
          .lb-metrics {
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }
          .lb-metric {
            font-size: 14px;
          }
          .lb-rank {
            width: 32px;
          }
        }
      `}</style>
    </section>
  );
}
