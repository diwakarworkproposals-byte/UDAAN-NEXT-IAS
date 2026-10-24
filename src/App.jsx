import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBanner from './components/StatsBanner';
import TeamCard from './components/TeamCard';
import RegistrationModal from './components/RegistrationModal';
import AdminDashboard from './components/AdminDashboard';
import ReservePoolSection from './components/ReservePoolSection';
import TelegramNotice from './components/TelegramNotice';
import RulesSection from './components/RulesSection';
import FixturesSection from './components/FixturesSection';
import { api, getActiveCloudConfig, clearTournamentCache } from './services/api';
import { Search, Trophy, Shield, Users, CheckCircle, RefreshCw, AlertCircle, Sparkles, Flame, Globe } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState(() => getActiveCloudConfig());
  const [data, setData] = useState({
    tournament: {},
    teams: [],
    reservePool: [],
    fixtures: []
  });
  const [isRegisterOpen, setIsRegisterOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#register';
    }
    return false;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedTeamId, setPreselectedTeamId] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['teams', 'fixtures', 'reserve', 'telegram', 'rules'].includes(hash)) {
        return hash;
      }
    }
    return 'teams';
  });

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (typeof window !== 'undefined') {
      window.location.hash = tabName;
    }
  };

  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const fetchData = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const publicData = await api.getPublicData();
      setData(publicData);
      setCloudSyncStatus(getActiveCloudConfig());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // Clear any stale local cache on every page reload to force fresh Firebase sync
    clearTournamentCache();
    fetchData(true);

    // Auto-polling every 8 seconds so all devices see registrations in real time
    const interval = setInterval(() => {
      fetchData(false);
    }, 8000);

    // Re-fetch immediately when user switches back to the tab or phone screen unlocks
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchData(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Re-fetch whenever cloud database config is updated in Organizer Command Center
    const handleConfigChange = () => {
      setCloudSyncStatus(getActiveCloudConfig());
      fetchData(true);
    };
    window.addEventListener('next_ias_cloud_config_updated', handleConfigChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('next_ias_cloud_config_updated', handleConfigChange);
    };
  }, []);

  const handleOpenRegisterForTeam = (teamId) => {
    setPreselectedTeamId(teamId);
    setIsRegisterOpen(true);
  };

  const handleOpenGeneralRegister = () => {
    setPreselectedTeamId(null);
    setIsRegisterOpen(true);
  };

  const handleJoinReserve = () => {
    setPreselectedTeamId('reserve');
    setIsRegisterOpen(true);
  };

  const handleRegistrationSubmit = async (regData) => {
    const res = await api.register(regData);
    await fetchData(false);
    return res;
  };

  // Search player's assigned team
  const handleStudentSearch = (e) => {
    const q = e.target.value;
    setStudentSearchQuery(q);
    if (!q.trim() || q.trim().length < 2) {
      setSearchResult(null);
      return;
    }

    const lower = q.toLowerCase();
    let found = [];

    (data.teams || []).forEach(team => {
      (team.players || []).forEach(p => {
        if (p.name.toLowerCase().includes(lower) || (p.rollNo && p.rollNo.toLowerCase().includes(lower))) {
          found.push({ ...p, teamName: team.name, teamColor: team.color });
        }
      });
    });

    (data.reservePool || []).forEach(p => {
      if (p.name.toLowerCase().includes(lower) || (p.rollNo && p.rollNo.toLowerCase().includes(lower))) {
        found.push({ ...p, teamName: 'Central Reserve Pool', teamColor: 'from-sky-700 to-sky-950' });
      }
    });

    setSearchResult(found);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      
      {/* 1. Header */}
      <Header
        onOpenRegister={handleOpenGeneralRegister}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTelegram={() => handleTabChange('telegram')}
        telegramUrl={data.tournament?.telegramGroupUrl || 'https://t.me/+MgD-vhGBGSgzOWI9'}
        stats={data.tournament}
        isAdminLoggedIn={!!sessionStorage.getItem('next_ias_organizer_pin')}
      />

      {/* 2. Tournament Hero Banner */}
      <StatsBanner tournament={data.tournament} />

      {/* 3. Main Navigation & Search Bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Global Multi-Device Sync Status Banner */}
        <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl border text-xs shadow-sm transition ${
          cloudSyncStatus.isConfigured
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/90 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-center gap-2">
            {cloudSyncStatus.isConfigured ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                <span className="font-black text-emerald-800">🟢 Global Real-Time Cloud Sync Active</span>
                <span className="text-slate-300 hidden md:inline">•</span>
                <span className="text-slate-600 hidden md:inline">Form submissions and roster updates synchronize automatically across all devices</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                <span className="font-black text-amber-900">🟡 Local Device Storage Mode</span>
                <span className="text-slate-300 hidden md:inline">•</span>
                <span className="text-slate-600 hidden md:inline">Connect Firebase or Backend in Organizer Command Center to enable global multi-device sync</span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-[11px] font-bold text-brand-navy hover:underline flex items-center gap-1 ml-auto"
          >
            {cloudSyncStatus.isConfigured ? 'View Cloud DB Config' : '⚙️ Setup Cloud Sync'}
          </button>
        </div>

        {/* Navigation Tabs & Student Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleTabChange('teams')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'teams'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🏏 6 Teams &amp; Rosters ({data.teams.length})
            </button>

            <button
              onClick={() => handleTabChange('fixtures')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                activeTab === 'fixtures'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🏆 Fixtures &amp; Results ({data.fixtures?.length || 5})</span>
              {(data.fixtures || []).some(m => m.status === 'Live') && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => handleTabChange('reserve')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'reserve'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🛡️ Central Reserve Pool ({data.reservePool.length})
            </button>

            <button
              onClick={() => handleTabChange('telegram')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'telegram'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              📢 Telegram Channel
            </button>

            <button
              onClick={() => handleTabChange('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'rules'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              📜 Tournament Rules (T8)
            </button>
          </div>

          {/* Quick Player Lookup */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Find registered player or roll no..."
              value={studentSearchQuery}
              onChange={handleStudentSearch}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none bg-slate-50 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Search Results Dropdown Overlay */}
        {searchResult && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-lg animate-in fade-in space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Matching Registered Candidates ({searchResult.length})</span>
              <button onClick={() => setSearchResult(null)} className="text-rose-600 hover:underline text-[11px]">Close</button>
            </div>
            {searchResult.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No player found with that name or roll number. They can register now!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {searchResult.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>{p.name}</span>
                        {p.isCaptain && <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold">C</span>}
                        {p.isViceCaptain && <span className="text-[9px] bg-sky-100 text-sky-800 border border-sky-300 px-1 rounded font-bold" title="Vice Captain">VC</span>}
                        {p.isExtra && <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1 rounded font-bold">EXTRA</span>}
                      </div>
                      <div className="text-[10px] text-slate-500">{p.rollNo} • {p.role}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-navy/10 text-brand-navy truncate max-w-[110px]">
                      {p.teamName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Teams Section */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black font-heading text-slate-900 flex items-center gap-2">
                  <span>Official Tournament Teams</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    6 Teams
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  10-player flexible squad capacity per team. Live breakdown of Batsmen, All-Rounders, and Bowlers.
                </p>
              </div>

              <button
                onClick={handleOpenGeneralRegister}
                className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Register for Tournament</span>
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-slate-200 rounded-3xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.teams.map(team => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onJoin={() => handleOpenRegisterForTeam(team.id)}
                    onSelectTeam={() => handleOpenRegisterForTeam(team.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Knockout Fixtures Section */}
        {activeTab === 'fixtures' && (
          <FixturesSection
            fixtures={data.fixtures || []}
            teams={data.teams || []}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

        {/* Tab 3: Central Reserve Pool Section */}
        {activeTab === 'reserve' && (
          <ReservePoolSection
            reservePool={data.reservePool || []}
            onJoinReserve={handleJoinReserve}
          />
        )}

        {/* Tab 4: Telegram Channel Section */}
        {activeTab === 'telegram' && (
          <TelegramNotice
            telegramUrl={data.tournament?.telegramGroupUrl || 'https://t.me/+MgD-vhGBGSgzOWI9'}
          />
        )}

        {/* Tab 5: Rules Section */}
        {activeTab === 'rules' && (
          <RulesSection />
        )}

      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-8 px-4 text-center mt-auto">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-heading">
            <span className="font-extrabold text-brand-gold">NEXT IAS</span>
            <span>•</span>
            <span className="font-bold text-sky-400">Umang 2026: Sports &amp; Inspiration Meet</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Official Cricket Championship 2026 • 6 Teams • 10 Players Per Team (60 Squad Slots + Central Reserve Pool)
          </p>
          <div className="pt-2 text-[10px] text-slate-400">
            Confidentiality Notice: Personal contact details are protected and accessible only by authorized tournament organizers.
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => {
          setIsRegisterOpen(false);
          if (typeof window !== 'undefined' && window.location.hash === '#register') {
            window.location.hash = activeTab;
          }
        }}
        teams={data.teams}
        preselectedTeamId={preselectedTeamId}
        reservePoolCount={data.reservePool ? data.reservePool.length : 0}
        onRegistered={handleRegistrationSubmit}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        teams={data.teams}
        reservePool={data.reservePool}
        onDataChanged={fetchData}
      />

    </div>
  );
}
