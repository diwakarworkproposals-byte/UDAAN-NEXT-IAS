import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'tournament_data.json');

app.use(cors());
app.use(express.json());

// Helper to read data safely
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data file:', err);
    return { tournament: {}, captains: [], teams: [], reservePool: [] };
  }
}

// Helper to write data safely
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing data file:', err);
    return false;
  }
}

// Compute live team slots statistics
function getTeamStats(team) {
  const players = team.players || [];
  const batsmenCount = players.filter(p => p.role === 'batsman').length;
  const allRoundersCount = players.filter(p => p.role === 'allRounder' || p.role === 'battingAllRounder' || p.role === 'bowlingAllRounder').length;
  const bowlersCount = players.filter(p => p.role === 'bowler').length;
  const wicketKeepersCount = players.filter(p => p.isWicketKeeper).length;
  const totalCount = players.length;

  return {
    maxSlots: { total: 10 },
    counts: { batsmen: batsmenCount, allRounders: allRoundersCount, bowlers: bowlersCount, wicketKeepers: wicketKeepersCount, total: totalCount },
    occupied: { batsmen: batsmenCount, allRounders: allRoundersCount, bowlers: bowlersCount, total: totalCount },
    available: {
      total: Math.max(0, 10 - totalCount)
    },
    isFull: totalCount >= 10,
    wicketKeepersCount
  };
}

// 1. PUBLIC DATA ENDPOINT (Strictly protects student mobile/contact privacy)
app.get('/api/public-data', (req, res) => {
  const data = readData();

  // Strip confidential phone/whatsapp numbers before sending to public clients
  const sanitizedTeams = data.teams.map(team => {
    const stats = getTeamStats(team);
    return {
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      tagline: team.tagline,
      color: team.color,
      accentColor: team.accentColor,
      captainName: team.captainName,
      stats,
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
    };
  });

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
  const totalReserve = sanitizedReserve.length;

  res.json({
    tournament: {
      name: data.tournament.name,
      edition: data.tournament.edition,
      venue: data.tournament.venue,
      telegramGroupUrl: data.tournament.telegramGroupUrl,
      totalExpectedPlayers: data.tournament.totalExpectedPlayers || 84,
      totalAssignedPlayers,
      totalReserve,
      totalRegistered: totalAssignedPlayers + totalReserve,
      rosterSlotsPerTeam: 10,
      totalSlotsAcrossTeams: 80,
      reserveCapacity: data.tournament.reservePoolCapacity || 12
    },
    teams: sanitizedTeams,
    reservePool: sanitizedReserve,
    captainsList: (data.captains || []).map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      teamId: c.teamId
    })),
    fixtures: data.fixtures || []
  });
});

// 2. REGISTRATION ENDPOINT (Validates slots, handles Surely Join vs Not Sure Extras, and 4-slot reserve limit)
app.post('/api/register', (req, res) => {
  const {
    name,
    rollNo,
    role,
    isWicketKeeper,
    battingStyle,
    bowlingStyle,
    preferredTeamId,
    availability, // 'Surely Join' | 'Not Sure'
    extraDestination // 'team' | 'reserve'
  } = req.body;

  if (!name || !rollNo || !role) {
    return res.status(400).json({ error: 'Name, Roll Number/Batch, and Role are mandatory.' });
  }

  const data = readData();
  const cleanRollNo = String(rollNo).trim().toLowerCase();
  const cleanName = String(name).trim().toLowerCase();

  // Check duplicate
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
    return res.status(400).json({
      error: `A candidate with this Name or Roll Number is already registered. Please contact organizers if you need adjustments.`
    });
  }

  const isNotSure = availability === 'Not Sure';
  const isReserveDestination = (preferredTeamId === 'reserve') || (isNotSure && extraDestination === 'reserve');
  const isReserveFull = (data.reservePool || []).length >= 4;

  if (isReserveDestination && isReserveFull) {
    return res.status(400).json({
      error: 'The Central Reserve Pool is currently full (4/4 students max). Please choose an official team to join as an Extra.'
    });
  }

  const newPlayerId = 'p-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const newPlayer = {
    id: newPlayerId,
    name: name.trim(),
    rollNo: rollNo.trim(),
    role,
    isWicketKeeper: !!isWicketKeeper,
    battingStyle: battingStyle || 'Right Hand',
    bowlingStyle: bowlingStyle || 'None',
    attendance: isNotSure ? 'Not Sure' : 'Confirmed',
    isExtra: isNotSure,
    registeredAt: new Date().toISOString()
  };

  // If reserve destination
  if (isReserveDestination) {
    newPlayer.teamId = 'reserve';
    if (!data.reservePool) data.reservePool = [];
    data.reservePool.push(newPlayer);
    writeData(data);
    return res.json({
      success: true,
      message: 'Successfully registered into the Central Reserve Pool (Standby)!',
      player: newPlayer,
      assignedTo: 'Central Reserve Pool'
    });
  }

  const targetTeam = data.teams.find(t => t.id === preferredTeamId);
  if (!targetTeam) {
    return res.status(400).json({ error: 'Selected team does not exist.' });
  }

  if (!targetTeam.players) targetTeam.players = [];

  // If student selected "Not Sure", place as EXTRA directly in the team
  // Enforce 10-player team limit
  if (targetTeam.players.length >= 10) {
    return res.status(409).json({
      error: `${targetTeam.name} has already reached its maximum squad limit of 10 players. Please choose another team.`
    });
  }

  newPlayer.teamId = targetTeam.id;
  targetTeam.players.push(newPlayer);
  writeData(data);

  return res.json({
    success: true,
    message: isNotSure
      ? `Registered as an EXTRA for ${targetTeam.name}! You are tagged with an [EXTRA] badge on the team roster.`
      : `Congratulations! You have been confirmed in the squad of ${targetTeam.name}!`,
    player: newPlayer,
    assignedTo: targetTeam.name
  });
});

