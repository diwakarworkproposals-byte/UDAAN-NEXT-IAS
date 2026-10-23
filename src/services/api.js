// API service with automatic fallback to localStorage for zero-config static hosting
const STORAGE_KEY = 'next_ias_cricket_tournament_data_v8';

const INITIAL_FALLBACK_DATA = {
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

export const api = {
  // Fetch public data (safe, stripped of student phone numbers)
  async getPublicData() {
    if (isStaticHosting()) {
      return formatSanitizedData(getLocalData());
    }

    try {
      const res = await fetch('/api/public-data');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.log('Using local client storage fallback for public data');
    }

    return formatSanitizedData(getLocalData());
  },

  // Register student
  async register(registrationData) {
    if (!isStaticHosting()) {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        // fall through to local storage
      }
    }

    // Static Hosting / LocalStorage handling
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

    // If destination is reserve pool (and not full)
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

    // If student selected "Not Sure", place as EXTRA directly in the team
    // Enforce 13-player team squad limit
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
    if (!isStaticHosting()) {
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
    const data = getLocalData();
    const validPin = data.tournament?.organizerPin || 'NEXTIAS2026';
    return pin === validPin;
  },

  // Admin fetch full data (including confidential student contacts)
  async getAdminData(pin) {
    if (!isStaticHosting()) {
      try {
        const res = await fetch('/api/admin/all-data', {
          headers: { 'x-organizer-pin': pin }
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        // fallback
      }
    }
    return getLocalData();
  },

  // Admin update player (reassign team, role, attendance)
  async updatePlayer(pin, updatePayload) {
    if (!isStaticHosting()) {
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
    if (!isStaticHosting()) {
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
    const data = getLocalData();
    data.fixtures = JSON.parse(JSON.stringify(INITIAL_FALLBACK_DATA.fixtures));
    saveLocalData(data);
    return { success: true, fixtures: data.fixtures };
  }
};
