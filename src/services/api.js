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
      name: "Dholpur House Knights",
      shortName: "KNIGHTS",
      tagline: "Interview Ready, Pitch Steady",
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
  ]
};

function getLocalData() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.warn("Error parsing local storage data, reverting to defaults", e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_DATA));
  return INITIAL_FALLBACK_DATA;
}

function saveLocalData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

export const api = {
  // Fetch public data (safe, stripped of student phone numbers)
  async getPublicData() {
    try {
      const res = await fetch('/api/public-data');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Backend not running (e.g. static site preview) -> use local storage
      console.log('Using local client storage fallback for public data');
    }

    const data = getLocalData();
    const sanitizedTeams = data.teams.map(team => ({
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

    const totalAssignedPlayers = sanitizedTeams.reduce((sum, t) => sum + t.players.length, 0);

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
      captainsList: data.captains
    };
  },

  // Register student
  async register(registrationData) {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } catch (err) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      // Offline / LocalStorage fallback
      const data = getLocalData();
      const cleanMobile = String(registrationData.mobile).trim().replace(/\D/g, '').slice(-10);

      // Check duplicates
      let duplicate = false;
      data.teams.forEach(t => {
        if (t.players.some(p => String(p.mobile).slice(-10) === cleanMobile)) duplicate = true;
      });
      if (data.reservePool.some(p => String(p.mobile).slice(-10) === cleanMobile)) duplicate = true;

      if (duplicate) {
        throw new Error('This mobile number is already registered. Please contact organizers.');
      }

      const newPlayer = {
        id: 'p-' + Date.now(),
        name: registrationData.name,
        rollNo: registrationData.rollNo || 'N/A',
        role: registrationData.role,
        isWicketKeeper: !!registrationData.isWicketKeeper,
        battingStyle: registrationData.battingStyle || 'Right Hand',
        bowlingStyle: registrationData.bowlingStyle || 'None',
        mobile: cleanMobile,
        whatsapp: registrationData.whatsapp || cleanMobile,
        attendance: 'Confirmed',
        registeredAt: new Date().toISOString()
      };

      if (registrationData.preferredTeamId === 'reserve') {
        newPlayer.teamId = 'reserve';
        data.reservePool.push(newPlayer);
        saveLocalData(data);
        return { success: true, message: 'Registered into Central Reserve Pool!', player: newPlayer };
      }

      const team = data.teams.find(t => t.id === registrationData.preferredTeamId);
      if (!team) throw new Error('Selected team not found');

      const stats = computeTeamStats(team);
      let available = false;
      if (registrationData.role === 'batsman' && stats.available.batsmen > 0) available = true;
      if (registrationData.role === 'allRounder' && stats.available.allRounders > 0) available = true;
      if (registrationData.role === 'bowler' && stats.available.bowlers > 0) available = true;

      if (available) {
        newPlayer.teamId = team.id;
        team.players.push(newPlayer);
        saveLocalData(data);
        return { success: true, message: `Successfully registered for ${team.name}!`, player: newPlayer, assignedTo: team.name };
      } else if (registrationData.joinReserveIfFull) {
        newPlayer.teamId = 'reserve';
        data.reservePool.push(newPlayer);
        saveLocalData(data);
        return { success: true, message: `Selected slot was full. Placed in Central Reserve Pool.`, player: newPlayer, assignedTo: 'Central Reserve Pool' };
      } else {
        throw new Error(`The ${registrationData.role} slot in ${team.name} is full.`);
      }
    }
  },

  // Admin login check
  async adminLogin(pin) {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      if (res.ok) return true;
    } catch (e) {
      // offline fallback
      return pin === 'NEXTIAS2026';
    }
    return pin === 'NEXTIAS2026';
  },

  // Admin fetch full data (including confidential student contacts)
  async getAdminData(pin) {
    try {
      const res = await fetch('/api/admin/all-data', {
        headers: { 'x-organizer-pin': pin }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.log('Using local client storage fallback for admin data');
    }
    return getLocalData();
  },

  // Admin update player (reassign team, role, attendance)
  async updatePlayer(pin, updatePayload) {
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

    const data = getLocalData();
    let player = null;
    for (const t of data.teams) {
      const idx = t.players.findIndex(p => p.id === updatePayload.playerId);
      if (idx !== -1) {
        player = t.players.splice(idx, 1)[0];
        break;
      }
    }
    if (!player) {
      const idx = data.reservePool.findIndex(p => p.id === updatePayload.playerId);
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
          team.players.push(player);
        }
      }
      saveLocalData(data);
      return { success: true, player };
    }
    throw new Error('Player not found');
  }
};
