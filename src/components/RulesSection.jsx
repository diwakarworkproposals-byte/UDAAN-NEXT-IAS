import React from 'react';
import { BookOpen, Users, CheckCircle, ShieldAlert, Award } from 'lucide-react';

export default function RulesSection() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              Tournament Roster Architecture & Official Rules
            </h2>
            <p className="text-xs text-slate-500">
              Approved guidelines for NEXT IAS Umang 2026 Cricket Tournament (Sports &amp; Inspiration Meet)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Rule 1: Flexible 10-Player Squad */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-brand-red font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">10-Player Squad Limit</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every team has a strict limit of <strong>10 players total</strong>. No rigid role slot quotas — teams dynamically record live counts of <strong>Batsmen, All-Rounders, and Bowlers</strong> as students join. Total capacity: 80 slots across 8 teams.
            </p>
          </div>

          {/* Rule 2: 10-Over Format */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">10-Over Fast Match (T10)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every match is a high-octane <strong>10 overs per match</strong> knockout clash. Matches run between <strong>09:00 AM – 11:00 AM on 25th October 2026</strong>, culminating in the Grand Finale at 10:25 AM!
            </p>
          </div>

          {/* Rule 3: 4 Pitches Simultaneous */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">4 Pitches Simultaneous</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              With <strong>4 pitches operating simultaneously</strong>, all 4 Quarter-Finals commence together at 09:00 AM. Semi-Finals kick off at 09:45 AM, and the Trophy Final is held on Pitch 1!
            </p>
          </div>

        </div>

        {/* Roles Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-slate-500">
            Tournament Management Hierarchy
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-brand-navy block mb-0.5">8 On-Field Captains</strong>
              <span className="text-slate-600">Selected from student volunteers & institute organizers. They make tactical decisions, manage bat/bowl orders, and maintain player spirit.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-brand-navy block mb-0.5">2 Organizers & Match Referees</strong>
              <span className="text-slate-600">Manage pitch allocations, overs, attendance verification, scorekeeping, and disputes.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
