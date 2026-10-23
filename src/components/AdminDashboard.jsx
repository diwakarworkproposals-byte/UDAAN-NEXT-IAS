import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Download, Search, Filter, Phone, MessageSquare, ArrowRightLeft, Check, AlertCircle, RefreshCw, X, Shield, Users, Trophy, Award, Sparkles, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ isOpen, onClose, teams, reservePool, onDataChanged }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminTab, setAdminTab] = useState('candidates'); // 'candidates' | 'fixtures'
  const [matchForms, setMatchForms] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedAttendanceFilter, setSelectedAttendanceFilter] = useState('ALL');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Check saved session
  useEffect(() => {
    const savedPin = sessionStorage.getItem('next_ias_organizer_pin');
    if (savedPin) {
      setPin(savedPin);
      loadAdminData(savedPin);
    }
  }, []);

  // Sync match forms with fixtures whenever adminData changes
  useEffect(() => {
    if (adminData && adminData.fixtures) {
      const forms = {};
      adminData.fixtures.forEach(m => {
        forms[m.id] = {
          status: m.status || 'Upcoming',
          winnerTeamId: m.winnerTeamId || '',
          team1Score: m.scores?.team1 || '',
          team2Score: m.scores?.team2 || '',
          summary: m.summary || ''
        };
      });
      setMatchForms(forms);
    }
  }, [adminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const isValid = await api.adminLogin(pin);
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem('next_ias_organizer_pin', pin);
        await loadAdminData(pin);
      } else {
        setLoginError('Incorrect PIN. Access restricted to tournament organizers.');
      }
    } catch (err) {
      setLoginError('Authentication failed. Please verify your PIN.');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async (activePin) => {
    setLoading(true);
    try {
      const data = await api.getAdminData(activePin);
      setAdminData(data);
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError('Failed to load organizer data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMatchField = (matchId, field, value) => {
    setMatchForms(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveMatch = async (matchId) => {
    const form = matchForms[matchId];
    if (!form) return;

    try {
      setLoading(true);
      await api.updateMatch(pin, {
        matchId,
        status: form.status,
        winnerTeamId: form.winnerTeamId || null,
        scores: {
          team1: form.team1Score,
          team2: form.team2Score
        },
        summary: form.summary
      });

      setActionSuccessMessage('Match result updated & next fixtures auto-generated!');
      setTimeout(() => setActionSuccessMessage(''), 4000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error updating match: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAllFixtures = async () => {
    if (!window.confirm('Reset all tournament matches back to the initial knockout schedule?')) return;
    try {
      setLoading(true);
      await api.resetFixtures(pin);
      setActionSuccessMessage('All fixtures have been reset to initial tournament draw.');
      setTimeout(() => setActionSuccessMessage(''), 4000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error resetting fixtures: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlayer = async (playerId, targetTeamId, attendance) => {
    try {
      await api.updatePlayer(pin, { playerId, targetTeamId, attendance });
      setActionSuccessMessage('Player updated successfully');
      setTimeout(() => setActionSuccessMessage(''), 3000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error updating player: ' + err.message);
    }
  };

  const handleExportCsv = () => {
    // Generate CSV string
    if (!adminData) return;
    const rows = [
      ['Player ID', 'Name', 'Roll/Batch', 'Mobile Number', 'WhatsApp Number', 'Role', 'Wicketkeeper?', 'Batting Style', 'Bowling Style', 'Assigned Team', 'Attendance', 'Registered At']
    ];

    (adminData.teams || []).forEach(t => {
      (t.players || []).forEach(p => {
        rows.push([
          p.id,
          `"${p.name}"`,
          `"${p.rollNo || ''}"`,
          `"${p.mobile || ''}"`,
          `"${p.whatsapp || ''}"`,
          p.role,
          p.isWicketKeeper ? 'Yes' : 'No',
          p.battingStyle || '',
          p.bowlingStyle || '',
          `"${t.name}"`,
          p.attendance || 'Pending',
          p.registeredAt || ''
        ]);
      });
    });

    (adminData.reservePool || []).forEach(p => {
      rows.push([
        p.id,
        `"${p.name}"`,
        `"${p.rollNo || ''}"`,
        `"${p.mobile || ''}"`,
        `"${p.whatsapp || ''}"`,
        p.role,
        p.isWicketKeeper ? 'Yes' : 'No',
        p.battingStyle || '',
        p.bowlingStyle || '',
        'Central Reserve Pool',
        p.attendance || 'Pending',
        p.registeredAt || ''
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NEXT_IAS_Cricket_Tournament_2026_Official_Rosters.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('next_ias_organizer_pin');
    setIsAuthenticated(false);
    setAdminData(null);
    setPin('');
  };

  if (!isOpen) return null;

  // Flatten all players for the organizer directory
  let allPlayers = [];
  if (adminData) {
    (adminData.teams || []).forEach(t => {
      (t.players || []).forEach(p => {
        allPlayers.push({ ...p, teamName: t.name, currentTeamId: t.id });
      });
    });
    (adminData.reservePool || []).forEach(p => {
      allPlayers.push({ ...p, teamName: 'Central Reserve Pool', currentTeamId: 'reserve' });
    });
  }

  // Filter logic
  const filteredPlayers = allPlayers.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.rollNo && p.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.mobile && p.mobile.includes(searchQuery)) ||
      (p.teamName && p.teamName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTeam = selectedTeamFilter === 'ALL' || p.currentTeamId === selectedTeamFilter;
    const matchesRole = selectedRoleFilter === 'ALL' || p.role === selectedRoleFilter;
    const matchesAttendance = selectedAttendanceFilter === 'ALL' || p.attendance === selectedAttendanceFilter;

    return matchesSearch && matchesTeam && matchesRole && matchesAttendance;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy-dark text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-heading">
                  Organizer & Captain Command Center
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Confidential Mode
                </span>
              </div>
              <p className="text-xs text-slate-300">
                NEXT IAS Umang 2026 (Sports &amp; Inspiration Meet) • 100% Student Contact Directory • Attendance Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              >
                Lock Portal
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!isAuthenticated ? (
          /* PIN Login Prompt */
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center">
            <div className="w-14 h-14 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black font-heading text-slate-900">Enter Organizer PIN</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              This area contains confidential student mobile numbers and team balance controls. Restricted to the 10 Captains & Organizers.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter Organizer PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
              />

              {loginError && (
                <p className="text-xs text-rose-600 font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition shadow-md"
              >
                {loading ? 'Authenticating...' : 'Unlock Organizer Dashboard'}
              </button>

              <p className="text-[11px] text-slate-400 mt-3">
                Authorized access only • NEXT IAS Sports Committee
              </p>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 bg-slate-50">

            {/* Notification Banner */}
            {actionSuccessMessage && (
              <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Sub-Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setAdminTab('candidates')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    adminTab === 'candidates'
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Candidate Directory & Attendance</span>
                </button>

                <button
                  onClick={() => setAdminTab('fixtures')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    adminTab === 'fixtures'
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Knockout Fixtures & Results</span>
                </button>
              </div>

              {adminTab === 'fixtures' && (
                <button
                  onClick={handleResetAllFixtures}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                  title="Reset all matches back to initial state"
                >
                  Reset All Fixtures
                </button>
              )}
            </div>

            {adminTab === 'candidates' ? (
              <>
            {/* Top Toolbar: Search, Filters & Export */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, roll no, mobile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>

                {/* Export & Refresh Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => loadAdminData(pin)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Roster (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Filters:</span>
                
                {/* Team Filter */}
                <select
                  value={selectedTeamFilter}
                  onChange={(e) => setSelectedTeamFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="ALL">All Teams & Reserve ({allPlayers.length})</option>
                  {(adminData?.teams || []).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({(t.players || []).length}/13)</option>
                  ))}
                  <option value="reserve">Central Reserve Pool ({(adminData?.reservePool || []).length})</option>
                </select>

                {/* Role Filter */}
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="ALL">All Roles</option>
                  <option value="batsman">Batsmen</option>
                  <option value="allRounder">All-Rounders</option>
                  <option value="bowler">Bowlers</option>
                </select>

                {/* Attendance Filter */}
                <select
                  value={selectedAttendanceFilter}
                  onChange={(e) => setSelectedAttendanceFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="ALL">All Attendance</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Absent">Absent</option>
                </select>

                {actionSuccessMessage && (
                  <span className="ml-auto text-emerald-600 font-bold text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {actionSuccessMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Players Table */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4">Player Details</th>
                      <th className="py-3 px-3">Role & Style</th>
                      <th className="py-3 px-3">Contact (Confidential)</th>
                      <th className="py-3 px-3">Current Team</th>
                      <th className="py-3 px-3">Attendance</th>
                      <th className="py-3 px-4 text-right">Reassign Team</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPlayers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                          No players match the chosen filters.
                        </td>
                      </tr>
                    ) : (
                      filteredPlayers.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          
                          {/* Name & Roll */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.isCaptain && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-extrabold">
                                  Captain
                                </span>
                              )}
                              {p.isWicketKeeper && (
                                <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-extrabold">
                                  🧤 WK
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Roll: {p.rollNo || 'N/A'}
                            </div>
                          </td>

                          {/* Role & Style */}
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800 capitalize">
                              {p.role === 'allRounder' ? '⚡ All-Rounder' : p.role === 'batsman' ? '🏏 Batsman' : '🎯 Bowler'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {p.battingStyle || 'RHB'} • {p.bowlingStyle || 'Bowler'}
                            </div>
                          </td>

                          {/* Confidential Contact Info (Organizer Access) */}
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-slate-800 text-xs">
                              {p.mobile || 'No Mobile'}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${p.mobile}`}
                                className="inline-flex items-center gap-1 text-[10px] text-sky-700 hover:text-sky-900 font-semibold"
                                title="Call player"
                              >
                                <Phone className="w-3 h-3" /> Call
                              </a>
                              {p.whatsapp && (
                                <a
                                  href={`https://wa.me/91${p.whatsapp.replace(/\D/g,'')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold"
                                  title="Open WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" /> WhatsApp
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Assigned Team */}
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              p.currentTeamId === 'reserve' 
                                ? 'bg-sky-100 text-sky-800' 
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {p.teamName}
                            </span>
                          </td>

                          {/* Attendance Status */}
                          <td className="py-3 px-3">
                            <select
                              value={p.attendance || 'Confirmed'}
                              onChange={(e) => handleUpdatePlayer(p.id, p.currentTeamId, e.target.value)}
                              className={`text-[11px] font-bold rounded-lg px-2 py-1 border outline-none ${
                                p.attendance === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : p.attendance === 'Absent'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Confirmed">Confirmed ✅</option>
                              <option value="Pending">Pending ⏳</option>
                              <option value="Absent">Absent ❌</option>
                            </select>
                          </td>

                          {/* Move Team / Rebalance */}
                          <td className="py-3 px-4 text-right">
                            <select
                              value={p.currentTeamId}
                              onChange={(e) => handleUpdatePlayer(p.id, e.target.value, p.attendance)}
                              className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none hover:border-brand-navy"
                            >
                              <optgroup label="8 Official Teams (13 Slots Each)">
                                {(adminData?.teams || []).map(t => (
                                  <option key={t.id} value={t.id}>
                                    Move to {t.shortName} ({(t.players || []).length}/13)
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Standby">
                                <option value="reserve">Move to Central Reserve Pool</option>
                              </optgroup>
                            </select>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </>
          ) : (
            /* Fixtures Management Section */
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              
              {/* Notice Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5 shadow-sm">
                  ⚡
                </div>
                <div className="text-xs">
                  <h4 className="font-extrabold text-amber-950">Auto-Generating Knockout Match Engine</h4>
                  <p className="text-amber-800 mt-0.5">
                    Select the winning team for any completed match and click <strong>"Save & Advance Match"</strong>. The winning team will automatically advance to the Semi-Finals and Grand Finale!
                  </p>
                </div>
              </div>

              {/* Match Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {(adminData?.fixtures || []).map((match) => {
                  const form = matchForms[match.id] || {
                    status: match.status || 'Upcoming',
                    winnerTeamId: match.winnerTeamId || '',
                    team1Score: match.scores?.team1 || '',
                    team2Score: match.scores?.team2 || '',
                    summary: match.summary || ''
                  };

                  return (
                    <div
                      key={match.id}
                      className={`bg-white rounded-3xl border shadow-sm p-5 space-y-4 transition ${
                        form.status === 'Ongoing'
                          ? 'border-rose-400 ring-2 ring-rose-200'
                          : form.status === 'Completed'
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Match Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-black">
                            Match {match.matchNumber}
                          </span>
                          <span className="font-heading font-black text-sm text-slate-900">
                            {match.round}
                          </span>
                        </div>

                        {/* Status Selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-500">Status:</span>
                          <select
                            value={form.status}
                            onChange={(e) => handleUpdateMatchField(match.id, 'status', e.target.value)}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none ${
                              form.status === 'Ongoing'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : form.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="Upcoming">⏳ Upcoming</option>
                            <option value="Ongoing">🔴 LIVE Ongoing</option>
                            <option value="Completed">✅ Completed</option>
                          </select>
                        </div>
                      </div>

                      {/* Teams & Scores */}
                      <div className="space-y-2.5">
                        
                        {/* Team 1 */}
                        <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                          form.winnerTeamId === match.team1Id && match.team1Id
                            ? 'bg-amber-100/80 border-amber-400 ring-1 ring-amber-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Team 1</span>
                            <span className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate block">
                              {match.team1Name || 'TBD (Winner QF)'}
                            </span>
                          </div>

                          <div className="w-32">
                            <input
                              type="text"
                              placeholder="Score (e.g. 142/6)"
                              value={form.team1Score}
                              onChange={(e) => handleUpdateMatchField(match.id, 'team1Score', e.target.value)}
                              className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-brand-navy outline-none"
                            />
                          </div>
                        </div>

                        {/* Team 2 */}
                        <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                          form.winnerTeamId === match.team2Id && match.team2Id
                            ? 'bg-amber-100/80 border-amber-400 ring-1 ring-amber-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Team 2</span>
                            <span className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate block">
                              {match.team2Name || 'TBD (Winner QF)'}
                            </span>
                          </div>

                          <div className="w-32">
                            <input
                              type="text"
                              placeholder="Score (e.g. 138/8)"
                              value={form.team2Score}
                              onChange={(e) => handleUpdateMatchField(match.id, 'team2Score', e.target.value)}
                              className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-brand-navy outline-none"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Winner Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Mark Winning Team (Auto-Advances):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={!match.team1Id}
                            onClick={() => handleUpdateMatchField(match.id, 'winnerTeamId', match.team1Id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition truncate border ${
                              form.winnerTeamId === match.team1Id && match.team1Id
                                ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-300 font-black'
                                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                            }`}
                          >
                            👑 {match.team1Name ? `${match.team1Name} Won` : 'Team 1 Won'}
                          </button>

                          <button
                            type="button"
                            disabled={!match.team2Id}
                            onClick={() => handleUpdateMatchField(match.id, 'winnerTeamId', match.team2Id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition truncate border ${
                              form.winnerTeamId === match.team2Id && match.team2Id
                                ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-300 font-black'
                                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                            }`}
                          >
                            👑 {match.team2Name ? `${match.team2Name} Won` : 'Team 2 Won'}
                          </button>
                        </div>

                        {form.winnerTeamId && (
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => handleUpdateMatchField(match.id, 'winnerTeamId', '')}
                              className="text-[11px] text-rose-600 hover:underline font-semibold"
                            >
                              Clear Winner Selection
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Match Summary Notes */}
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Match Result Notes:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Won by 6 runs (DLS method) or won by 4 wickets"
                          value={form.summary}
                          onChange={(e) => handleUpdateMatchField(match.id, 'summary', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-brand-navy outline-none"
                        />
                      </div>

                      {/* Advancement & Save Button */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {match.nextMatchId ? (
                            <span>➡️ Winner automatically advances to Match {match.nextMatchId.replace('m-', '')}</span>
                          ) : (
                            <span>🏆 Winner crowned Tournament Champion!</span>
                          )}
                        </span>

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleSaveMatch(match.id)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-black shadow-sm transition"
                        >
                          💾 Save & Advance Match
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          </div>
        )}

      </div>
    </div>
  );
}
