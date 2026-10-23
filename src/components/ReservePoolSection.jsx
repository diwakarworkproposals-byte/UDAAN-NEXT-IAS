import React from 'react';
import { UserCheck, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';

export default function ReservePoolSection({ reservePool, onJoinReserve }) {
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
              <span>Central Reserve & Standby Roster</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900">
              Central Reserve Pool ({reservePool.length} Players Standby)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Out of 108 total interested participants, 104 are assigned to the 8 primary squads (13 per team). The remaining participants form our strategic Reserve Pool for injury covers, attendance fluctuations, and team balance.
            </p>
          </div>

          <button
            onClick={onJoinReserve}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Join Reserve Pool</span>
          </button>
        </div>

        {/* Reserve Pool Player Cards */}
        <div className="mt-6">
          {reservePool.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              No players currently in reserve pool. As team slots fill up, overflow registrants will be housed here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reservePool.map((p, idx) => (
                <div key={p.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <span>{p.name}</span>
                      {p.isWicketKeeper && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded font-bold">🧤 WK</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.battingStyle} • {p.bowlingStyle}
                    </div>
                    <div className="text-[10px] text-sky-700 font-semibold mt-1">
                      Status: Standby / Ready to Draft
                    </div>
                  </div>
                  <div>
                    {getRoleBadge(p.role)}
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
            <strong>Organizer Discretion & Fairness:</strong> If an allocated player from any of the 8 teams fails to confirm attendance or reports an injury, organizers will elevate players from this Reserve Pool directly into the Playing XI squad according to role matching.
          </div>
        </div>

      </div>
    </div>
  );
}
