import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Trophy, Sparkles, User, Lock, Shield, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegistrationModal({
  isOpen,
  onClose,
  teams,
  preselectedTeamId,
  reservePoolCount = 0,
  onRegistered
}) {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    role: 'allRounder',
    isWicketKeeper: false,
    battingStyle: 'Right Hand',
    bowlingStyle: 'Right-arm Fast Medium',
    preferredTeamId: preselectedTeamId || (teams[0] ? teams[0].id : 'team-1'),
    availability: 'Surely Join', // 'Surely Join' | 'Not Sure'
    extraDestination: 'team', // 'team' (Stay as Extra in team) | 'reserve' (Join Central Reserve Pool)
    joinReserveIfFull: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  if (!isOpen) return null;

  const isReserveFull = reservePoolCount >= 4;

  // Selected team object
  const selectedTeam = teams.find(t => t.id === formData.preferredTeamId);
  const stats = selectedTeam ? selectedTeam.stats : null;

  // Check if role is full in selected team
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

    if (!formData.rollNo.trim()) {
      setError('Please enter your Roll Number / Batch ID.');
      return;
    }

    if (formData.preferredTeamId === 'reserve' && isReserveFull) {
      setError('The Central Reserve Pool is currently full (4/4 students). Please choose an official team.');
      return;
    }

    if (formData.availability === 'Not Sure' && formData.extraDestination === 'reserve' && isReserveFull) {
      setError('The Central Reserve Pool is currently full (4/4 students). You will be enrolled as an Extra in your selected team.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        isExtra: formData.availability === 'Not Sure',
        targetDestination: formData.availability === 'Not Sure' && formData.extraDestination === 'reserve' ? 'reserve' : formData.preferredTeamId
      };

      const result = await onRegistered(payload);
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
            <span>NEXT IAS Umang 2026 • Cricket League</span>
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight">
            Player Registration &amp; Team Allocation
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sports &amp; Inspiration Meet • Select your preferred team, playing role, and match day availability.
          </p>
        </div>

        {/* Content */}
        {successResult ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-heading">
              Registration Successful!
            </h3>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              {successResult.message || `You have been allocated a spot in ${successResult.assignedTo}!`}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Player Name:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  {formData.isWicketKeeper && <span>🧤</span>}
                  <span>{formData.name}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll / Batch:</span>
                <span className="font-bold text-slate-800">{formData.rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Role:</span>
                <span className="font-bold uppercase text-brand-red">{formData.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wicketkeeper Ability:</span>
                <span className="font-bold text-slate-800">{formData.isWicketKeeper ? 'Yes (🧤 Logo Added)' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Availability & Squad Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  formData.availability === 'Surely Join'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {formData.availability === 'Surely Join' ? 'Playing 11 Eligible ✅' : 'EXTRA / Bench Substitute ⚠️'}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Allocated Team:</span>
                <span className="font-bold text-brand-navy">{successResult.assignedTo || 'Assigned'}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition shadow-sm"
              >
                Done & View Roster
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

            {/* Section 1: Candidate Identification (Name & Roll Number) */}
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
                  Roll No / Student ID / Batch *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GS-2026-042 or Foundation"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
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
              
              {/* Wicketkeeper Ability Checkbox with Glove Logo */}
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
                    <span className="text-base">🧤</span>
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

            {/* Section 3: Match Day Availability Dropdown */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-amber-950 mb-1 flex items-center gap-1.5">
                  <span>📅</span>
                  <span>Match Day Attendance & Availability *</span>
                </label>
                <p className="text-[11px] text-amber-800 mb-2">
                  Please specify your attendance confirmation for tournament match days:
                </p>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Surely Join">✅ Surely Join (Eligible for Playing 11)</option>
                  <option value="Not Sure">⚠️ Not Sure (Will be placed as EXTRA / Standby)</option>
                </select>
              </div>

              {/* Conditional Options when "Not Sure" is Selected */}
              {formData.availability === 'Not Sure' && (
                <div className="p-3 bg-white rounded-xl border border-amber-300/80 space-y-2 animate-in fade-in duration-200">
                  <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Since you selected "Not Sure", choose your placement:</span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    {/* Option A: Extra in selected team */}
                    <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                      <input
                        type="radio"
                        name="extraDestination"
                        value="team"
                        checked={formData.extraDestination === 'team'}
                        onChange={() => setFormData({ ...formData, extraDestination: 'team' })}
                        className="mt-0.5 text-brand-red focus:ring-brand-red"
                      />
                      <div>
                        <span className="font-bold text-slate-900">
                          Be an EXTRA in {selectedTeam ? selectedTeam.name : 'Selected Team'}
                        </span>
                        <p className="text-[10px] text-slate-500">
                          Your name will appear with an <strong className="text-amber-800">[EXTRA]</strong> tag on this team's roster, available as an impact substitute.
                        </p>
                      </div>
                    </label>

                    {/* Option B: Central Reserve Pool (Locked if full) */}
                    <label className={`flex items-start gap-2 p-2 rounded-lg border transition ${
                      isReserveFull 
                        ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed' 
                        : 'cursor-pointer border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="extraDestination"
                        value="reserve"
                        disabled={isReserveFull}
                        checked={formData.extraDestination === 'reserve'}
                        onChange={() => setFormData({ ...formData, extraDestination: 'reserve' })}
                        className="mt-0.5 text-brand-red focus:ring-brand-red"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            Join Central Reserve Pool
                          </span>
                          {isReserveFull ? (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded border border-rose-200 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Full (4/4) Locked
                            </span>
                          ) : (
                            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                              {reservePoolCount}/4 Slots Taken
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {isReserveFull
                            ? 'The central pool has reached its 4-student limit. Please choose to be an Extra in a team.'
                            : 'Stay in the 4-student central reserve pool to be drafted for any team if needed.'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Preferred Team Selection */}
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
                <option value="reserve" disabled={isReserveFull}>
                  {isReserveFull ? '🔒 Central Reserve Pool (LOCKED - 4/4 Full)' : `★ Central Reserve Pool (${reservePoolCount}/4 Slots Open)`}
                </option>
              </select>

              {/* Warning if role is full in selected team */}
              {isRoleFullInSelectedTeam && formData.preferredTeamId !== 'reserve' && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Role Slot Filled:</strong> All {formData.role} slots in {selectedTeam ? selectedTeam.name : 'this team'} are currently full!
                    <br />
                    You can either choose a different team above, or register as an <strong>Extra</strong> or join the Reserve Pool.
                  </div>
                </div>
              )}
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
