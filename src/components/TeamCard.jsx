import React from 'react';
import { Shield, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

export default function TeamCard({ team, onSelectTeam, onJoin }) {
  const handleJoinClick = () => {
    if (typeof onJoin === 'function') {
      onJoin(team.id);
    } else if (typeof onSelectTeam === 'function') {
      onSelectTeam(team.id);
    }
  };

  const players = team.players || [];
  const batsmen = players.filter(p => p.role === 'batsman');
  const allRounders = players.filter(p => p.role === 'allRounder' || p.role === 'battingAllRounder' || p.role === 'bowlingAllRounder');
  const bowlers = players.filter(p => p.role === 'bowler');
  const wicketKeepers = players.filter(p => p.isWicketKeeper);

  const totalOccupied = players.length;
  const isFull = totalOccupied >= 10;
  const totalOpen = Math.max(0, 10 - totalOccupied);

  // 10 Fixed Squad Slots for the team
  const squadSlots = Array.from({ length: 10 }, (_, i) => players[i] || null);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'batsman':
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1 py-0.2 rounded whitespace-nowrap">🏏 Bat</span>;
      case 'battingAllRounder':
        return <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1 py-0.2 rounded whitespace-nowrap" title="Batting All-Rounder">⚡ Bat AR</span>;
      case 'bowlingAllRounder':
        return <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-300 px-1 py-0.2 rounded whitespace-nowrap" title="Bowling All-Rounder">⚡ Bowl AR</span>;
      case 'allRounder':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded whitespace-nowrap">⚡ AR</span>;
      case 'bowler':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded whitespace-nowrap">🎯 Bowl</span>;
      default:
        return <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1 py-0.2 rounded">{role}</span>;
    }
  };

  const renderSlotRow = (player, idx) => {
    if (player) {
      return (
        <div
          key={player.id || idx}
          className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs text-xs hover:border-slate-300 transition"
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-[10px] font-bold text-slate-400 w-4 flex-shrink-0">
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
          <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
            {getRoleBadge(player.role)}
            <span className="text-[10px] text-slate-500 font-medium w-7 text-right">
              {player.battingStyle === 'Left Hand' ? 'LHB' : 'RHB'}
            </span>
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
          <span className="text-[10px] font-medium text-slate-400 w-4 flex-shrink-0">
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
              {totalOccupied}/10
            </span>
            <div className="text-[10px] text-white/90 font-semibold mt-0.5">
              {isFull ? '🔴 Squad Full' : `🟢 ${totalOpen} Open`}
            </div>
          </div>
        </div>

        {/* Captain & Wicketkeeper indicator */}
        <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-white/95 truncate">
            <Shield className="w-3.5 h-3.5 text-amber-300 fill-amber-300 flex-shrink-0" />
            <span className="truncate">Captain: <strong>{team.captainName}</strong></span>
          </div>
          {wicketKeepers.length > 0 && (
            <span className="bg-amber-400/25 text-amber-200 border border-amber-300/30 px-1.5 py-0.2 rounded text-[10px] font-bold flex-shrink-0">
              🧤 {wicketKeepers.length} WK
            </span>
          )}
        </div>
      </div>

      {/* 2. Live Role Count Distribution Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 flex-wrap w-full justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            🏏 <span className="text-blue-700 font-extrabold">{batsmen.length}</span> <span className="text-slate-500 font-medium">Batsmen</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⚡ <span className="text-amber-700 font-extrabold">{allRounders.length}</span> <span className="text-slate-500 font-medium">All-Rounders</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            🎯 <span className="text-emerald-700 font-extrabold">{bowlers.length}</span> <span className="text-slate-500 font-medium">Bowlers</span>
          </span>
        </div>
      </div>

      {/* 3. 10-Player Squad Roster List */}
      <div className="p-3.5 flex-1 bg-slate-50/40">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[11px] font-extrabold text-slate-700 tracking-tight flex items-center gap-1">
            <span>📋</span>
            <span>OFFICIAL SQUAD ROSTER (10 Max)</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            {totalOccupied}/10 Filled
          </span>
        </div>
        <div className="space-y-1">
          {squadSlots.map((player, idx) => renderSlotRow(player, idx))}
        </div>
      </div>

      {/* 4. Action Button: Register for this team */}
      <div className="p-3 bg-white border-t border-slate-100">
        {isFull ? (
          <button
            disabled
            className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed text-center border border-slate-200"
          >
            Squad Full (10/10)
          </button>
        ) : (
          <button
            type="button"
            onClick={handleJoinClick}
            className="w-full py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5 cursor-pointer"
          >
            <span>Join {team.shortName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
