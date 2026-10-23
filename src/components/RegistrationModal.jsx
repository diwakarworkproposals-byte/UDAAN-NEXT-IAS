import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Trophy, Sparkles, User, Phone, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegistrationModal({ isOpen, onClose, teams, preselectedTeamId, onRegistered }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    mobile: '',
    whatsapp: '',
    role: 'allRounder',
    isWicketKeeper: false,
    battingStyle: 'Right Hand',
    bowlingStyle: 'Right-arm Fast Medium',
    preferredTeamId: preselectedTeamId || (teams[0] ? teams[0].id : 'team-1'),
    joinReserveIfFull: true,
    confirmedAttendance: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  if (!isOpen) return null;

  // Selected team object
  const selectedTeam = teams.find(t => t.id === formData.preferredTeamId);
  const stats = selectedTeam ? selectedTeam.stats : null;

  // Check if role is available in selected team
  let isRoleFullInSelectedTeam = false;
  if (stats && formData.preferredTeamId !== 'reserve') {
    if (formData.role === 'batsman' && stats.available.batsmen <= 0) isRoleFullInSelectedTeam = true;
    if (formData.role === 'allRounder' && stats.available.allRounders <= 0) isRoleFullInSelectedTeam = true;
    if (formData.role === 'bowler' && stats.available.bowlers <= 0) isRoleFullInSelectedTeam = true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.confirmedAttendance) {
      setError('Please confirm your attendance availability for the match days.');
      return;
    }

    setLoading(true);

    try {
      const result = await onRegistered({
        ...formData,
        mobile: cleanMobile,
        whatsapp: formData.whatsapp ? formData.whatsapp.replace(/\D/g, '').slice(-10) : cleanMobile
      });

      setSuccessResult(result);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti optional
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccessResult(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy-dark text-white p-6 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>NEXT IAS Cricket League 2026</span>
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight">
            Player Registration & Team Selection
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Choose your preferred team and role. Slots are allocated real-time.
          </p>
        </div>

        {/* Content */}
        {successResult ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-heading">Registration Confirmed!</h3>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              {successResult.message || `You have been allocated a spot in ${successResult.assignedTo}!`}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Player Name:</span>
                <span className="font-bold text-slate-800">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold uppercase text-brand-red">{formData.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wicketkeeper:</span>
                <span className="font-bold text-slate-800">{formData.isWicketKeeper ? 'Yes (🧤)' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allocated Team:</span>
                <span className="font-bold text-emerald-700">{successResult.assignedTo || 'Assigned'}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition"
              >
                Done & View Rosters
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Privacy Disclaimer */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-bold">Confidentiality Guarantee:</strong> Your mobile and WhatsApp number will strictly remain with the organizers for match scheduling and will <em>never</em> be displayed publicly to other students.
              </div>
            </div>

            {/* Section 1: Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Roll No / Batch (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GS Foundation 2025-26"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (Private) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number (Private)
                </label>
                <input
                  type="tel"
                  placeholder="Leave blank if same as mobile"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Section 2: Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Primary Playing Role *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'batsman', label: 'Batsman', icon: '🏏', subtitle: '5 Slots / Team' },
                  { id: 'allRounder', label: 'All-Rounder', icon: '⚡', subtitle: '4 Slots / Team' },
                  { id: 'bowler', label: 'Bowler', icon: '🎯', subtitle: '4 Slots / Team' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    className={`p-3 rounded-xl border text-center transition ${
                      formData.role === r.id
                        ? 'border-brand-red bg-red-50/80 text-brand-red-dark font-extrabold ring-2 ring-brand-red/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{r.icon}</div>
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{r.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wicketkeeper & Playing Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              
              {/* Wicketkeeper identifier (Separate capability so 13-slot math remains intact) */}
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Wicketkeeping Ability 🧤
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-bold text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={formData.isWicketKeeper}
                    onChange={(e) => setFormData({ ...formData, isWicketKeeper: e.target.checked })}
                    className="w-4 h-4 text-brand-red rounded border-slate-300 focus:ring-brand-red"
                  />
                  <span className="flex items-center gap-1">
                    <span>🧤</span>
                    <span>Can keep wickets</span>
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Batting Hand
                </label>
                <select
                  value={formData.battingStyle}
                  onChange={(e) => setFormData({ ...formData, battingStyle: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                >
                  <option value="Right Hand">Right Hand (RHB)</option>
                  <option value="Left Hand">Left Hand (LHB)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Bowling Style
                </label>
                <select
                  value={formData.bowlingStyle}
                  onChange={(e) => setFormData({ ...formData, bowlingStyle: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                >
                  <option value="Right-arm Fast Medium">Right-arm Fast/Medium</option>
                  <option value="Right-arm Off Spin">Right-arm Off Spin</option>
                  <option value="Right-arm Leg Break">Right-arm Leg Break</option>
                  <option value="Left-arm Fast Medium">Left-arm Fast/Medium</option>
                  <option value="Left-arm Orthodox Spin">Left-arm Orthodox</option>
                  <option value="None">None (Pure Batsman/WK)</option>
                </select>
              </div>
            </div>

            {/* Section 3: Preferred Team Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Select Preferred Team *
                </label>
                <span className="text-[11px] text-slate-500">
                  Real-time slot indicator
                </span>
              </div>
              <select
                value={formData.preferredTeamId}
                onChange={(e) => setFormData({ ...formData, preferredTeamId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none font-medium"
              >
                {teams.map((t) => {
                  const s = t.stats;
                  let roleAvailable = 0;
                  if (s) {
                    if (formData.role === 'batsman') roleAvailable = s.available.batsmen;
                    if (formData.role === 'allRounder') roleAvailable = s.available.allRounders;
                    if (formData.role === 'bowler') roleAvailable = s.available.bowlers;
                  }
                  const isRoleFull = roleAvailable <= 0;

                  return (
                    <option key={t.id} value={t.id}>
                      {t.name} {isRoleFull ? `(FULL for ${formData.role}s)` : `(${roleAvailable} ${formData.role} slots open)`}
                    </option>
                  );
                })}
                <option value="reserve">
                  ★ Central Reserve Pool (Direct Standby Registration)
                </option>
              </select>

              {/* Warning if role is full in selected team */}
              {isRoleFullInSelectedTeam && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Role Slot Filled:</strong> All {formData.role} slots in {selectedTeam ? selectedTeam.name : 'this team'} are currently occupied!
                    <br />
                    You can either choose a different team above, or submit to join the <strong>Central Reserve Pool</strong>. Organizers will allocate you if attendance requires.
                  </div>
                </div>
              )}
            </div>

            {/* Auto-reserve Checkbox */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.joinReserveIfFull}
                  onChange={(e) => setFormData({ ...formData, joinReserveIfFull: e.target.checked })}
                  className="w-4 h-4 text-brand-red rounded border-slate-300 focus:ring-brand-red mt-0.5"
                />
                <span>If my preferred team/role fills up before my submission, enroll me automatically in the Central Reserve Pool.</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.confirmedAttendance}
                  onChange={(e) => setFormData({ ...formData, confirmedAttendance: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 mt-0.5"
                />
                <span>I confirm that I will be available to attend the matches in Delhi as per tournament schedule.</span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-red to-red-700 hover:from-red-700 hover:to-brand-red text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-red/30 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Checking Slots & Submitting...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm Registration & Join Team</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
