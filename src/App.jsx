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
import { api } from './services/api';
import { Search, Trophy, Shield, Users, CheckCircle, RefreshCw, AlertCircle, Sparkles, Flame } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    tournament: {},
    teams: [],
    reservePool: [],
    fixtures: []
  });
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const publicData = await api.getPublicData();
      setData(publicData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    await fetchData();
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
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
              🏏 8 Teams & Rosters ({data.teams.length})
            </button>

            <button
              onClick={() => handleTabChange('fixtures')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                activeTab === 'fixtures'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🏆 Fixtures & Results ({data.fixtures?.length || 7})</span>
              {(data.fixtures || []).some(m => m.status === 'Ongoing') && (
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
              📢 Telegram & Privacy
            </button>

            <button
              onClick={() => handleTabChange('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'rules'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              📋 Rules & Squad Structure
            </button>
          </div>

          {/* Quick Player Lookup Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Find my team (search name)..."
              value={studentSearchQuery}
              onChange={handleStudentSearch}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none bg-slate-50"
            />
          </div>

        </div>

        {/* Live Search Results Popup / Alert */}
        {studentSearchQuery && (
          <div className="bg-white rounded-2xl p-4 border border-brand-red/30 shadow-md">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Search Results for "{studentSearchQuery}"</span>
              <button onClick={() => { setStudentSearchQuery(''); setSearchResult(null); }} className="text-slate-400 hover:text-slate-600 text-xs">Clear</button>
            </div>
            {(!searchResult || searchResult.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No registered participant found with that name or roll number. Click "Register Now" to sign up!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {searchResult.map((res, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>{res.name}</span>
                        {res.isWicketKeeper && <span>🧤</span>}
                      </div>
                      <div className="text-[11px] text-slate-500">{res.rollNo} • {res.role}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-navy text-white">
                        {res.teamName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Tab Views */}
        {activeTab === 'teams' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
                  8 Official Teams & Squad Slots
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Click on any team card to inspect current squad members, slot balances, or join that team.
                </p>
              </div>

              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-slate-600 text-xs font-semibold shadow-sm transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Slots</span>
              </button>
            </div>

            {/* 8 Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {data.teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onSelectTeam={handleOpenRegisterForTeam}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fixtures' && (
          <FixturesSection
            fixtures={data.fixtures || []}
            teams={data.teams || []}
          />
        )}

        {activeTab === 'reserve' && (
          <ReservePoolSection
            reservePool={data.reservePool}
            onJoinReserve={handleJoinReserve}
          />
        )}

        {activeTab === 'telegram' && (
          <TelegramNotice telegramUrl={data.tournament.telegramGroupUrl} />
        )}

        {activeTab === 'rules' && (
          <RulesSection />
        )}

      </main>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-brand-navy font-heading">NEXT <span className="text-brand-red">IAS</span></span>
            <span>•</span>
            <span className="font-bold text-sky-800">Umang 2026: Sports &amp; Inspiration Meet</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Official Cricket Championship 2026 • 8 Teams • 13 Players Per Team (104 Squad Slots + Central Reserve Pool)
          </p>
          <div className="pt-2 text-[10px] text-slate-400">
            Confidentiality Notice: Personal contact details are encrypted and accessible only by designated tournament organizers.
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
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
