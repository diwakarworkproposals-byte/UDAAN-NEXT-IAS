import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Download, Search, Filter, Phone, MessageSquare, ArrowRightLeft, Check, AlertCircle, RefreshCw, X, Shield, Users } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ isOpen, onClose, teams, reservePool, onDataChanged }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
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
        setLoginError('Incorrect PIN. Default is NEXTIAS2026');
      }
    } catch (err) {
      setLoginError('Authentication failed. Default PIN is NEXTIAS2026');
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
                100% Student Contact Directory • Attendance Tracker • Dynamic Squad Re-balancing
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
                placeholder="Organizer PIN (e.g. NEXTIAS2026)"
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
                Default PIN: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">NEXTIAS2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 bg-slate-50">
            
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

          </div>
        )}

      </div>
    </div>
  );
}
