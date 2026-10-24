import React, { useState } from 'react';
import { Trophy, Calendar, Clock, MapPin, Award, Flame, CheckCircle, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';

export default function FixturesSection({ fixtures = [], teams = [] }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'
  const [viewMode, setViewMode] = useState('CARDS'); // 'CARDS' | 'BRACKET'

  // Helper to find team accent/colors
  const getTeamInfo = (teamId, teamName) => {
    if (!teamId) return { name: teamName || 'TBD', color: 'from-slate-600 to-slate-800', shortName: 'TBD' };
    const t = teams.find(item => item.id === teamId);
    if (t) return t;
    return { name: teamName || 'TBD', color: 'from-slate-600 to-slate-800', shortName: teamName || 'TBD' };
  };

  // Find Grand Finale champion if available
  const finalMatch = fixtures.find(f => f.stage === 'FINAL' || f.id === 'm-5' || f.id === 'm-7');
  const championTeam = finalMatch && finalMatch.winnerTeamId ? getTeamInfo(finalMatch.winnerTeamId, finalMatch.winnerTeamName) : null;

  // Status evaluation helpers that handle both 'Live' and 'Ongoing' robustly
  const isMatchLive = (status) => status === 'Live' || status === 'Ongoing' || status === 'live';
  const isMatchCompleted = (status) => status === 'Completed' || status === 'completed';
  const isMatchUpcoming = (status) => !isMatchLive(status) && !isMatchCompleted(status);

  // Filtered fixtures
  const filteredFixtures = fixtures.filter(m => {
    if (filter === 'LIVE') return isMatchLive(m.status);
    if (filter === 'UPCOMING') return isMatchUpcoming(m.status);
    if (filter === 'COMPLETED') return isMatchCompleted(m.status);
    return true;
  });

  const liveMatchesCount = fixtures.filter(m => isMatchLive(m.status)).length;
  const completedMatchesCount = fixtures.filter(m => isMatchCompleted(m.status)).length;
  const upcomingMatchesCount = fixtures.filter(m => isMatchUpcoming(m.status)).length;

  return (
    <div className="space-y-6">
      
      {/* 1. Champion Showcase Banner (when Tournament is won) */}
      {championTeam && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-xl border-4 border-yellow-300 relative overflow-hidden animate-in fade-in duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-4xl border-2 border-amber-300 animate-bounce">
                🏆
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-brand-gold text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <span>NEXT IAS Umang 2026 Champion</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-slate-950">
                  {championTeam.name}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">
                  Crown Champions of the Knockout Tournament! Congratulations to the players & captain!
                </p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-yellow-200 text-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Grand Finale Result</span>
              <span className="text-sm font-black text-slate-900">{finalMatch.summary || 'Won the Championship Final'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Fixtures Section Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-red text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Knockout Tournament Fixtures</span>
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight text-slate-900">
            Match Schedule, Live Scores &amp; Results
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 text-brand-red font-bold text-xs border border-red-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>25th October 2026</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-800 font-bold text-xs border border-sky-200">
              <Clock className="w-3.5 h-3.5" />
              <span>09:00 AM – 11:15 AM</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
              <Zap className="w-3.5 h-3.5" />
              <span>8 Overs per Inning (T8)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>3 Pitches Simultaneous (P1, P2, P3)</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            6 Teams • All Knockout Matches • 8 Overs per Inning (T8). Round 1 winners qualify: the team with the <strong>highest victory margin directly qualifies for the Grand Finale</strong>! The other two winners clash in the Semi-Final.
          </p>
        </div>

        {/* View Switcher: Cards vs Bracket */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('CARDS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'CARDS'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Fixture Cards
          </button>
          <button
            onClick={() => setViewMode('BRACKET')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'BRACKET'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌿 Knockout Bracket
          </button>
        </div>
      </div>

      {/* 3. Filter Pills Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>All Fixtures</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{fixtures.length}</span>
        </button>

        <button
          onClick={() => setFilter('LIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'LIVE'
              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Ongoing / Live</span>
          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">{liveMatchesCount}</span>
        </button>

        <button
          onClick={() => setFilter('UPCOMING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'UPCOMING'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Upcoming Fixtures</span>
          <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">{upcomingMatchesCount}</span>
        </button>

        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Completed & Winners</span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">{completedMatchesCount}</span>
        </button>
      </div>

      {/* 4. MAIN VIEW: CARDS MODE */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFixtures.map((match) => {
            const team1 = getTeamInfo(match.team1Id, match.team1Name);
            const team2 = getTeamInfo(match.team2Id, match.team2Name);
            const isCompleted = isMatchCompleted(match.status);
            const isLive = isMatchLive(match.status);

            return (
              <div
                key={match.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col ${
                  isLive
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : isCompleted
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Match Card Top Header */}
                <div className={`p-4 flex items-center justify-between text-xs font-bold ${
                  isLive
                    ? 'bg-rose-50 text-rose-900 border-b border-rose-200'
                    : isCompleted
                    ? 'bg-emerald-50/80 text-emerald-900 border-b border-emerald-100'
                    : 'bg-slate-50 text-slate-700 border-b border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[11px] text-slate-800 font-extrabold">
                      Match {match.matchNumber}
                    </span>
                    <span className="font-heading uppercase tracking-wide">
                      {match.round}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span>LIVE ONGOING</span>
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-medium">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Upcoming</span>
                    </span>
                  )}
                </div>

                {/* Match Schedule / Venue */}
                <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{match.dateTime || 'Scheduled Date TBD'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[180px]">{match.venue || 'Sports Ground'}</span>
                  </div>
                </div>

                {/* Teams Head-to-Head */}
                <div className="p-5 flex-1 flex flex-col justify-center space-y-3">
                  
                  {/* Team 1 */}
                  <div className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    Boolean(match.winnerTeamId) && match.winnerTeamId === match.team1Id
                      ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300'
                      : isCompleted && match.winnerTeamId && match.winnerTeamId !== match.team1Id
                      ? 'bg-slate-50/60 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm bg-gradient-to-br ${team1.color || 'from-slate-700 to-slate-900'}`}>
                        {team1.shortName ? team1.shortName.substring(0, 3) : 'T1'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 font-heading">
                            {match.team1Name || 'Winner TBD'}
                          </span>
                          {Boolean(match.winnerTeamId) && match.winnerTeamId === match.team1Id && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                              <span>👑 WINNER</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">Team 1</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {match.scores && match.scores.team1 ? (
                        <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                          {match.scores.team1}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">--</span>
                      )}
                    </div>
                  </div>

                  {/* VS Divider */}
                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <span className="relative px-3 bg-white text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      VS
                    </span>
                  </div>

                  {/* Team 2 */}
                  <div className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    Boolean(match.winnerTeamId) && match.winnerTeamId === match.team2Id
                      ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300'
                      : isCompleted && match.winnerTeamId && match.winnerTeamId !== match.team2Id
                      ? 'bg-slate-50/60 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm bg-gradient-to-br ${team2.color || 'from-slate-700 to-slate-900'}`}>
                        {team2.shortName ? team2.shortName.substring(0, 3) : 'T2'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 font-heading">
                            {match.team2Name || 'Winner TBD'}
                          </span>
                          {Boolean(match.winnerTeamId) && match.winnerTeamId === match.team2Id && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                              <span>👑 WINNER</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">Team 2</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {match.scores && match.scores.team2 ? (
                        <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                          {match.scores.team2}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">--</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Match Bottom Footer / Result Note */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Award className="w-4 h-4 text-brand-red flex-shrink-0" />
                    <span className="font-medium text-[11px]">
                      {match.summary || (isCompleted ? 'Match concluded' : 'Winner advances to next round')}
                    </span>
                  </div>

                  {match.nextMatchId && (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <span>Advances</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. MAIN VIEW: BRACKET MODE (Visual Tree) */}
      {viewMode === 'BRACKET' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
          <div className="min-w-[850px] space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-black font-heading text-slate-900">
                Tournament Knockout Progression Tree
              </h3>
              <p className="text-xs text-slate-500">
                Round 1 (3 Knockouts) ➔ Highest Margin Qualifier &amp; Semi-Final ➔ Grand Finale ➔ Champion
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 relative">
              
              {/* Column 1: Round 1 (3 Matches) */}
              <div className="space-y-4">
                <div className="text-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Round 1 (3 Knockout Clashes)
                  </span>
                  <span className="text-[10px] text-slate-400 block">Pitches 1, 2, 3 Simultaneous</span>
                </div>

                {fixtures.filter(m => m.stage === 'ROUND_1' || m.stage === 'QF').map(m => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl border text-xs space-y-1.5 shadow-sm ${
                      isMatchCompleted(m.status)
                        ? 'bg-slate-50 border-emerald-300'
                        : isMatchLive(m.status)
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>Match {m.matchNumber}: {m.round}</span>
                      {isMatchLive(m.status) && <span className="text-rose-600 font-extrabold animate-pulse">● LIVE</span>}
                      {isMatchCompleted(m.status) && <span className="text-emerald-700 font-extrabold">✓ Done</span>}
                    </div>

                    <div className={`p-1.5 rounded-lg flex items-center justify-between font-bold ${
                      Boolean(m.winnerTeamId) && m.winnerTeamId === m.team1Id ? 'bg-amber-100 text-amber-950 font-black' : 'text-slate-800'
                    }`}>
                      <span className="truncate max-w-[140px]">{m.team1Name || 'Team 1'}</span>
                      <span className="font-mono text-[11px]">{m.scores?.team1 || ''}</span>
                    </div>

                    <div className={`p-1.5 rounded-lg flex items-center justify-between font-bold ${
                      Boolean(m.winnerTeamId) && m.winnerTeamId === m.team2Id ? 'bg-amber-100 text-amber-950 font-black' : 'text-slate-800'
                    }`}>
                      <span className="truncate max-w-[140px]">{m.team2Name || 'Team 2'}</span>
                      <span className="font-mono text-[11px]">{m.scores?.team2 || ''}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 2: Playoff & Direct Finalist */}
              <div className="space-y-6 flex flex-col justify-center">
                <div className="text-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Semi-Final &amp; Direct Qualifier
                  </span>
                  <span className="text-[10px] text-slate-400 block">Highest Margin Winner bypasses to Final</span>
                </div>

                {/* Direct Finalist Highlight Box */}
                <div className="p-3.5 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 text-xs space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-900">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Direct Finalist Bye</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-extrabold text-[9px]">Highest Margin</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200 text-slate-900 font-black truncate">
                    {fixtures.find(m => m.id === 'm-5')?.team1Name || 'Direct Finalist (Highest Margin R1 Winner)'}
                  </div>
                  <div className="text-[10px] text-amber-800 font-semibold">
                    ⭐ Direct entry into Grand Finale (Match 5)
                  </div>
                </div>

                {/* Semi-Final Match */}
                {fixtures.filter(m => m.stage === 'SF').map(m => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-2 shadow-sm ${
                      isMatchCompleted(m.status)
                        ? 'bg-slate-50 border-emerald-300'
                        : isMatchLive(m.status)
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>Match {m.matchNumber}: {m.round}</span>
                      {isMatchLive(m.status) && <span className="text-rose-600 font-extrabold animate-pulse">● LIVE</span>}
                      {isMatchCompleted(m.status) && <span className="text-emerald-700 font-extrabold">✓ Done</span>}
                    </div>

                    <div className={`p-2 rounded-lg flex items-center justify-between font-bold ${
                      Boolean(m.winnerTeamId) && m.winnerTeamId === m.team1Id ? 'bg-amber-100 text-amber-950 font-black' : 'text-slate-800'
                    }`}>
                      <span className="truncate max-w-[150px]">{m.team1Name || 'Winner R1'}</span>
                      <span className="font-mono text-[11px]">{m.scores?.team1 || ''}</span>
                    </div>

                    <div className={`p-2 rounded-lg flex items-center justify-between font-bold ${
                      Boolean(m.winnerTeamId) && m.winnerTeamId === m.team2Id ? 'bg-amber-100 text-amber-950 font-black' : 'text-slate-800'
                    }`}>
                      <span className="truncate max-w-[150px]">{m.team2Name || 'Winner R1'}</span>
                      <span className="font-mono text-[11px]">{m.scores?.team2 || ''}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 3: Grand Finale & Champion */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="text-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                    Grand Finale (Championship)
                  </span>
                  <span className="text-[10px] text-slate-400 block">Pitch 1 (Trophy Clash)</span>
                </div>

                {fixtures.filter(m => m.stage === 'FINAL').map(m => (
                  <div
                    key={m.id}
                    className="p-5 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 to-white text-xs space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-amber-950">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span>Grand Finale (Match {m.matchNumber})</span>
                      </span>
                      {isMatchCompleted(m.status) && <span className="text-emerald-700">✓ Finished</span>}
                      {isMatchLive(m.status) && <span className="text-rose-600 animate-pulse">● LIVE</span>}
                    </div>

                    <div className={`p-2.5 rounded-xl flex items-center justify-between font-bold border ${
                      Boolean(m.winnerTeamId) && m.winnerTeamId === m.team1Id ? 'bg-amber-100 border-amber-300 text-amber-950 font-black' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                      <span className="truncate max-w-[160px]">{m.team1Name || 'Direct Finalist'}</span>
                      <span className="font-mono text-xs">{m.scores?.team1 || ''}</span>
                    </div>

                    <div className="text-center text-[10px] font-black text-slate-400 uppercase">VS</div>

                    <div className={`p-2.5 rounded-xl flex items-center justify-between font-bold border ${
                      Boolean(m.winnerTeamId) && m.winnerTeamId === m.team2Id ? 'bg-amber-100 border-amber-300 text-amber-950 font-black' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                      <span className="truncate max-w-[160px]">{m.team2Name || 'Winner Semi-Final'}</span>
                      <span className="font-mono text-xs">{m.scores?.team2 || ''}</span>
                    </div>

                    {m.winnerTeamName && (
                      <div className="pt-2 border-t border-amber-200 text-center">
                        <span className="text-[10px] font-bold text-amber-800 block">CHAMPION</span>
                        <span className="text-sm font-black text-slate-900 font-heading">
                          🏆 {m.winnerTeamName}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
