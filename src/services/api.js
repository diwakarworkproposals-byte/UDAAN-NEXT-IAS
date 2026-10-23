// API service with Cloud Database Synchronization (Firebase Realtime DB & Custom Backend)
// and seamless fallback to localStorage for offline resilience.

const STORAGE_KEY = 'next_ias_cricket_tournament_data_v8';
const CLOUD_DB_URL_KEY = 'next_ias_cloud_db_url';
const CLOUD_DB_TYPE_KEY = 'next_ias_cloud_db_type';

export const INITIAL_FALLBACK_DATA = {
  tournament: {
    name: "NEXT IAS Umang 2026",
    edition: "Cricket Tournament • Sports & Inspiration Meet",
    matchDate: "25th October 2026",
    timeSlot: "09:00 AM – 11:00 AM",
    matchFormat: "10 Overs per match (T10)",
    pitches: 4,
    simultaneousMatches: true,
    venue: "NEXT IAS Sports Complex (Pitches 1, 2, 3, 4), New Delhi",
    organizerPin: "NEXTIAS2610",
    telegramGroupUrl: "https://t.me/+MgD-vhGBGSgzOWI9",
    totalExpectedPlayers: 108,
    rosterSlotsPerTeam: 13,
    reservePoolCapacity: 4
  },
  captains: [
    { id: "cap-1", name: "Adwitya", role: "Team Captain", teamId: "team-1", mobile: "8700608044" },
    { id: "cap-2", name: "Amrendar", role: "Team Captain", teamId: "team-2", mobile: "9602683688" },
    { id: "cap-3", name: "Jatin Singh", role: "Team Captain", teamId: "team-3", mobile: "6205459492" },
    { id: "cap-4", name: "Nikhil", role: "Team Captain", teamId: "team-4", mobile: "6386282800" },
    { id: "cap-5", name: "Ravi", role: "Team Captain", teamId: "team-5", mobile: "8310342290" },
    { id: "cap-6", name: "Satyam", role: "Team Captain", teamId: "team-6", mobile: "9219832109" },
    { id: "cap-7", name: "Siddharth", role: "Team Captain", teamId: "team-7", mobile: "7717706744" },
    { id: "cap-8", name: "Vansh", role: "Team Captain", teamId: "team-8", mobile: "7828035527" },
    { id: "cap-9", name: "Organizer 1", role: "Tournament Organizer & Director", teamId: null, mobile: "+91 98990 XXXXX" },
    { id: "cap-10", name: "Organizer 2", role: "Tournament Organizer & Operations", teamId: null, mobile: "+91 98001 XXXXX" }
  ],
  teams: [
    {
      id: "team-1",
      name: "NEXT IAS Titans",
      shortName: "TITANS",
      tagline: "Discipline. Dominance. Victory.",
      color: "from-red-600 to-rose-900",
      accentColor: "#ED1C24",
      captainName: "Adwitya (Captain)",
      players: [
        { id: "p-cap-1", name: "Adwitya", rollNo: "CAPT-01", role: "battingAllRounder", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Right-arm Medium", mobile: "8700608044", isCaptain: true, attendance: "Confirmed", teamId: "team-1" }
      ]
    },
    {
      id: "team-2",
      name: "Rajinder Nagar Royals",
      shortName: "ROYALS",
      tagline: "Class, Grace & Relentless Focus",
      color: "from-blue-700 to-indigo-950",
      accentColor: "#0267B1",
      captainName: "Amrendar (Captain)",
      players: [
        { id: "p-cap-2", name: "Amrendar", rollNo: "CAPT-02", role: "batsman", isWicketKeeper: true, battingStyle: "Right Hand", bowlingStyle: "None", mobile: "9602683688", isCaptain: true, attendance: "Confirmed", teamId: "team-2" }
      ]
    },
    {
      id: "team-3",
      name: "Karol Bagh Kings",
      shortName: "KINGS",
      tagline: "Aggression with Academic Calm",
      color: "from-amber-500 to-yellow-800",
      accentColor: "#F59E0B",
      captainName: "Jatin Singh (Captain)",
      players: [
        { id: "p-cap-3", name: "Jatin Singh", rollNo: "CAPT-03", role: "battingAllRounder", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Right-arm Medium", mobile: "6205459492", isCaptain: true, attendance: "Confirmed", teamId: "team-3" }
      ]
    },
    {
      id: "team-4",
      name: "Civil Service Strikers",
      shortName: "STRIKERS",
      tagline: "Precision Bowling & Boundary Blitz",
      color: "from-emerald-600 to-teal-900",
      accentColor: "#10B981",
      captainName: "Nikhil (Captain)",
      players: [
        { id: "p-cap-4", name: "Nikhil", rollNo: "CAPT-04", role: "allRounder", isWicketKeeper: false, battingStyle: "Left Hand", bowlingStyle: "Right-arm Off Spin", mobile: "6386282800", isCaptain: true, attendance: "Confirmed", teamId: "team-4" }
      ]
    },
    {
      id: "team-5",
      name: "CSAT Crusaders",
      shortName: "CRUSADERS",
      tagline: "High Aptitude & Fearless Boundaries",
      color: "from-purple-600 to-violet-950",
      accentColor: "#7C3AED",
      captainName: "Ravi (Captain)",
      players: [
        { id: "p-cap-5", name: "Ravi", rollNo: "CAPT-05", role: "batsman", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "None", mobile: "8310342290", isCaptain: true, attendance: "Confirmed", teamId: "team-5" }
      ]
    },
    {
      id: "team-6",
      name: "LBSNAA Challengers",
      shortName: "CHALLENGERS",
      tagline: "Destination Mussoorie, Target Cup",
      color: "from-cyan-600 to-blue-900",
      accentColor: "#0891B2",
      captainName: "Satyam (Captain)",
      players: [
        { id: "p-cap-6", name: "Satyam", rollNo: "CAPT-06", role: "bowlingAllRounder", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Left-arm Orthodox", mobile: "9219832109", isCaptain: true, attendance: "Confirmed", teamId: "team-6" }
      ]
    },
    {
      id: "team-7",
      name: "Old Rajinder Mavericks",
      shortName: "MAVERICKS",
      tagline: "Midnight Revisions & Matchwinners",
      color: "from-rose-600 to-pink-950",
      accentColor: "#E11D48",
      captainName: "Siddharth (Captain)",
      players: [
        { id: "p-cap-7", name: "Siddharth", rollNo: "CAPT-07", role: "batsman", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "None", mobile: "7717706744", isCaptain: true, attendance: "Confirmed", teamId: "team-7" }
      ]
    },
    {
      id: "team-8",
      name: "Prelims Powerhitters",
      shortName: "POWERHITTERS",
      tagline: "Clearing Cut-offs & Clearing Boundaries",
      color: "from-orange-600 to-amber-900",
      accentColor: "#EA580C",
      captainName: "Vansh (Captain)",
      players: [
        { id: "p-cap-8", name: "Vansh", rollNo: "CAPT-08", role: "bowlingAllRounder", isWicketKeeper: false, battingStyle: "Left Hand", bowlingStyle: "Right-arm Fast Medium", mobile: "7828035527", isCaptain: true, attendance: "Confirmed", teamId: "team-8" }
      ]
    }
  ],
  reservePool: [],
  fixtures: [
    {
      id: "m-1",
      matchNumber: 1,
      round: "Quarter-Final 1",
      stage: "QF",
      team1Id: "team-1",
      team1Name: "NEXT IAS Titans",
      team2Id: "team-2",
      team2Name: "Rajinder Nagar Royals",
      dateTime: "25 Oct 2026 • 09:00 AM – 09:40 AM",
      venue: "Pitch 1 (Simultaneous T10)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "10-Over Match (T10) • Winner advances to Semi-Final 1",
      nextMatchId: "m-5",
      nextSlot: "team1"
    },
    {
      id: "m-2",
      matchNumber: 2,
      round: "Quarter-Final 2",
      stage: "QF",
      team1Id: "team-3",
      team1Name: "Karol Bagh Kings",
      team2Id: "team-4",
      team2Name: "Civil Service Strikers",
      dateTime: "25 Oct 2026 • 09:00 AM – 09:40 AM",
      venue: "Pitch 2 (Simultaneous T10)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "10-Over Match (T10) • Winner advances to Semi-Final 1",
      nextMatchId: "m-5",
      nextSlot: "team2"
    },
    {
      id: "m-3",
      matchNumber: 3,
      round: "Quarter-Final 3",
      stage: "QF",
      team1Id: "team-5",
      team1Name: "CSAT Crusaders",
      team2Id: "team-6",
      team2Name: "LBSNAA Challengers",
      dateTime: "25 Oct 2026 • 09:00 AM – 09:40 AM",
      venue: "Pitch 3 (Simultaneous T10)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "10-Over Match (T10) • Winner advances to Semi-Final 2",
      nextMatchId: "m-6",
      nextSlot: "team1"
    },
    {
      id: "m-4",
      matchNumber: 4,
      round: "Quarter-Final 4",
      stage: "QF",
      team1Id: "team-7",
      team1Name: "Old Rajinder Mavericks",
      team2Id: "team-8",
      team2Name: "Prelims Powerhitters",
      dateTime: "25 Oct 2026 • 09:00 AM – 09:40 AM",
      venue: "Pitch 4 (Simultaneous T10)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "10-Over Match (T10) • Winner advances to Semi-Final 2",
      nextMatchId: "m-6",
      nextSlot: "team2"
    },
    {
      id: "m-5",
      matchNumber: 5,
      round: "Semi-Final 1",
      stage: "SF",
      team1Id: null,
      team1Name: "Winner QF 1",
      team2Id: null,
      team2Name: "Winner QF 2",
      dateTime: "25 Oct 2026 • 09:45 AM – 10:20 AM",
      venue: "Pitch 1 (Simultaneous T10)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "10-Over Match (T10) • Winner qualifies for Grand Finale",
      nextMatchId: "m-7",
      nextSlot: "team1"
    },
    {
      id: "m-6",
      matchNumber: 6,
      round: "Semi-Final 2",
      stage: "SF",
      team1Id: null,
      team1Name: "Winner QF 3",
      team2Id: null,
      team2Name: "Winner QF 4",
      dateTime: "25 Oct 2026 • 09:45 AM – 10:20 AM",
      venue: "Pitch 2 (Simultaneous T10)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "10-Over Match (T10) • Winner qualifies for Grand Finale",
      nextMatchId: "m-7",
      nextSlot: "team2"
    },
    {
      id: "m-7",
      matchNumber: 7,
      round: "Grand Finale 🏆",
      stage: "FINAL",
      team1Id: null,
      team1Name: "Winner SF 1",
      team2Id: null,
      team2Name: "Winner SF 2",
      dateTime: "25 Oct 2026 • 10:25 AM – 11:00 AM",
      venue: "Pitch 1 (Championship Pitch)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "10-Over Championship Final (T10) • Trophy Presentation at 11:00 AM",
      nextMatchId: null,
      nextSlot: null
    }
  ]
};

// ----------------------------------------------------
// Cloud Database Configuration & Resolution
// ----------------------------------------------------
export function getActiveCloudConfig() {
  if (typeof window === 'undefined') {
    return { url: '', type: 'none', isConfigured: false };
  }

  // 1. Build-time Vite Environment variables
  const envFirebaseUrl = (import.meta.env?.VITE_FIREBASE_DB_URL || '').trim();
  const envApiUrl = (import.meta.env?.VITE_API_URL || '').trim();

  // 2. Global window overrides (allows runtime injection without rebuilding)
  const winFirebaseUrl = (window.NEXT_IAS_FIREBASE_URL || '').trim();
  const winApiUrl = (window.NEXT_IAS_API_URL || '').trim();

  // 3. Saved localStorage settings from Organizer Dashboard
  let localUrl = '';
  let localType = '';
  try {
    localUrl = (localStorage.getItem(CLOUD_DB_URL_KEY) || '').trim();
    localType = (localStorage.getItem(CLOUD_DB_TYPE_KEY) || '').trim();
  } catch (e) {
    // ignore
  }

  const DEFAULT_FIREBASE_URL = 'https://next-ias-tournament-default-rtdb.firebaseio.com';
  const activeUrl = envFirebaseUrl || winFirebaseUrl || envApiUrl || winApiUrl || localUrl || DEFAULT_FIREBASE_URL;

  if (!activeUrl) {
    return { url: '', type: 'none', isConfigured: false, source: 'none' };
  }

  // Determine type
  let type = localType;
  if (activeUrl.includes('firebaseio.com') || activeUrl.includes('firebasedatabase.app')) {
    type = 'firebase';
  } else if (!type || type === 'none') {
    type = 'custom_api';
  }

  let source = 'default';
  if (localUrl) source = 'localStorage';
  else if (envFirebaseUrl || envApiUrl) source = 'environment';
  else if (winFirebaseUrl || winApiUrl) source = 'window';

  return {
    url: activeUrl,
    type,
    isConfigured: true,
    source
  };
}

export function saveActiveCloudConfig(url, type) {
  if (typeof window === 'undefined') return;
  const cleanUrl = (url || '').trim();
  let cleanType = type;

  if (!cleanType) {
    if (cleanUrl.includes('firebaseio.com') || cleanUrl.includes('firebasedatabase.app')) {
      cleanType = 'firebase';
    } else {
      cleanType = 'custom_api';
    }
  }

  if (cleanUrl) {
    localStorage.setItem(CLOUD_DB_URL_KEY, cleanUrl);
    localStorage.setItem(CLOUD_DB_TYPE_KEY, cleanType);
  } else {
    localStorage.removeItem(CLOUD_DB_URL_KEY);
    localStorage.removeItem(CLOUD_DB_TYPE_KEY);
  }

  // Notify active components of configuration change
  try {
    window.dispatchEvent(new CustomEvent('next_ias_cloud_config_updated', { detail: { url: cleanUrl, type: cleanType } }));
  } catch (e) {
    // ignore
  }
}

export function normalizeFirebaseUrl(url) {
  let clean = (url || '').trim().replace(/\/+$/, '');
  if (!clean.endsWith('.json')) {
    clean += '/tournament_data.json';
  }
  return clean;
}

export function normalizeCustomApiUrl(url) {
  let clean = (url || '').trim().replace(/\/+$/, '');
  if (!clean.endsWith('/api')) {
    clean += '/api';
  }
  return clean;
}

function isStaticHosting() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.includes('github.io') || host.includes('pages.dev') || host.includes('netlify.app') || window.location.protocol === 'file:';
}

function getLocalData() {
  if (typeof window === 'undefined') return INITIAL_FALLBACK_DATA;
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed && parsed.teams && parsed.teams.length > 0) {
        if (!parsed.fixtures || parsed.fixtures.length === 0) {
          parsed.fixtures = INITIAL_FALLBACK_DATA.fixtures;
        }
        // Ensure CSAT Crusaders rename takes effect in existing caches
        const team5 = parsed.teams.find(t => t.id === 'team-5');
        if (team5 && (team5.name.includes('Dholpur') || team5.shortName === 'KNIGHTS')) {
          team5.name = 'CSAT Crusaders';
          team5.shortName = 'CRUSADERS';
          team5.tagline = 'High Aptitude & Fearless Boundaries';
        }
        const qf3 = parsed.fixtures.find(f => f.id === 'm-3');
        if (qf3 && qf3.team1Name && qf3.team1Name.includes('Dholpur')) {
          qf3.team1Name = 'CSAT Crusaders';
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Error parsing local storage data, reverting to defaults", e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_DATA));
  return INITIAL_FALLBACK_DATA;
}

function saveLocalData(data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// ----------------------------------------------------
// Cloud Database Helpers (Firebase Realtime DB REST API)
// ----------------------------------------------------
async function fetchFirebaseRaw() {
  const config = getActiveCloudConfig();
  if (!config.isConfigured || config.type !== 'firebase') return null;

  const endpoint = normalizeFirebaseUrl(config.url);
  const res = await fetch(endpoint, {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Cloud Database returned status ${res.status} (${res.statusText})`);
  }

  const cloudData = await res.json();
  if (!cloudData || !cloudData.teams || cloudData.teams.length === 0) {
    // Cloud database is empty or freshly initialized: seed with initial clean tournament rosters!
    console.log('[CloudDB] Initializing empty Cloud Database with official NEXT IAS tournament rosters...');
    await saveFirebaseRaw(INITIAL_FALLBACK_DATA);
    return INITIAL_FALLBACK_DATA;
  }

  // Ensure CSAT Crusaders rename
  const team5 = cloudData.teams.find(t => t.id === 'team-5');
  if (team5 && (team5.name.includes('Dholpur') || team5.shortName === 'KNIGHTS')) {
    team5.name = 'CSAT Crusaders';
    team5.shortName = 'CRUSADERS';
    team5.tagline = 'High Aptitude & Fearless Boundaries';
  }

  // Ensure fixtures exist
  if (!cloudData.fixtures || cloudData.fixtures.length === 0) {
    cloudData.fixtures = INITIAL_FALLBACK_DATA.fixtures;
  }

  // Update local cache
  saveLocalData(cloudData);
  return cloudData;
}

async function saveFirebaseRaw(data) {
  const config = getActiveCloudConfig();
  if (!config.isConfigured || config.type !== 'firebase') return false;

  const endpoint = normalizeFirebaseUrl(config.url);
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Failed to persist data to Cloud Database (HTTP ${res.status})`);
  }

  saveLocalData(data);
  return true;
}

// ----------------------------------------------------
// Stats Calculation & Sanitization Helpers
// ----------------------------------------------------
function computeTeamStats(team) {
  const players = team.players || [];
  const batsmen = players.filter(p => p.role === 'batsman').length;
  const allRounders = players.filter(p => p.role === 'allRounder' || p.role === 'battingAllRounder' || p.role === 'bowlingAllRounder').length;
  const bowlers = players.filter(p => p.role === 'bowler').length;
  const wicketKeepersCount = players.filter(p => p.isWicketKeeper).length;
  const total = players.length;

  return {
    maxSlots: { total: 13 },
    counts: { batsmen, allRounders, bowlers, wicketKeepers: wicketKeepersCount, total },
    occupied: { batsmen, allRounders, bowlers, total },
    available: {
      total: Math.max(0, 13 - total)
    },
    isFull: total >= 13,
    wicketKeepersCount
  };
}

function formatSanitizedData(data) {
  const sanitizedTeams = (data.teams || []).map(team => ({
    ...team,
    stats: computeTeamStats(team),
    players: (team.players || []).map(p => ({
      id: p.id,
      name: p.name,
      rollNo: p.rollNo,
      role: p.role,
      isWicketKeeper: !!p.isWicketKeeper,
      battingStyle: p.battingStyle || 'Right Hand',
      bowlingStyle: p.bowlingStyle || 'None',
      isCaptain: !!p.isCaptain,
      attendance: p.attendance || 'Pending',
      isExtra: !!p.isExtra,
      teamId: p.teamId,
      registeredAt: p.registeredAt
    }))
  }));

  const sanitizedReserve = (data.reservePool || []).map(p => ({
    id: p.id,
    name: p.name,
    rollNo: p.rollNo,
    role: p.role,
    isWicketKeeper: !!p.isWicketKeeper,
    battingStyle: p.battingStyle || 'Right Hand',
    bowlingStyle: p.bowlingStyle || 'None',
    attendance: p.attendance || 'Pending',
    isExtra: !!p.isExtra,
    registeredAt: p.registeredAt
  }));

  const totalAssignedPlayers = sanitizedTeams.reduce((sum, t) => sum + (t.players ? t.players.length : 0), 0);

  return {
    tournament: {
      ...data.tournament,
      totalAssignedPlayers,
      totalReserve: sanitizedReserve.length,
      totalRegistered: totalAssignedPlayers + sanitizedReserve.length,
      totalSlotsAcrossTeams: 104
    },
    teams: sanitizedTeams,
    reservePool: sanitizedReserve,
    captainsList: data.captains || [],
    fixtures: data.fixtures || INITIAL_FALLBACK_DATA.fixtures || []
  };
}

function advanceKnockoutFixtures(fixtures, teams) {
  for (let pass = 0; pass < 2; pass++) {
    for (const match of fixtures) {
      if (match.nextMatchId) {
        const nextMatch = fixtures.find(f => f.id === match.nextMatchId);
        if (nextMatch) {
          if (match.winnerTeamId) {
            const team = teams.find(t => t.id === match.winnerTeamId);
            const teamName = team ? team.name : match.winnerTeamName || (match.winnerTeamId === match.team1Id ? match.team1Name : match.team2Name);
            if (match.nextSlot === 'team1') {
              nextMatch.team1Id = match.winnerTeamId;
              nextMatch.team1Name = teamName;
            } else if (match.nextSlot === 'team2') {
              nextMatch.team2Id = match.winnerTeamId;
              nextMatch.team2Name = teamName;
            }
          } else {
            // Revert slot if winner cleared
            if (match.nextSlot === 'team1' && nextMatch.team1Id) {
              if (nextMatch.winnerTeamId === nextMatch.team1Id) {
                nextMatch.winnerTeamId = null;
                nextMatch.winnerTeamName = null;
              }
              nextMatch.team1Id = null;
              nextMatch.team1Name = `Winner ${match.round}`;
            } else if (match.nextSlot === 'team2' && nextMatch.team2Id) {
              if (nextMatch.winnerTeamId === nextMatch.team2Id) {
                nextMatch.winnerTeamId = null;
                nextMatch.winnerTeamName = null;
              }
              nextMatch.team2Id = null;
              nextMatch.team2Name = `Winner ${match.round}`;
            }
          }
        }
      }
    }
  }
  return fixtures;
}

// ----------------------------------------------------
// Public API Object
// ----------------------------------------------------
export const api = {
  // Test Cloud Database connection
  async testCloudConnection(url, type) {
    const cleanUrl = (url || '').trim();
    if (!cleanUrl) {
      return { ok: false, error: 'Database URL cannot be empty.' };
    }

    try {
      if (type === 'firebase' || cleanUrl.includes('firebaseio.com') || cleanUrl.includes('firebasedatabase.app')) {
        const endpoint = normalizeFirebaseUrl(cleanUrl);
        const res = await fetch(endpoint, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });

        if (!res.ok) {
          return { ok: false, error: `Cloud Database returned HTTP ${res.status}: ${res.statusText}. Please verify the Firebase Realtime Database URL and ensure Read/Write Rules allow public access.` };
        }

        const data = await res.json();
        return {
          ok: true,
          type: 'firebase',
          message: 'Connection successful! Firebase Realtime Database is accessible.',
          hasData: !!(data && data.teams)
        };
      } else {
        const endpoint = `${normalizeCustomApiUrl(cleanUrl)}/public-data`;
        const res = await fetch(endpoint, { cache: 'no-store' });
        if (!res.ok) {
          return { ok: false, error: `Custom Backend returned HTTP ${res.status}: ${res.statusText}.` };
        }
        const data = await res.json();
        return {
          ok: true,
          type: 'custom_api',
          message: 'Connection successful! Backend server is online and operational.',
          hasData: !!(data && data.teams)
        };
      }
    } catch (err) {
      return { ok: false, error: `Network connection failed: ${err.message}` };
    }
  },

  // Push pristine tournament baseline to Cloud Database
  async seedCloudDatabase(url, type) {
    const cleanUrl = (url || '').trim();
    if (type === 'firebase' || cleanUrl.includes('firebaseio.com') || cleanUrl.includes('firebasedatabase.app')) {
      const endpoint = normalizeFirebaseUrl(cleanUrl);
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(INITIAL_FALLBACK_DATA)
      });
      if (!res.ok) {
        throw new Error(`Failed to seed Firebase (HTTP ${res.status})`);
      }
      saveLocalData(INITIAL_FALLBACK_DATA);
      return true;
    }
    return false;
  },

  // Fetch public data (safe, stripped of student phone numbers)
  async getPublicData() {
    const config = getActiveCloudConfig();

    // 1. Try Firebase if configured
    if (config.isConfigured && config.type === 'firebase') {
      try {
        const raw = await fetchFirebaseRaw();
        if (raw) return formatSanitizedData(raw);
      } catch (err) {
        console.warn('[CloudDB] Cloud fetch failed, falling back to local storage cache:', err.message);
      }
    }

    // 2. Try Custom API if configured
    if (config.isConfigured && config.type === 'custom_api') {
      try {
        const endpoint = `${normalizeCustomApiUrl(config.url)}/public-data`;
        const res = await fetch(endpoint, { cache: 'no-store' });
        if (res.ok) {
          const cloudData = await res.json();
          saveLocalData(cloudData);
          return cloudData;
        }
      } catch (err) {
        console.warn('[CloudDB] Custom API fetch failed, falling back to local cache:', err.message);
      }
    }

    // 3. Fallback to local server if running locally with server.js
    if (!isStaticHosting() && !config.isConfigured) {
      try {
        const res = await fetch('/api/public-data');
        if (res.ok) return await res.json();
      } catch (err) {
        // fall through
      }
    }

    // 4. Fallback to client localStorage
    return formatSanitizedData(getLocalData());
  },

  // Register student globally
  async register(registrationData) {
    const config = getActiveCloudConfig();

    // 1. Handle Global Firebase Cloud Database
    if (config.isConfigured && config.type === 'firebase') {
      let data = null;
      try {
        data = await fetchFirebaseRaw();
      } catch (e) {
        console.warn('[CloudDB] Could not load live Firebase data, using local fallback:', e);
      }
      if (!data) data = getLocalData();

      const cleanRollNo = String(registrationData.rollNo || '').trim().toLowerCase();
      const cleanName = String(registrationData.name || '').trim().toLowerCase();

      // Check duplicates by roll number or name
      let duplicate = false;
      (data.teams || []).forEach(t => {
        if ((t.players || []).some(p => 
          (cleanRollNo && String(p.rollNo || '').trim().toLowerCase() === cleanRollNo) ||
          (String(p.name || '').trim().toLowerCase() === cleanName)
        )) duplicate = true;
      });
      if ((data.reservePool || []).some(p => 
        (cleanRollNo && String(p.rollNo || '').trim().toLowerCase() === cleanRollNo) ||
        (String(p.name || '').trim().toLowerCase() === cleanName)
      )) duplicate = true;

      if (duplicate) {
        throw new Error(`A student with this Name or Roll No is already registered globally. Please contact organizers if you need adjustments.`);
      }

      const isNotSure = registrationData.availability === 'Not Sure';
      const isReserveDestination = (registrationData.preferredTeamId === 'reserve') || (isNotSure && registrationData.extraDestination === 'reserve');
      const isReserveFull = (data.reservePool || []).length >= 4;

      if (isReserveDestination && isReserveFull) {
        throw new Error('The Central Reserve Pool is currently full (maximum 4 students). Please join an official team as an Extra.');
      }

      const newPlayer = {
        id: 'p-' + Date.now(),
        name: registrationData.name.trim(),
        rollNo: registrationData.rollNo ? registrationData.rollNo.trim() : 'N/A',
        role: registrationData.role,
        isWicketKeeper: !!registrationData.isWicketKeeper,
        battingStyle: registrationData.battingStyle || 'Right Hand',
        bowlingStyle: registrationData.bowlingStyle || 'None',
        attendance: isNotSure ? 'Not Sure' : 'Confirmed',
        isExtra: isNotSure,
        registeredAt: new Date().toISOString()
      };

      if (isReserveDestination) {
        newPlayer.teamId = 'reserve';
        if (!data.reservePool) data.reservePool = [];
        data.reservePool.push(newPlayer);
        await saveFirebaseRaw(data);
        return {
          success: true,
          message: 'Successfully registered in Central Reserve Pool (Standby)!',
          player: newPlayer,
          assignedTo: 'Central Reserve Pool'
        };
      }

      const team = data.teams.find(t => t.id === registrationData.preferredTeamId);
      if (!team) throw new Error('Selected team not found');

      if (!team.players) team.players = [];

      // Enforce 13-player team squad limit
      if (team.players.length >= 13) {
        throw new Error(`${team.name} has already reached its maximum squad limit of 13 players. Please choose another team.`);
      }

      newPlayer.teamId = team.id;
      team.players.push(newPlayer);
      await saveFirebaseRaw(data);

      return {
        success: true,
        message: isNotSure
          ? `Registered as an EXTRA for ${team.name}! You are tagged with an [EXTRA] badge on the team roster.`
          : `Congratulations! You have been confirmed in the squad of ${team.name}!`,
        player: newPlayer,
        assignedTo: team.name
      };
    }

    // 2. Handle Custom Backend API
    if (config.isConfigured && config.type === 'custom_api') {
      const endpoint = `${normalizeCustomApiUrl(config.url)}/register`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');
      return json;
    }

    // 3. Handle Local Node server
    if (!isStaticHosting() && !config.isConfigured) {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        // fall through to local
      }
    }

    // 4. Static Hosting / LocalStorage fallback
    const data = getLocalData();
    const cleanRollNo = String(registrationData.rollNo || '').trim().toLowerCase();
    const cleanName = String(registrationData.name || '').trim().toLowerCase();

    // Check duplicates by roll number or name
    let duplicate = false;
    (data.teams || []).forEach(t => {
      if ((t.players || []).some(p => 
        (cleanRollNo && String(p.rollNo || '').trim().toLowerCase() === cleanRollNo) ||
        (String(p.name || '').trim().toLowerCase() === cleanName)
      )) duplicate = true;
    });
    if ((data.reservePool || []).some(p => 
      (cleanRollNo && String(p.rollNo || '').trim().toLowerCase() === cleanRollNo) ||
      (String(p.name || '').trim().toLowerCase() === cleanName)
    )) duplicate = true;

    if (duplicate) {
      throw new Error(`A student with this Name / Roll No is already registered. Please contact organizers if you need to make changes.`);
    }

    const isNotSure = registrationData.availability === 'Not Sure';
    const isReserveDestination = (registrationData.preferredTeamId === 'reserve') || (isNotSure && registrationData.extraDestination === 'reserve');
    const isReserveFull = (data.reservePool || []).length >= 4;

    if (isReserveDestination && isReserveFull) {
      throw new Error('The Central Reserve Pool is full (maximum 4 students). Please join an official team as an Extra.');
    }

    const newPlayer = {
      id: 'p-' + Date.now(),
      name: registrationData.name.trim(),
      rollNo: registrationData.rollNo ? registrationData.rollNo.trim() : 'N/A',
      role: registrationData.role,
      isWicketKeeper: !!registrationData.isWicketKeeper,
      battingStyle: registrationData.battingStyle || 'Right Hand',
      bowlingStyle: registrationData.bowlingStyle || 'None',
      attendance: isNotSure ? 'Not Sure' : 'Confirmed',
      isExtra: isNotSure,
      registeredAt: new Date().toISOString()
    };

    if (isReserveDestination) {
      newPlayer.teamId = 'reserve';
      if (!data.reservePool) data.reservePool = [];
      data.reservePool.push(newPlayer);
      saveLocalData(data);
      return {
        success: true,
        message: 'Successfully registered in Central Reserve Pool (Standby)!',
        player: newPlayer,
        assignedTo: 'Central Reserve Pool'
      };
    }

    const team = data.teams.find(t => t.id === registrationData.preferredTeamId);
    if (!team) throw new Error('Selected team not found');

    if (!team.players) team.players = [];

    if (team.players.length >= 13) {
      throw new Error(`${team.name} has already reached its maximum squad limit of 13 players. Please select another team.`);
    }

    newPlayer.teamId = team.id;
    team.players.push(newPlayer);
    saveLocalData(data);

    return {
      success: true,
      message: isNotSure
        ? `Registered as an EXTRA for ${team.name}! You are tagged with an [EXTRA] badge on the team roster.`
        : `Congratulations! You have been confirmed in the squad of ${team.name}!`,
      player: newPlayer,
      assignedTo: team.name
    };
  },

  // Admin login check
  async adminLogin(pin) {
    const config = getActiveCloudConfig();
    if (config.isConfigured && config.type === 'custom_api') {
      try {
        const endpoint = `${normalizeCustomApiUrl(config.url)}/admin/login`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        if (res.ok) return true;
      } catch (e) {
        // offline fallback
      }
    }

    if (!isStaticHosting() && !config.isConfigured) {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        if (res.ok) return true;
      } catch (e) {
        // offline fallback
      }
    }

    // Default: Check pin against local data
    const data = getLocalData();
    const validPin = data.tournament?.organizerPin || 'NEXTIAS2610';
    return pin === validPin;
  },

  // Admin fetch full data
  async getAdminData(pin) {
    const config = getActiveCloudConfig();

    if (config.isConfigured && config.type === 'firebase') {
      try {
        const raw = await fetchFirebaseRaw();
        if (raw) return raw;
      } catch (e) {
        console.warn('Firebase admin data fetch failed, using local cache:', e);
      }
    }

    if (config.isConfigured && config.type === 'custom_api') {
      try {
        const endpoint = `${normalizeCustomApiUrl(config.url)}/admin/all-data`;
        const res = await fetch(endpoint, {
          headers: { 'x-organizer-pin': pin }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // fallback
      }
    }

    if (!isStaticHosting() && !config.isConfigured) {
      try {
        const res = await fetch('/api/admin/all-data', {
          headers: { 'x-organizer-pin': pin }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // fallback
      }
    }

    return getLocalData();
  },

  // Admin update player (reassign team, role, attendance)
  async updatePlayer(pin, updatePayload) {
    const config = getActiveCloudConfig();

    if (config.isConfigured && config.type === 'firebase') {
      let data = await fetchFirebaseRaw();
      if (!data) data = getLocalData();

      let player = null;
      for (const t of data.teams) {
        const idx = (t.players || []).findIndex(p => p.id === updatePayload.playerId);
        if (idx !== -1) {
          player = t.players.splice(idx, 1)[0];
          break;
        }
      }
      if (!player) {
        const idx = (data.reservePool || []).findIndex(p => p.id === updatePayload.playerId);
        if (idx !== -1) {
          player = data.reservePool.splice(idx, 1)[0];
        }
      }

      if (player) {
        if (updatePayload.attendance) player.attendance = updatePayload.attendance;
        if (updatePayload.role) player.role = updatePayload.role;
        if (typeof updatePayload.isWicketKeeper === 'boolean') player.isWicketKeeper = updatePayload.isWicketKeeper;

        if (updatePayload.targetTeamId === 'reserve') {
          player.teamId = 'reserve';
          if (!data.reservePool) data.reservePool = [];
          data.reservePool.push(player);
        } else {
          const team = data.teams.find(t => t.id === updatePayload.targetTeamId);
          if (team) {
            player.teamId = team.id;
            if (!team.players) team.players = [];
            team.players.push(player);
          }
        }
        await saveFirebaseRaw(data);
        return { success: true, player };
      }
      throw new Error('Player not found');
    }

    if (config.isConfigured && config.type === 'custom_api') {
      const endpoint = `${normalizeCustomApiUrl(config.url)}/admin/update-player`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organizer-pin': pin
        },
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) return await res.json();
      throw new Error('Failed to update player via custom API');
    }

    if (!isStaticHosting() && !config.isConfigured) {
      try {
        const res = await fetch('/api/admin/update-player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-organizer-pin': pin
          },
          body: JSON.stringify(updatePayload)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // fallback
      }
    }

    // Local storage fallback
    const data = getLocalData();
    let player = null;
    for (const t of data.teams) {
      const idx = (t.players || []).findIndex(p => p.id === updatePayload.playerId);
      if (idx !== -1) {
        player = t.players.splice(idx, 1)[0];
        break;
      }
    }
    if (!player) {
      const idx = (data.reservePool || []).findIndex(p => p.id === updatePayload.playerId);
      if (idx !== -1) {
        player = data.reservePool.splice(idx, 1)[0];
      }
    }

    if (player) {
      if (updatePayload.attendance) player.attendance = updatePayload.attendance;
      if (updatePayload.role) player.role = updatePayload.role;
      if (typeof updatePayload.isWicketKeeper === 'boolean') player.isWicketKeeper = updatePayload.isWicketKeeper;

      if (updatePayload.targetTeamId === 'reserve') {
        player.teamId = 'reserve';
        data.reservePool.push(player);
      } else {
        const team = data.teams.find(t => t.id === updatePayload.targetTeamId);
        if (team) {
          player.teamId = team.id;
          if (!team.players) team.players = [];
          team.players.push(player);
        }
      }
      saveLocalData(data);
      return { success: true, player };
    }
    throw new Error('Player not found');
  },

  // Update match fixture (status, score, winner) and auto-advance
  async updateMatch(pin, matchPayload) {
    const config = getActiveCloudConfig();

    if (config.isConfigured && config.type === 'firebase') {
      let data = await fetchFirebaseRaw();
      if (!data) data = getLocalData();

      data.fixtures = data.fixtures || INITIAL_FALLBACK_DATA.fixtures;
      const match = data.fixtures.find(m => m.id === matchPayload.matchId);
      if (!match) throw new Error('Match fixture not found');

      if (matchPayload.status) match.status = matchPayload.status;
      if (matchPayload.scores) match.scores = { ...match.scores, ...matchPayload.scores };
      if (matchPayload.summary !== undefined) match.summary = matchPayload.summary;

      if (matchPayload.winnerTeamId !== undefined) {
        if (matchPayload.winnerTeamId) {
          match.winnerTeamId = matchPayload.winnerTeamId;
          const team = (data.teams || []).find(t => t.id === matchPayload.winnerTeamId);
          match.winnerTeamName = team ? team.name : (matchPayload.winnerTeamId === match.team1Id ? match.team1Name : match.team2Name);
          match.status = 'Completed';
        } else {
          match.winnerTeamId = null;
          match.winnerTeamName = null;
        }
      }

      data.fixtures = advanceKnockoutFixtures(data.fixtures, data.teams || []);
      await saveFirebaseRaw(data);
      return { success: true, fixtures: data.fixtures };
    }

    if (config.isConfigured && config.type === 'custom_api') {
      const endpoint = `${normalizeCustomApiUrl(config.url)}/admin/update-match`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organizer-pin': pin
        },
        body: JSON.stringify(matchPayload)
      });
      if (res.ok) return await res.json();
    }

    if (!isStaticHosting() && !config.isConfigured) {
      try {
        const res = await fetch('/api/admin/update-match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-organizer-pin': pin
          },
          body: JSON.stringify(matchPayload)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // fallback to local
      }
    }

    const data = getLocalData();
    data.fixtures = data.fixtures || INITIAL_FALLBACK_DATA.fixtures;
    const match = data.fixtures.find(m => m.id === matchPayload.matchId);
    if (!match) throw new Error('Match fixture not found');

    if (matchPayload.status) match.status = matchPayload.status;
    if (matchPayload.scores) match.scores = { ...match.scores, ...matchPayload.scores };
    if (matchPayload.summary !== undefined) match.summary = matchPayload.summary;

    if (matchPayload.winnerTeamId !== undefined) {
      if (matchPayload.winnerTeamId) {
        match.winnerTeamId = matchPayload.winnerTeamId;
        const team = (data.teams || []).find(t => t.id === matchPayload.winnerTeamId);
        match.winnerTeamName = team ? team.name : (matchPayload.winnerTeamId === match.team1Id ? match.team1Name : match.team2Name);
        match.status = 'Completed';
      } else {
        match.winnerTeamId = null;
        match.winnerTeamName = null;
      }
    }

    data.fixtures = advanceKnockoutFixtures(data.fixtures, data.teams || []);
    saveLocalData(data);
    return { success: true, fixtures: data.fixtures };
  },

  // Reset fixtures back to initial tournament schedule
  async resetFixtures(pin) {
    const config = getActiveCloudConfig();

    if (config.isConfigured && config.type === 'firebase') {
      let data = await fetchFirebaseRaw();
      if (!data) data = getLocalData();
      data.fixtures = JSON.parse(JSON.stringify(INITIAL_FALLBACK_DATA.fixtures));
      await saveFirebaseRaw(data);
      return { success: true, fixtures: data.fixtures };
    }

    const data = getLocalData();
    data.fixtures = JSON.parse(JSON.stringify(INITIAL_FALLBACK_DATA.fixtures));
    saveLocalData(data);
    return { success: true, fixtures: data.fixtures };
  }
};
