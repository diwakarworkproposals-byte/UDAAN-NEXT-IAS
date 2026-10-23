// API service with automatic fallback to localStorage for zero-config static hosting
const STORAGE_KEY = 'next_ias_cricket_tournament_data_v1';

const INITIAL_FALLBACK_DATA = {
  tournament: {
    name: "NEXT IAS Cricket Tournament 2026",
    edition: "Annual Championship 2026",
    venue: "Delhi Sports Complex / Ground, New Delhi",
    organizerPin: "NEXTIAS2026",
    telegramGroupUrl: "https://t.me/+NextIasCricket2026",
    totalExpectedPlayers: 108,
    rosterSlotsPerTeam: 13,
    slotBreakdown: { batsmen: 5, allRounders: 4, bowlers: 4 },
    reservePoolCapacity: 12
  },
  captains: [
    { id: "cap-1", name: "Aditya Sharma", role: "Organizer & Captain", teamId: "team-1", mobile: "+91 98112 XXXXX" },
    { id: "cap-2", name: "Rohan Verma", role: "Organizer & Captain", teamId: "team-2", mobile: "+91 98223 XXXXX" },
    { id: "cap-3", name: "Kunal Singh", role: "Volunteer Captain", teamId: "team-3", mobile: "+91 98334 XXXXX" },
    { id: "cap-4", name: "Deepak Patel", role: "Volunteer Captain", teamId: "team-4", mobile: "+91 98445 XXXXX" },
    { id: "cap-5", name: "Vikram Chauhan", role: "Volunteer Captain", teamId: "team-5", mobile: "+91 98556 XXXXX" },
    { id: "cap-6", name: "Aman Tripathi", role: "Volunteer Captain", teamId: "team-6", mobile: "+91 98667 XXXXX" },
    { id: "cap-7", name: "Siddharth Rao", role: "Volunteer Captain", teamId: "team-7", mobile: "+91 98778 XXXXX" },
    { id: "cap-8", name: "Harshvardhan", role: "Volunteer Captain", teamId: "team-8", mobile: "+91 98889 XXXXX" },
    { id: "cap-9", name: "Pooja Mishra", role: "Tournament Co-Director", teamId: null, mobile: "+91 98990 XXXXX" },
    { id: "cap-10", name: "Rahul Deshmukh", role: "Match Referee / Ops Lead", teamId: null, mobile: "+91 98001 XXXXX" }
  ],
  teams: [
    {
      id: "team-1",
      name: "NEXT IAS Titans",
      shortName: "TITANS",
      tagline: "Discipline. Dominance. Victory.",
      color: "from-red-600 to-rose-900",
      accentColor: "#ED1C24",
      captainName: "Aditya Sharma (Organizer)",
      players: [
        { id: "p-cap-1", name: "Aditya Sharma", rollNo: "NEXT-ORG-01", role: "allRounder", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Right-arm Medium", mobile: "9811200001", isCaptain: true, attendance: "Confirmed", teamId: "team-1" }
      ]
    },
    {
      id: "team-2",
      name: "Rajinder Nagar Royals",
      shortName: "ROYALS",
      tagline: "Class, Grace & Relentless Focus",
      color: "from-blue-700 to-indigo-950",
      accentColor: "#0267B1",
      captainName: "Rohan Verma (Organizer)",
      players: [
        { id: "p-cap-2", name: "Rohan Verma", rollNo: "NEXT-ORG-02", role: "batsman", isWicketKeeper: true, battingStyle: "Right Hand", bowlingStyle: "None", mobile: "9822300002", isCaptain: true, attendance: "Confirmed", teamId: "team-2" }
      ]
    },
    {
      id: "team-3",
      name: "Karol Bagh Kings",
      shortName: "KINGS",
      tagline: "Aggression with Academic Calm",
      color: "from-amber-500 to-yellow-800",
      accentColor: "#F59E0B",
      captainName: "Kunal Singh (Volunteer Captain)",
      players: [
        { id: "p-cap-3", name: "Kunal Singh", rollNo: "NEXT-VOL-03", role: "bowler", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Right-arm Fast", mobile: "9833400003", isCaptain: true, attendance: "Confirmed", teamId: "team-3" }
      ]
    },
    {
      id: "team-4",
      name: "Civil Service Strikers",
      shortName: "STRIKERS",
      tagline: "Precision Bowling & Boundary Blitz",
      color: "from-emerald-600 to-teal-900",
      accentColor: "#10B981",
      captainName: "Deepak Patel (Volunteer Captain)",
      players: [
        { id: "p-cap-4", name: "Deepak Patel", rollNo: "NEXT-VOL-04", role: "allRounder", isWicketKeeper: false, battingStyle: "Left Hand", bowlingStyle: "Right-arm Off Spin", mobile: "9844500004", isCaptain: true, attendance: "Confirmed", teamId: "team-4" }
      ]
    },
    {
      id: "team-5",
      name: "CSAT Crusaders",
      shortName: "CRUSADERS",
      tagline: "High Aptitude & Fearless Boundaries",
      color: "from-purple-600 to-violet-950",
      accentColor: "#7C3AED",
      captainName: "Vikram Chauhan (Volunteer Captain)",
      players: [
        { id: "p-cap-5", name: "Vikram Chauhan", rollNo: "NEXT-VOL-05", role: "batsman", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "None", mobile: "9855600005", isCaptain: true, attendance: "Confirmed", teamId: "team-5" }
      ]
    },
    {
      id: "team-6",
      name: "LBSNAA Challengers",
      shortName: "CHALLENGERS",
      tagline: "Destination Mussoorie, Target Cup",
      color: "from-cyan-600 to-blue-900",
      accentColor: "#0891B2",
      captainName: "Aman Tripathi (Volunteer Captain)",
      players: [
        { id: "p-cap-6", name: "Aman Tripathi", rollNo: "NEXT-VOL-06", role: "bowler", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Left-arm Orthodox", mobile: "9866700006", isCaptain: true, attendance: "Confirmed", teamId: "team-6" }
      ]
    },
    {
      id: "team-7",
      name: "Old Rajinder Mavericks",
      shortName: "MAVERICKS",
      tagline: "Midnight Revisions & Matchwinners",
      color: "from-rose-600 to-pink-950",
      accentColor: "#E11D48",
      captainName: "Siddharth Rao (Volunteer Captain)",
      players: [
        { id: "p-cap-7", name: "Siddharth Rao", rollNo: "NEXT-VOL-07", role: "allRounder", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Right-arm Fast Medium", mobile: "9877800007", isCaptain: true, attendance: "Confirmed", teamId: "team-7" }
      ]
    },
    {
      id: "team-8",
      name: "Prelims Powerhitters",
      shortName: "POWERHITTERS",
      tagline: "Clearing Cut-offs & Clearing Boundaries",
      color: "from-orange-600 to-amber-900",
      accentColor: "#EA580C",
      captainName: "Harshvardhan (Volunteer Captain)",
      players: [
        { id: "p-cap-8", name: "Harshvardhan", rollNo: "NEXT-VOL-08", role: "batsman", isWicketKeeper: true, battingStyle: "Left Hand", bowlingStyle: "None", mobile: "9888900008", isCaptain: true, attendance: "Confirmed", teamId: "team-8" }
      ]
    }
  ],
  reservePool: [
    { id: "res-1", name: "Arjun Nair", rollNo: "GS-2026-089", role: "allRounder", isWicketKeeper: false, battingStyle: "Right Hand", bowlingStyle: "Right-arm Leg Break", mobile: "9800000001", teamId: "reserve", attendance: "Confirmed", registeredAt: "2026-10-21T12:00:00.000Z" }
  ],
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
      dateTime: "Match Day 1 • 09:00 AM",
      venue: "NEXT IAS Sports Complex, Pitch A",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "Winner advances to Semi-Final 1",
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
      dateTime: "Match Day 1 • 11:30 AM",
      venue: "NEXT IAS Sports Complex, Pitch B",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "Winner advances to Semi-Final 1",
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
      dateTime: "Match Day 1 • 02:00 PM",
      venue: "NEXT IAS Sports Complex, Pitch A",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "Winner advances to Semi-Final 2",
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
      dateTime: "Match Day 1 • 04:30 PM",
      venue: "NEXT IAS Sports Complex, Pitch B",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "Winner advances to Semi-Final 2",
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
      dateTime: "Match Day 2 • 10:00 AM",
      venue: "NEXT IAS Championship Oval",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "Winner qualifies for Grand Finale",
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
      dateTime: "Match Day 2 • 01:30 PM",
      venue: "NEXT IAS Championship Oval",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "Winner qualifies for Grand Finale",
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
      dateTime: "Match Day 2 • 05:00 PM",
      venue: "NEXT IAS Championship Oval (Floodlights)",
      status: "Upcoming",
      winnerTeamId: null,
      winnerTeamName: null,
      scores: { team1: "", team2: "" },
      summary: "Tournament Championship Trophy Match",
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
  const allRounders = players.filter(p => p.role === 'allRounder').length;
  const bowlers = players.filter(p => p.role === 'bowler').length;
  const total = players.length;

  return {
    maxSlots: { batsmen: 5, allRounders: 4, bowlers: 4, total: 13 },
    occupied: { batsmen, allRounders, bowlers, total },
    available: {
      batsmen: Math.max(0, 5 - batsmen),
      allRounders: Math.max(0, 4 - allRounders),
      bowlers: Math.max(0, 4 - bowlers),
      total: Math.max(0, 13 - total)
    },
    isFull: total >= 13,
    wicketKeepersCount: players.filter(p => p.isWicketKeeper).length
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
    if (isNotSure) {
      newPlayer.teamId = team.id;
      team.players.push(newPlayer);
      saveLocalData(data);
      return {
        success: true,
        message: `Registered as an EXTRA for ${team.name}! You are tagged with an [EXTRA] badge on the team roster.`,
        player: newPlayer,
        assignedTo: team.name
      };
    }

    // Surely Join: check slot availability for Playing 11
    const stats = computeTeamStats(team);
    let available = false;
    if (registrationData.role === 'batsman' && stats.available.batsmen > 0) available = true;
    if (registrationData.role === 'allRounder' && stats.available.allRounders > 0) available = true;
    if (registrationData.role === 'bowler' && stats.available.bowlers > 0) available = true;

    if (available) {
      newPlayer.teamId = team.id;
      team.players.push(newPlayer);
      saveLocalData(data);
      return {
        success: true,
        message: `Congratulations! You have been confirmed in the playing roster of ${team.name}!`,
        player: newPlayer,
        assignedTo: team.name
      };
    } else {
      // Role is full
      throw new Error(`The ${registrationData.role} slot in ${team.name} is currently full. Please select another team or join as an Extra.`);
    }
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
