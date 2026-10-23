import React from 'react';
import { Send, ShieldCheck, Lock, Bell, CheckCircle } from 'lucide-react';

export default function TelegramNotice({ telegramUrl }) {
  return (
    <div className="bg-gradient-to-br from-sky-900 via-brand-navy to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-sky-800/40 relative overflow-hidden">
      
      {/* Background Telegram watermarks */}
      <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
        <Send className="w-80 h-80 text-white" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Official Student Communication Policy</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Why We Use a Private Telegram Channel
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              To strictly protect student privacy and prevent unwanted contact sharing across batches, WhatsApp groups are avoided. In our official Telegram channel, member lists and personal phone numbers remain <strong>completely invisible</strong> to other candidates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-sky-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero phone number visibility between peers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Broadcast match schedules & toss results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Weather & ground condition updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Official umpire announcements</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto text-center md:text-right">
            <a
              href={telegramUrl || "https://t.me/+NextIasCricket2026"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm shadow-lg shadow-sky-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
            >
              <Send className="w-4 h-4" />
              <span>Join Official Telegram Channel</span>
            </a>
            <p className="text-[11px] text-slate-400 mt-2">
              Free & instant access for all registered players
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
