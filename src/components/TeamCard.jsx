import React from 'react';
import { Shield, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

export default function TeamCard({ team, onSelectTeam }) {
  const players = team.players || [];
  const batsmen = players.filter(p => p.role === 'batsman');
  const allRounders = players.filter(p => p.role === 'allRounder');
  const bowlers = players.filter(p => p.role === 'bowler');

  const batsmanSlots = Array.from({ length: 5 }, (_, i) => batsmen[i] || null);
  const allRounderSlots = Array.from({ length: 4 }, (_, i) => allRounders[i] || null);
  const bowlerSlots = Array.from({ length: 4 }, (_, i) => bowlers[i] || null);

  const totalOccupied = players.length;
  const isFull = totalOccupied >= 13;
  const totalOpen = Math.max(0, 13 - totalOccupied);
  const wicketKeeperCount = players.filter(p => p.isWicketKeeper).length;

  const renderSlotRow = (player, idx, roleLabel) => {
    if (player) {
      return (
        <div
          key={player.id || idx}
          className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs text-xs hover:border-slate-300 transition"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 w-3.5 flex-shrink-0">
              {idx + 1}.
            </span>
            {player.isWicketKeeper && (
              <span className="text-sm flex-shrink-0" title="Wicketkeeper">
                🧤
              </span>
            )}
            <span className="font-bold text-slate-900 truncate">
              {player.name}
            </span>
            {player.isCaptain && (
              <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1 rounded flex-shrink-0">
                (C)
              </span>
            )}
            {(player.isExtra || player.attendance === 'Not Sure') && (
              <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1.5 rounded flex-shrink-0" title="Marked Not Sure (Extra / Bench)">
                EXTRA
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium flex-shrink-0 pl-1">
            <span>{player.battingStyle === 'Left Hand' ? 'LHB' : 'RHB'}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={`empty-${idx}`}
        className="flex items-center justify-between py-1 px-2.5 rounded-lg border border-dashed border-slate-200 bg-slate-50/70 text-slate-400 text-xs"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-slate-400 w-3.5 flex-shrink-0">
            {idx + 1}.
          </span>
          <span className="text-[11px] italic font-medium text-slate-400">
            Vacant Slot
          </span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
          Open
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col">
      
      {/* 1. Team Banner Header */}
      <div className={`p-4 bg-gradient-to-r ${team.color} text-white relative`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-block px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white/95 mb-1">
              {team.shortName}
            </span>
            <h3 className="text-lg font-black font-heading tracking-tight text-white leading-snug drop-shadow-sm">
              {team.name}
            </h3>
            <p className="text-[11px] text-white/80 font-medium italic">
              "{team.tagline}"
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-black bg-white text-slate-900 shadow-xs">
              {totalOccupied}/13
            </span>
            <div className="text-[10px] text-white/90 font-semibold mt-0.5">
              {isFull ? '🔴 Full' : `🟢 ${totalOpen} Open`}
            </div>
          </div>
        </div>

        {/* Captain & Wicketkeeper indicator */}
        <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-white/95 truncate">
            <Shield className="w-3.5 h-3.5 text-amber-300 fill-amber-300 flex-shrink-0" />
            <span className="truncate">Captain: <strong>{team.captainName}</strong></span>
          </div>
          {wicketKeeperCount > 0 && (
            <span className="bg-amber-400/25 text-amber-200 border border-amber-300/30 px-1.5 py-0.2 rounded text-[10px] font-bold flex-shrink-0">
              🧤 {wicketKeeperCount} WK
            </span>
          )}
        </div>
      </div>

      {/* 2. Categorized Roster Slots List */}
      <div className="p-3.5 flex-1 space-y-3.5 bg-slate-50/40">
        
        {/* Batsmen Section (5 Slots) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[11px] font-extrabold text-slate-700 tracking-tight flex items-center gap-1">
              <span>🏏</span>
              <span>BATSMEN (5 Slots)</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {batsmen.length}/5
            </span>
          </div>
          <div className="space-y-1">
            {batsmanSlots.map((player, idx) => renderSlotRow(player, idx, 'Batsman'))}
          </div>
        </div>

        {/* All-Rounders Section (4 Slots) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[11px] font-extrabold text-slate-700 tracking-tight flex items-center gap-1">
              <span>⚡</span>
              <span>ALL-ROUNDERS (4 Slots)</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {allRounders.length}/4
            </span>
          </div>
          <div className="space-y-1">
            {allRounderSlots.map((player, idx) => renderSlotRow(player, idx, 'All-Rounder'))}
          </div>
        </div>

        {/* Bowlers Section (4 Slots) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[11px] font-extrabold text-slate-700 tracking-tight flex items-center gap-1">
              <span>🎯</span>
              <span>BOWLERS (4 Slots)</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {bowlers.length}/4
            </span>
          </div>
          <div className="space-y-1">
            {bowlerSlots.map((player, idx) => renderSlotRow(player, idx, 'Bowler'))}
          </div>
        </div>

      </div>

      {/* 3. Action Button: Register for this team */}
      <div className="p-3 bg-white border-t border-slate-100">
        {isFull ? (
          <button
            disabled
            className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed text-center border border-slate-200"
          >
            Squad Full (13/13)
          </button>
        ) : (
          <button
            onClick={() => onSelectTeam(team.id)}
            className="w-full py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5"
          >
            <span>Join {team.shortName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