// Middleware for Admin authentication via Organizer PIN
function verifyAdminPin(req, res, next) {
  const pin = req.headers['x-organizer-pin'] || req.query.pin || req.body.pin;
  const data = readData();
  const configuredPin = data.tournament.organizerPin || 'NEXTIAS2610';

  if (!pin || pin !== configuredPin) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Organizer PIN.' });
  }
  next();
}

// 3. ADMIN LOGIN CHECK
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const data = readData();
  const configuredPin = data.tournament.organizerPin || 'NEXTIAS2610';

  if (pin === configuredPin) {
    return res.json({ success: true, message: 'Organizer authentication successful.' });
  }
  return res.status(401).json({ error: 'Incorrect Organizer PIN.' });
});

// 4. ADMIN FULL DATA (Includes student phone numbers for event organizers)
app.get('/api/admin/all-data', verifyAdminPin, (req, res) => {
  const data = readData();
  res.json(data);
});

// 5. ADMIN UPDATE PLAYER (Move team, change role, set attendance)
app.post('/api/admin/update-player', verifyAdminPin, (req, res) => {
  const { playerId, targetTeamId, attendance, role, isWicketKeeper, notes } = req.body;
  const data = readData();

  let targetPlayer = null;
  let sourceList = null;

  // Search across teams
  for (const t of data.teams) {
    const idx = (t.players || []).findIndex(p => p.id === playerId);
    if (idx !== -1) {
      targetPlayer = t.players[idx];
      sourceList = t.players;
      sourceList.splice(idx, 1);
      break;
    }
  }

  // Search reserve pool
  if (!targetPlayer) {
    const idx = (data.reservePool || []).findIndex(p => p.id === playerId);
    if (idx !== -1) {
      targetPlayer = data.reservePool[idx];
      sourceList = data.reservePool;
      sourceList.splice(idx, 1);
    }
  }

  if (!targetPlayer) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  // Apply updates
  if (attendance) targetPlayer.attendance = attendance;
  if (role) targetPlayer.role = role;
  if (typeof isWicketKeeper === 'boolean') targetPlayer.isWicketKeeper = isWicketKeeper;
  if (notes) targetPlayer.organizerNotes = notes;

  // Re-insert into designated destination
  if (targetTeamId === 'reserve') {
    targetPlayer.teamId = 'reserve';
    data.reservePool.push(targetPlayer);
  } else {
    const team = data.teams.find(t => t.id === targetTeamId);
    if (team) {
      targetPlayer.teamId = team.id;
      team.players.push(targetPlayer);
    } else {
      // Put back in source if team invalid
      sourceList.push(targetPlayer);
      return res.status(400).json({ error: 'Invalid destination team.' });
    }
  }

  writeData(data);
  res.json({ success: true, message: 'Player updated successfully.', player: targetPlayer });
});

// Auto-advance winners in knockout tournament
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

// 6. ADMIN UPDATE MATCH FIXTURE (Status, scores, winner, and auto-advancement)
app.post('/api/admin/update-match', verifyAdminPin, (req, res) => {
  const { matchId, status, winnerTeamId, scores, summary } = req.body;
  const data = readData();
  data.fixtures = data.fixtures || [];

  const match = data.fixtures.find(m => m.id === matchId);
  if (!match) {
    return res.status(404).json({ error: 'Match fixture not found.' });
  }

  if (status) match.status = status;
  if (scores) match.scores = { ...match.scores, ...scores };
  if (summary !== undefined) match.summary = summary;

  if (winnerTeamId !== undefined) {
    if (winnerTeamId) {
      match.winnerTeamId = winnerTeamId;
      const team = (data.teams || []).find(t => t.id === winnerTeamId);
      match.winnerTeamName = team ? team.name : (winnerTeamId === match.team1Id ? match.team1Name : match.team2Name);
      match.status = 'Completed';
    } else {
      match.winnerTeamId = null;
      match.winnerTeamName = null;
    }
  }

  // Advance knockout winners to subsequent matches
  data.fixtures = advanceKnockoutFixtures(data.fixtures, data.teams || []);
  writeData(data);

  res.json({ success: true, message: 'Match updated and next fixtures generated.', fixtures: data.fixtures });
});

// 7. ADMIN EXPORT CSV
app.get('/api/admin/export-csv', verifyAdminPin, (req, res) => {
  const data = readData();
  const rows = [
    ['Player ID', 'Name', 'Roll/Batch', 'Mobile Number', 'WhatsApp', 'Role', 'Wicketkeeper?', 'Batting Style', 'Bowling Style', 'Assigned Team', 'Attendance Status', 'Registered At']
  ];

  data.teams.forEach(t => {
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

  (data.reservePool || []).forEach(p => {
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

  const csvContent = rows.map(r => r.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="NEXT_IAS_Cricket_Tournament_2026_Rosters.csv"');
  res.send(csvContent);
});

// Serve frontend in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🏏 NEXT IAS Cricket Tournament server running at http://localhost:${PORT}`);
});
