import React from 'react';
import { UserCheck, Lock, Sparkles, PlusCircle } from 'lucide-react';

export default function ReservePoolSection({ reservePool, onJoinReserve }) {
  const isFull = reservePool.length >= 4;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'batsman':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800">🏏 Batsman</span>;
      case 'allRounder':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">⚡ All-Rounder</span>;
      case 'bowler':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">🎯 Bowler</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 overflow-hidden relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Title & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Central Reserve Standby Roster (Capped at 4 Students)</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900">
              Central Reserve Pool ({reservePool.length}/4 Slots Filled)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Strictly limited to 4 standby students. Once these 4 slots are occupied, the reserve pool locks automatically, and any further registrants who are not sure will join as Extras in their chosen team.
            </p>
          </div>

          <div>
            {isFull ? (
              <button
                disabled
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold cursor-not-allowed border border-slate-300"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Reserve Pool Locked (4/4 Full)</span>
              </button>
            ) : (
              <button
                onClick={onJoinReserve}
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Join Reserve Pool ({4 - reservePool.length} Left)</span>
              </button>
            )}
          </div>
        </div>

        {/* Reserve Pool Player Cards */}
        <div className="mt-6">
          {reservePool.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              No players currently in reserve pool. Maximum capacity: 4 standby candidates.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {reservePool.map((p, idx) => (
                <div key={p.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400">STANDBY #{idx + 1}</span>
                      {getRoleBadge(p.role)}
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      {p.isWicketKeeper && (
                        <span className="text-sm" title="Wicketkeeper">🧤</span>
                      )}
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.battingStyle || 'RHB'} {p.rollNo ? `• ${p.rollNo}` : ''}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-sky-700 font-bold">Status: Standby</span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1 rounded text-[9px]">
                      EXTRA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Explanatory callout for fairness */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Attendance Protocol:</strong> Students marked as <strong>EXTRA</strong> or in this <strong>Central Reserve Pool</strong> will be elevated to the Playing 11 by the match organizers if any primary playing 11 member is absent on match day.
          </div>
        </div>

      </div>
    </div>
  );
}
