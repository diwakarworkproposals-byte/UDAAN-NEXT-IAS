import React from 'react';
import { Users, Trophy, ShieldCheck, UserCheck, Flame, Info, Sparkles } from 'lucide-react';
import umangLogo from '../assets/umang-2026-logo.jpg';

export default function StatsBanner({ tournament }) {
  const totalSlots = tournament.totalSlotsAcrossTeams || 80;
  const filledSlots = tournament.totalAssignedPlayers !== undefined ? tournament.totalAssignedPlayers : 8;
  const reserveCount = tournament.totalReserve !== undefined ? tournament.totalReserve : 0;
  const totalRegistered = tournament.totalRegistered !== undefined ? tournament.totalRegistered : (filledSlots + reserveCount);
  const totalTarget = tournament.totalExpectedPlayers || 84;

  const percentFilled = Math.min(100, Math.round((filledSlots / totalSlots) * 100));

  return (
    <div className="bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy-dark text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 cricket-mesh relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Banner Hero Showcase */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-10">
          
          {/* Top Festival Tag */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-[10px] sm:text-xs font-bold mb-6 backdrop-blur-md shadow-sm max-w-full">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 flex-shrink-0" />
            <span className="tracking-wider uppercase truncate">Official Team Selection &amp; Role Allocation Portal</span>
          </div>

          {/* Official Umang 2026 Header Showcase Card */}
          <div className="relative group max-w-md sm:max-w-lg w-full mb-6 mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-sky-400 to-amber-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition duration-700"></div>
            <div className="relative bg-[#fcfbfa] rounded-2xl p-2 sm:p-3 shadow-2xl border border-white/50 overflow-hidden">
              <div className="relative w-full overflow-hidden rounded-xl">
                <img
                  src={umangLogo}
                  alt="NEXT IAS Umang 2026 - Sports &amp; Inspiration Meet"
                  className="w-full h-auto block select-none"
                />
              </div>
            </div>
          </div>

          {/* Cricket Championship Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-heading leading-tight text-white">
            Cricket League <span className="text-brand-gold">2026</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base font-bold text-sky-300 uppercase tracking-widest font-heading">
            Sports &amp; Inspiration Meet • Knockout Championship
          </p>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Welcome NEXT IAS aspirants &amp; faculty! Scheduled on <strong className="text-white">25th October 2026 (09:00 AM – 11:00 AM)</strong> • <strong className="text-white">10-Over Fast Matches (T10)</strong> across <strong className="text-white">4 simultaneous pitches</strong>. 8 premier teams with flexible 10-player squads led by 8 student captains and 2 organizers.
          </p>

          {/* Privacy Guarantee Pill */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Student Privacy Protected: Contact numbers are never shared publicly or visible to other candidates.</span>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Registered */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>TOTAL REGISTERED</span>
              <Users className="w-4 h-4 text-brand-red" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">{totalRegistered}</span>
              <span className="text-xs text-slate-400">/ {totalTarget} players</span>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-red h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.round((totalRegistered / totalTarget) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              74 Candidates + 10 Organizers/Captains
            </p>
          </div>

          {/* Card 2: 8 Team Roster Slots */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>SQUAD SLOTS</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading">{filledSlots}</span>
              <span className="text-xs text-slate-400">/ {totalSlots} filled</span>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${percentFilled}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              8 Teams × 10 Players = 80 Slots
            </p>
          </div>

          {/* Card 3: Central Reserve Pool */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>CENTRAL RESERVE POOL</span>
              <UserCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-heading">{reserveCount}</span>
              <span className="text-xs text-slate-400">standby players</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Available for balance & replacements</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              4 base reserve slots + overflow buffer
            </p>
          </div>

          {/* Card 4: Captain and Organizers */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>CAPTAIN AND ORGANIZERS</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-heading">10</span>
              <span className="text-xs text-slate-400">appointed</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-300">
              <span>8 Field Captains + 2 Organizers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Leading teams & maintaining balance
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
