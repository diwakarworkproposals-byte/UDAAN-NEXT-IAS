import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, Download, Search, Filter, Phone, MessageSquare, ArrowRightLeft, 
  Check, AlertCircle, RefreshCw, X, Shield, Users, Trophy, Award, Sparkles, 
  Clock, Calendar, CheckCircle2, Globe, Database, Cloud, Wifi, ExternalLink, 
  FileCode, CheckCircle, Server, Info
} from 'lucide-react';
import { api, getActiveCloudConfig, saveActiveCloudConfig, INITIAL_FALLBACK_DATA } from '../services/api';

export default function AdminDashboard({ isOpen, onClose, teams, reservePool, onDataChanged }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminTab, setAdminTab] = useState('candidates'); // 'candidates' | 'fixtures' | 'cloud_sync'
  const [matchForms, setMatchForms] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedAttendanceFilter, setSelectedAttendanceFilter] = useState('ALL');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Cloud Sync State
  const [cloudConfig, setCloudConfig] = useState(() => getActiveCloudConfig());
  const [cloudUrlInput, setCloudUrlInput] = useState('');
  const [cloudTypeInput, setCloudTypeInput] = useState('firebase');
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [isSeedingCloud, setIsSeedingCloud] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Check saved session
  useEffect(() => {
    const savedPin = sessionStorage.getItem('next_ias_organizer_pin');
    if (savedPin) {
      setPin(savedPin);
      loadAdminData(savedPin);
    }
  }, []);

  // Update cloud config inputs when config changes
  useEffect(() => {
    const conf = getActiveCloudConfig();
    setCloudConfig(conf);
    setCloudUrlInput(conf.url || '');
    setCloudTypeInput(conf.type === 'custom_api' ? 'custom_api' : 'firebase');
  }, [isOpen]);

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

      setActionSuccessMessage(`Match ${matchId.replace('m-', '')} results saved and knockout brackets advanced!`);
      setTimeout(() => setActionSuccessMessage(''), 4000);

      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(`Error updating match: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAllFixtures = async () => {
    if (!window.confirm("Are you sure you want to reset all knockout match fixtures back to initial tournament state? All entered scores will be cleared.")) {
      return;
    }

    try {
      setLoading(true);
      await api.resetFixtures(pin);
      setActionSuccessMessage('All fixtures successfully reset to initial schedule!');
      setTimeout(() => setActionSuccessMessage(''), 4000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(`Error resetting fixtures: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferPlayer = async (playerId, targetTeamId) => {
    try {
      setLoading(true);
      await api.updatePlayer(pin, {
        playerId,
        targetTeamId
      });
      setActionSuccessMessage('Player squad assignment successfully updated!');
      setTimeout(() => setActionSuccessMessage(''), 3000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(`Transfer failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async (playerId, attendance) => {
    try {
      setLoading(true);
      await api.updatePlayer(pin, {
        playerId,
        attendance
      });
      setActionSuccessMessage(`Attendance status set to "${attendance}"`);
      setTimeout(() => setActionSuccessMessage(''), 3000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (playerId, role, isWicketKeeper) => {
    try {
      setLoading(true);
      await api.updatePlayer(pin, {
        playerId,
        role,
        isWicketKeeper
      });
      setActionSuccessMessage('Player role successfully updated!');
      setTimeout(() => setActionSuccessMessage(''), 3000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!adminData) return;

    const rows = [
      ['Player ID', 'Name', 'Roll Number', 'Mobile', 'WhatsApp', 'Role', 'Wicket Keeper', 'Batting Style', 'Bowling Style', 'Assigned Team', 'Attendance', 'Registration Time']
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

  const handleDownloadTournamentJson = () => {
    if (!adminData) return;
    const jsonStr = JSON.stringify(adminData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tournament_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActionSuccessMessage('Downloaded latest tournament_data.json! You can commit this file to your GitHub repository.');
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  // Cloud Database Handlers
  const handleTestAndSaveCloud = async () => {
    setIsTestingCloud(true);
    setTestResult(null);

    try {
      const res = await api.testCloudConnection(cloudUrlInput, cloudTypeInput);
      setTestResult(res);

      if (res.ok) {
        saveActiveCloudConfig(cloudUrlInput, cloudTypeInput);
        setCloudConfig(getActiveCloudConfig());
        setActionSuccessMessage('Cloud Database connected and activated globally across all devices!');
        setTimeout(() => setActionSuccessMessage(''), 5000);
        await loadAdminData(pin);
        if (onDataChanged) onDataChanged();
      }
    } catch (err) {
      setTestResult({ ok: false, error: err.message });
    } finally {
      setIsTestingCloud(false);
    }
  };

  const handleSeedCloudBaseline = async () => {
    if (!cloudUrlInput.trim()) {
      alert("Please enter a Cloud Database URL first.");
      return;
    }

    if (!window.confirm("Initialize Cloud Database with official baseline rosters (8 captains, empty squads, and 7 knockout fixtures)?")) {
      return;
    }

    setIsSeedingCloud(true);
    try {
      await api.seedCloudDatabase(cloudUrlInput, cloudTypeInput);
      saveActiveCloudConfig(cloudUrlInput, cloudTypeInput);
      setCloudConfig(getActiveCloudConfig());
      setTestResult({ ok: true, message: 'Official tournament baseline initialized in Cloud DB successfully!' });
      setActionSuccessMessage('Cloud Database initialized with official NEXT IAS baseline rosters!');
      setTimeout(() => setActionSuccessMessage(''), 5000);
      await loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(`Error initializing database: ${err.message}`);
    } finally {
      setIsSeedingCloud(false);
    }
  };

  const handleDisconnectCloud = () => {
    if (window.confirm("Disconnect Cloud Database and revert to local storage?")) {
      saveActiveCloudConfig('', 'none');
      setCloudConfig(getActiveCloudConfig());
      setCloudUrlInput('');
      setTestResult(null);
      setActionSuccessMessage('Cloud Database disconnected. Switched to local device storage.');
      setTimeout(() => setActionSuccessMessage(''), 4000);
      loadAdminData(pin);
      if (onDataChanged) onDataChanged();
    }
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
    const matchesRole = selectedRoleFilter === 'ALL' ||
      (selectedRoleFilter === 'allRounder' ? (p.role === 'allRounder' || p.role === 'battingAllRounder' || p.role === 'bowlingAllRounder') : p.role === selectedRoleFilter);
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
                  Organizer &amp; Captain Command Center
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
              This area contains confidential student mobile numbers and team balance controls. Restricted to the 10 Captains &amp; Organizers.
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
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setAdminTab('candidates')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
                    adminTab === 'candidates'
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Candidate Directory &amp; Attendance</span>
                </button>

                <button
                  onClick={() => setAdminTab('fixtures')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
                    adminTab === 'fixtures'
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Knockout Fixtures &amp; Results</span>
                </button>

                <button
                  onClick={() => setAdminTab('cloud_sync')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
                    adminTab === 'cloud_sync'
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Global Cloud DB &amp; Multi-Device Sync</span>
                  {cloudConfig.isConfigured ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected to Cloud DB"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400" title="Local Storage Mode"></span>
                  )}
                </button>
              </div>

              {adminTab === 'fixtures' && (
                <button
                  onClick={handleResetAllFixtures}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex-shrink-0"
                  title="Reset all matches back to initial state"
                >
                  Reset All Fixtures
                </button>
              )}
            </div>

            {/* TAB 1: CANDIDATES */}
            {adminTab === 'candidates' && (
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
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-red outline-none"
                      />
                    </div>

                    {/* Export Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        title="Export all student details with contact numbers to CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        onClick={handleDownloadTournamentJson}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        title="Download JSON snapshot to update data/tournament_data.json in GitHub repo"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Export JSON</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Filters:
                    </span>

                    {/* Team Filter */}
                    <select
                      value={selectedTeamFilter}
                      onChange={(e) => setSelectedTeamFilter(e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 font-medium outline-none text-xs"
                    >
                      <option value="ALL">All Teams &amp; Pools ({allPlayers.length})</option>
                      {(adminData?.teams || []).map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.players?.length || 0})</option>
                      ))}
                      <option value="reserve">Central Reserve Pool ({adminData?.reservePool?.length || 0})</option>
                    </select>

                    {/* Role Filter */}
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 font-medium outline-none text-xs"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="batsman">Batsman</option>
                      <option value="allRounder">All-Rounder</option>
                      <option value="bowler">Bowler</option>
                    </select>

                    {/* Attendance Filter */}
                    <select
                      value={selectedAttendanceFilter}
                      onChange={(e) => setSelectedAttendanceFilter(e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 font-medium outline-none text-xs"
                    >
                      <option value="ALL">All Availability</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Not Sure">Not Sure (Extra)</option>
                      <option value="Pending">Pending</option>
                      <option value="Declined">Declined</option>
                    </select>

                    {(selectedTeamFilter !== 'ALL' || selectedRoleFilter !== 'ALL' || selectedAttendanceFilter !== 'ALL' || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedTeamFilter('ALL');
                          setSelectedRoleFilter('ALL');
                          setSelectedAttendanceFilter('ALL');
                          setSearchQuery('');
                        }}
                        className="text-rose-600 hover:underline text-[11px] font-semibold ml-auto"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Directory Table */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold sticky top-0 z-10">
                        <tr>
                          <th className="p-3">Candidate &amp; Roll No</th>
                          <th className="p-3">Assigned Squad</th>
                          <th className="p-3">Player Role</th>
                          <th className="p-3">Availability / Attendance</th>
                          <th className="p-3">Confidential Contact</th>
                          <th className="p-3 text-right">Squad Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPlayers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-400">
                              No candidates matched the selected filters.
                            </td>
                          </tr>
                        ) : (
                          filteredPlayers.map(player => (
                            <tr key={player.id} className="hover:bg-slate-50 transition">
                              <td className="p-3">
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{player.name}</span>
                                  {player.isCaptain && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                                      Captain
                                    </span>
                                  )}
                                  {player.isExtra && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-extrabold uppercase">
                                      EXTRA
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {player.rollNo || 'Roll No: N/A'}
                                </div>
                              </td>

                              <td className="p-3">
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                  player.currentTeamId === 'reserve'
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-slate-100 text-slate-800'
                                }`}>
                                  {player.teamName}
                                </span>
                              </td>

                              <td className="p-3">
                                <div className="font-semibold text-slate-800 capitalize">
                                  {player.role === 'allRounder' ? '⚡ All-Rounder' :
                                   player.role === 'battingAllRounder' ? '⚡ Batting All-Rounder' :
                                   player.role === 'bowlingAllRounder' ? '⚡ Bowling All-Rounder' :
                                   player.role === 'batsman' ? '🏏 Batsman' : '🎯 Bowler'}
                                  {player.isWicketKeeper && ' • 🧤 WK'}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {player.battingStyle || 'Right Hand'} • {player.bowlingStyle || 'None'}
                                </div>
                              </td>

                              <td className="p-3">
                                <select
                                  value={player.attendance || 'Pending'}
                                  onChange={(e) => handleUpdateAttendance(player.id, e.target.value)}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none ${
                                    player.attendance === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                    player.attendance === 'Not Sure' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                                    player.attendance === 'Declined' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                                    'bg-slate-50 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  <option value="Confirmed">✓ Confirmed</option>
                                  <option value="Not Sure">⚠️ Not Sure (Extra)</option>
                                  <option value="Pending">⏳ Pending</option>
                                  <option value="Declined">✕ Declined</option>
                                </select>
                              </td>

                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-slate-800 font-medium">
                                    {player.mobile || 'Confidential / On File'}
                                  </span>
                                  {player.mobile && (
                                    <a
                                      href={`https://wa.me/91${player.mobile.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                                      title="Open WhatsApp chat with candidate"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </td>

                              <td className="p-3 text-right">
                                <select
                                  value={player.currentTeamId}
                                  onChange={(e) => handleTransferPlayer(player.id, e.target.value)}
                                  disabled={player.isCaptain}
                                  className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold outline-none disabled:opacity-50"
                                >
                                  <option disabled value="">Move Squad...</option>
                                  {(adminData?.teams || []).map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                  ))}
                                  <option value="reserve">Central Reserve Pool</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Showing {filteredPlayers.length} of {allPlayers.length} total participants</span>
                    <span>10-Player Squad Limit per team • 4 Central Reserve Pool Max</span>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: FIXTURES */}
            {adminTab === 'fixtures' && (
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Knockout Progression Engine: </span>
                    Mark the winning team for any completed match. Winners will be automatically placed into the next Semi-Final and Grand Finale slots across all candidate &amp; public screens!
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(adminData?.fixtures || []).map(match => {
                    const form = matchForms[match.id] || {};
                    return (
                      <div key={match.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-black uppercase text-brand-red tracking-wider">
                            Match {match.matchNumber}: {match.round}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                            {match.venue}
                          </span>
                        </div>

                        {/* Match Status Selector */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Status:</span>
                          <select
                            value={form.status}
                            onChange={(e) => handleUpdateMatchField(match.id, 'status', e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-300 font-semibold outline-none text-xs"
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Live">🔴 Live / In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        {/* Team 1 Score & Winner Toggle */}
                        <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-slate-900 truncate">
                              {match.team1Name || 'TBD (Winner QF)'}
                            </span>
                            <input
                              type="text"
                              placeholder="Score (e.g., 94/3 (10 ov))"
                              value={form.team1Score}
                              onChange={(e) => handleUpdateMatchField(match.id, 'team1Score', e.target.value)}
                              className="w-36 text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-brand-navy outline-none"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-slate-900 truncate">
                              {match.team2Name || 'TBD (Winner QF)'}
                            </span>
                            <input
                              type="text"
                              placeholder="Score (e.g., 88/6 (10 ov))"
                              value={form.team2Score}
                              onChange={(e) => handleUpdateMatchField(match.id, 'team2Score', e.target.value)}
                              className="w-36 text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-brand-navy outline-none"
                            />
                          </div>
                        </div>

                        {/* Winner Selection */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Mark Winner (Advances to next bracket):
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={!match.team1Id}
                              onClick={() => handleUpdateMatchField(match.id, 'winnerTeamId', match.team1Id)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold transition border truncate ${
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
                              className={`py-2 px-3 rounded-xl text-xs font-bold transition border truncate ${
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
                            placeholder="e.g., Won by 6 runs or won by 4 wickets"
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
                            💾 Save &amp; Advance Match
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: GLOBAL CLOUD DATABASE & MULTI-DEVICE SYNC */}
            {adminTab === 'cloud_sync' && (
              <div className="flex-1 overflow-y-auto space-y-6">

                {/* Status Indicator Card */}
                <div className={`p-5 rounded-2xl border ${
                  cloudConfig.isConfigured
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                        cloudConfig.isConfigured ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {cloudConfig.isConfigured ? <Cloud className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-heading">
                            {cloudConfig.isConfigured
                              ? '🟢 Global Cloud Database Active (Multi-Device Sync LIVE)'
                              : '🟡 Local Storage Mode (Single Device Only)'}
                          </h3>
                        </div>
                        <p className="text-xs mt-1 leading-relaxed">
                          {cloudConfig.isConfigured
                            ? 'All participant form registrations, squad selections, attendance, and match results are instantly synchronized across all student mobile phones, laptops, and organizer screens worldwide.'
                            : 'GitHub Pages is a static host. Currently, registrations submitted on one phone save only to that specific browser\'s localStorage. To enable live multi-device synchronization worldwide, connect a free Cloud Database (Google Firebase Realtime DB or Render Backend API) below.'}
                        </p>
                        {cloudConfig.isConfigured && (
                          <div className="mt-3 text-[11px] font-mono bg-white/70 p-2 rounded-lg border border-emerald-200 break-all">
                            <strong>Active Database Endpoint:</strong> {cloudConfig.url} ({cloudConfig.type.toUpperCase()}) • Source: {cloudConfig.source}
                          </div>
                        )}
                      </div>
                    </div>

                    {cloudConfig.isConfigured && (
                      <button
                        onClick={handleDisconnectCloud}
                        className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex-shrink-0"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>

                {/* Database Connection Form */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-black font-heading text-slate-900">
                        Connect Cloud Database
                      </h4>
                      <p className="text-xs text-slate-500">
                        Enter your Firebase Realtime Database URL or Custom Backend URL to activate global real-time synchronization.
                      </p>
                    </div>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-full uppercase">
                      Zero Server Config
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Cloud Provider Type:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                          cloudTypeInput === 'firebase'
                            ? 'bg-amber-50/50 border-amber-400 ring-1 ring-amber-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="cloudType"
                            value="firebase"
                            checked={cloudTypeInput === 'firebase'}
                            onChange={() => setCloudTypeInput('firebase')}
                            className="text-amber-500 focus:ring-amber-400"
                          />
                          <div>
                            <div className="text-xs font-black text-slate-900">🔥 Google Firebase Realtime DB (Recommended)</div>
                            <div className="text-[11px] text-slate-500">100% Free • Zero Server Setup • Real-time across all mobile devices</div>
                          </div>
                        </label>

                        <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                          cloudTypeInput === 'custom_api'
                            ? 'bg-sky-50/50 border-sky-400 ring-1 ring-sky-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="cloudType"
                            value="custom_api"
                            checked={cloudTypeInput === 'custom_api'}
                            onChange={() => setCloudTypeInput('custom_api')}
                            className="text-sky-500 focus:ring-sky-400"
                          />
                          <div>
                            <div className="text-xs font-black text-slate-900">⚡ Custom Node Server (Render / Railway)</div>
                            <div className="text-[11px] text-slate-500">Deploys server.js to free cloud host (e.g. onrender.com)</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Database Endpoint URL:
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="url"
                          placeholder={
                            cloudTypeInput === 'firebase'
                              ? 'https://your-project-id-default-rtdb.firebaseio.com'
                              : 'https://your-app.onrender.com/api'
                          }
                          value={cloudUrlInput}
                          onChange={(e) => setCloudUrlInput(e.target.value)}
                          className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-navy outline-none"
                        />

                        <button
                          type="button"
                          disabled={isTestingCloud || !cloudUrlInput.trim()}
                          onClick={handleTestAndSaveCloud}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-black transition shadow-sm whitespace-nowrap disabled:opacity-50"
                        >
                          {isTestingCloud ? 'Testing...' : 'Test & Save Database'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {cloudTypeInput === 'firebase'
                          ? 'Example: https://next-ias-cricket-default-rtdb.firebaseio.com'
                          : 'Example: https://udaan-next-ias.onrender.com/api'}
                      </p>
                    </div>

                    {/* Test Result Message */}
                    {testResult && (
                      <div className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                        testResult.ok
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}>
                        {testResult.ok ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold">{testResult.ok ? 'Connection Verified!' : 'Connection Failed'}</div>
                          <div>{testResult.message || testResult.error}</div>
                        </div>
                      </div>
                    )}

                    {/* Initialize Baseline Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500">
                        Need to seed the cloud database with the official 8 captains and clean rosters?
                      </div>

                      <button
                        type="button"
                        disabled={isSeedingCloud || !cloudUrlInput.trim()}
                        onClick={handleSeedCloudBaseline}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                      >
                        {isSeedingCloud ? 'Initializing...' : '🚀 Push Clean Rosters to Cloud DB'}
                      </button>
                    </div>

                  </div>
                </div>

                {/* 90-Second Step-by-Step Setup Guide */}
                <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>How to get your free Cloud Database in 90 seconds (100% Free):</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: Firebase */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">1</span>
                        <span>Option A: Google Firebase (Recommended)</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                        <li>Visit <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">console.firebase.google.com</a> (Free Google login).</li>
                        <li>Click <strong>Add project</strong> → name it <code className="bg-slate-100 px-1 py-0.5 rounded">udaan-next-ias</code> → Create.</li>
                        <li>In the left sidebar, click <strong>Build</strong> → <strong>Realtime Database</strong> → <strong>Create Database</strong>.</li>
                        <li>Select <strong>Start in test mode</strong> (enables open read/write) → Click <strong>Enable</strong>.</li>
                        <li>Copy the database URL displayed at the top (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">https://udaan-next-ias-default-rtdb.firebaseio.com/</code>).</li>
                        <li>Paste that URL above and click <strong>Test &amp; Save Database</strong>!</li>
                      </ol>
                    </div>

                    {/* Option 2: Render */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-[10px]">2</span>
                        <span>Option B: Render.com Node Backend</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                        <li>Log in to <a href="https://render.com" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">render.com</a> with your GitHub account.</li>
                        <li>Click <strong>New +</strong> → <strong>Web Service</strong>.</li>
                        <li>Select your repository <code className="bg-slate-100 px-1 py-0.5 rounded">UDAAN-NEXT-IAS</code>.</li>
                        <li>Build Command: <code className="bg-slate-100 px-1 py-0.5 rounded">npm install</code> • Start: <code className="bg-slate-100 px-1 py-0.5 rounded">node server.js</code>.</li>
                        <li>Click <strong>Deploy Web Service</strong>.</li>
                        <li>Copy the generated HTTPS URL (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">https://udaan-next-ias.onrender.com/api</code>) and paste above.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500">
                    💡 Once connected, any candidate registering from any mobile phone or browser will immediately sync to the cloud database and be visible on every screen worldwide.
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
