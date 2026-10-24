import React from 'react';
import { Trophy, Shield, UserCheck, Lock, ExternalLink, Users, Send } from 'lucide-react';
import umangLogo from '../assets/umang-2026-logo.jpg';

export default function Header({ onOpenRegister, onOpenAdmin, onOpenTelegram, telegramUrl, stats, isAdminLoggedIn }) {
  const telegramLink = telegramUrl || "https://t.me/+MgD-vhGBGSgzOWI9";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Institute Branding */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-0">
            <div className="h-9 sm:h-14 w-auto max-w-[85px] sm:max-w-[180px] bg-white rounded-xl p-0.5 sm:p-1 border border-slate-200/90 shadow-sm flex items-center justify-center overflow-hidden transition-transform hover:scale-[1.02] flex-shrink-0">
              <img
                src={umangLogo}
                alt="NEXT IAS Umang 2026 Logo"
                className="h-full w-auto object-contain mix-blend-multiply"
              />
            </div>
            <div className="border-l border-slate-200 pl-3 hidden md:block">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-brand-navy font-heading leading-tight">
                  CRICKET LEAGUE <span className="text-brand-red">2026</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 uppercase tracking-wider">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">
                Sports &amp; Inspiration Meet • 6 Teams • 8 Overs per Inning (T8)
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Join Telegram Button - Visible in BOTH mobile & desktop beside Register button */}
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onOpenTelegram) onOpenTelegram();
              }}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 rounded-xl border border-sky-300 shadow-2xs transition transform hover:-translate-y-0.5 flex-shrink-0"
              title="Official Telegram Channel (Hidden Student Numbers)"
            >
              <Send className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span><span className="hidden sm:inline">Join </span>Telegram</span>
            </a>

            {/* Register Now Button */}
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-bold text-white bg-gradient-to-r from-brand-red to-red-700 hover:from-red-700 hover:to-brand-red rounded-xl shadow-md shadow-brand-red/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Register<span className="hidden sm:inline"> Now</span></span>
            </button>

            {/* Organizer Dashboard Lock Button */}
            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center justify-center p-1.5 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border transition flex-shrink-0 ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Restricted Organizer & Captain Dashboard"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline ml-1.5">{isAdminLoggedIn ? 'Organizer Portal' : 'Organizers'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
