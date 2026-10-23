import React from 'react';
import { Trophy, Shield, UserCheck, Lock, ExternalLink, Users } from 'lucide-react';

export default function Header({ onOpenRegister, onOpenAdmin, onOpenTelegram, stats, isAdminLoggedIn }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Institute Branding */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-white shadow-md shadow-brand-red/20 font-black text-xl">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-navy font-heading">
                  NEXT <span className="text-brand-red">IAS</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300 uppercase tracking-wider">
                  Cricket 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Annual Premier Institute Tournament • 8 Teams • 108 Players
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onOpenTelegram}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition"
              title="Official Telegram Channel (Hidden Student Numbers)"
            >
              <span>📢 Telegram Channel</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-red to-red-700 hover:from-red-700 hover:to-brand-red rounded-xl shadow-md shadow-brand-red/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Users className="w-4 h-4" />
              <span>Register Now</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Restricted Organizer & Captain Dashboard"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAdminLoggedIn ? 'Organizer Portal (Active)' : 'Organizers'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
