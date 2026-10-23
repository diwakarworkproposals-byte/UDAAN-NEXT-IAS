import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, UserCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function TeamCard({ team, onSelectTeam }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const stats = team.stats || {
    maxSlots: { batsmen: 5, allRounders: 4, bowlers: 4, total: 13 },
    occupied: { batsmen: 0, allRounders: 0, bowlers: 0, total: 0 },
    available: { batsmen: 5, allRounders: 4, bowlers: 4, total: 13 },
    isFull: false,
    wicketKeepersCount: 0
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'batsman':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">🏏 Batsman</span>;
      case 'allRounder':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">⚡ All-Rounder</span>;
      case 'bowler':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">🎯 Bowler</span>;
      default:
        return null;
    }
  };

  const getSlotPill = (label, occupied, max) => {
    const isSlotFull = occupied >= max;
    return (
      <div className={`p-2 rounded-xl border flex flex-col items-center text-center ${
        isSlotFull 
          ? 'bg-rose-50 border-rose-200 text-rose-700' 
          : occupied >= max - 1 
            ? 'bg-amber-50 border-amber-200 text-amber-800' 
            : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{label}</span>
        <span className="text-sm font-extrabold mt-0.5">
          {occupied} <span className="text-[10px] text-slate-400 font-normal">/ {max}</span>
        </span>
        <span className="text-[10px] font-medium mt-0.5">
          {isSlotFull ? 'FULL' : `${max - occupied} left`}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col">
      {/* Team Header banner with gradient */}
      <div className={`p-5 bg-gradient-to-r ${team.color} text-white relative`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-block px-2.5 py-0.5 bg-black/25 backdrop-blur-sm rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white/90 mb-1.5">
              {team.shortName}
            </div>
            <h3 className="text-xl font-black font-heading tracking-tight text-white drop-shadow-sm">
              {team.name}
            </h3>
            <p className="text-xs text-white/80 font-medium italic mt-0.5">
              "{team.tagline}"
            </p>
          </div>

          {/* Overall slots indicator */}
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white text-brand-navy shadow-sm">
              {stats.occupied.total} / 13 Slots
            </span>
            <div className="text-[11px] text-white/80 mt-1">
              {stats.isFull ? '🔴 Roster Full' : `🟢 ${stats.available.total} Open`}
            </div>
          </div>
        </div>

        {/* Captain strip */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-white/95">
            <Shield className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Captain: <strong>{team.captainName}</strong></span>
          </div>
          {stats.wicketKeepersCount > 0 && (
            <span className="text-[11px] bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-full font-semibold">
              🧤 {stats.wicketKeepersCount} WK
            </span>
          )}
        </div>
      </div>

      {/* Role Slots Breakdown Grid */}
      <div className="p-4 bg-slate-50/60 border-b border-slate-100">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Slot Status (5 Batsmen • 4 All-rounders • 4 Bowlers)
        </div>
        <div className="grid grid-cols-3 gap-2">
          {getSlotPill('Batsmen', stats.occupied.batsmen, stats.maxSlots.batsmen)}
          {getSlotPill('All-Rounders', stats.occupied.allRounders, stats.maxSlots.allRounders)}
          {getSlotPill('Bowlers', stats.occupied.bowlers, stats.maxSlots.bowlers)}
        </div>
      </div>

      {/* Expandable Squad List */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 hover:text-brand-red transition border-b border-slate-100"
          >
            <span>Current Squad ({team.players ? team.players.length : 0} players confirmed)</span>
            <span className="flex items-center gap-1 text-slate-400">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
              {(!team.players || team.players.length === 0) ? (
                <p className="text-xs text-slate-400 italic py-2 text-center">No players registered yet. Be the first!</p>
              ) : (
                team.players.map((p, idx) => (
                  <div key={p.id || idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <span>{p.name}</span>
                        {p.isCaptain && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            (C)
                          </span>
                        )}
                        {p.isWicketKeeper && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold" title="Designated Wicketkeeper">
                            🧤 WK
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {p.battingStyle || 'RHB'} • {p.bowlingStyle || 'Bowler'} {p.rollNo ? `• ${p.rollNo}` : ''}
                      </div>
                    </div>
                    <div>
                      {getRoleBadge(p.role)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Button: Register for this team */}
        <div className="mt-4 pt-2">
          {stats.isFull ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed text-center border border-slate-200"
            >
              Squad Full (13/13)
            </button>
          ) : (
            <button
              onClick={() => onSelectTeam(team.id)}
              className="w-full py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Join {team.shortName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
