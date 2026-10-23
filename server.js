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
  const allRoundersCount = players.filter(p => p.role === 'allRounder').length;
  const bowlersCount = players.filter(p => p.role === 'bowler').length;
  const totalCount = players.length;

  return {
    maxSlots: { batsmen: 5, allRounders: 4, bowlers: 4, total: 13 },
    occupied: { batsmen: batsmenCount, allRounders: allRoundersCount, bowlers: bowlersCount, total: totalCount },
    available: {
      batsmen: Math.max(0, 5 - batsmenCount),
      allRounders: Math.max(0, 4 - allRoundersCount),
      bowlers: Math.max(0, 4 - bowlersCount),
      total: Math.max(0, 13 - totalCount)
    },
    isFull: totalCount >= 13,
    wicketKeepersCount: players.filter(p => p.isWicketKeeper).length
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
      totalExpectedPlayers: data.tournament.totalExpectedPlayers || 108,
      totalAssignedPlayers,
      totalReserve,
      totalRegistered: totalAssignedPlayers + totalReserve,
      rosterSlotsPerTeam: 13,
      totalSlotsAcrossTeams: 104,
      reserveCapacity: data.tournament.reservePoolCapacity || 12
    },
    teams: sanitizedTeams,
    reservePool: sanitizedReserve,
    captainsList: (data.captains || []).map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      teamId: c.teamId
    }))
  });
});

// 2. REGISTRATION ENDPOINT (Validates slots, allows reserve overflow)
app.post('/api/register', (req, res) => {
  const {
    name,
    rollNo,
    mobile,
    whatsapp,
    role,
    isWicketKeeper,
    battingStyle,
    bowlingStyle,
    preferredTeamId,
    joinReserveIfFull
  } = req.body;

  if (!name || !mobile || !role) {
    return res.status(400).json({ error: 'Name, mobile number, and role are mandatory.' });
  }

  const cleanMobile = String(mobile).trim().replace(/\D/g, '').slice(-10);
  if (cleanMobile.length < 10) {
    return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
  }

  const data = readData();

  // Check if player with this mobile number already registered
  let existingPlayer = null;
  for (const t of data.teams) {
    const found = (t.players || []).find(p => String(p.mobile).replace(/\D/g, '').slice(-10) === cleanMobile);
    if (found) {
      existingPlayer = { ...found, teamName: t.name };
      break;
    }
  }
  if (!existingPlayer) {
    const foundReserve = (data.reservePool || []).find(p => String(p.mobile).replace(/\D/g, '').slice(-10) === cleanMobile);
    if (foundReserve) {
      existingPlayer = { ...foundReserve, teamName: 'Central Reserve Pool' };
    }
  }

  if (existingPlayer) {
    return res.status(400).json({
      error: `This mobile number is already registered under ${existingPlayer.name} (${existingPlayer.teamName}). Contact organizers for team changes.`
    });
  }

  const newPlayerId = 'p-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const newPlayer = {
    id: newPlayerId,
    name: name.trim(),
    rollNo: rollNo ? rollNo.trim() : 'N/A',
    role, // 'batsman' | 'allRounder' | 'bowler'
    isWicketKeeper: !!isWicketKeeper,
    battingStyle: battingStyle || 'Right Hand',
    bowlingStyle: bowlingStyle || 'None',
    mobile: cleanMobile,
    whatsapp: whatsapp ? String(whatsapp).trim().replace(/\D/g, '').slice(-10) : cleanMobile,
    attendance: 'Confirmed',
    registeredAt: new Date().toISOString()
  };

  // Check target team or reserve
  if (preferredTeamId === 'reserve') {
    newPlayer.teamId = 'reserve';
    data.reservePool.push(newPlayer);
    writeData(data);
    return res.json({
      success: true,
      message: 'Successfully registered into the Central Reserve Pool!',
      player: newPlayer,
      assignedTo: 'Central Reserve Pool'
    });
  }

  const targetTeam = data.teams.find(t => t.id === preferredTeamId);
  if (!targetTeam) {
    return res.status(400).json({ error: 'Selected team does not exist.' });
  }

  const stats = getTeamStats(targetTeam);

  // Check role slot availability
  let slotAvailable = false;
  if (role === 'batsman' && stats.available.batsmen > 0) slotAvailable = true;
  if (role === 'allRounder' && stats.available.allRounders > 0) slotAvailable = true;
  if (role === 'bowler' && stats.available.bowlers > 0) slotAvailable = true;

  if (slotAvailable) {
    newPlayer.teamId = targetTeam.id;
    targetTeam.players.push(newPlayer);
    writeData(data);
    return res.json({
      success: true,
      message: `Congratulations! You have been allocated a spot in ${targetTeam.name}!`,
      player: newPlayer,
      assignedTo: targetTeam.name
    });
  } else {
    // Slot is full!
    if (joinReserveIfFull) {
      newPlayer.teamId = 'reserve';
      newPlayer.reserveNote = `Requested ${targetTeam.name} (${role}), but slots were full.`;
      data.reservePool.push(newPlayer);
      writeData(data);
      return res.json({
        success: true,
        message: `The ${role} slot for ${targetTeam.name} was already full. You have been placed in the Central Reserve Pool. Organizers may rebalance you.`,
        player: newPlayer,
        assignedTo: 'Central Reserve Pool'
      });
    } else {
      return res.status(409).json({
        error: `All ${role} slots for ${targetTeam.name} are currently full!`,
        available: stats.available
      });
    }
  }
});

// Middleware for Admin authentication via Organizer PIN
function verifyAdminPin(req, res, next) {
  const pin = req.headers['x-organizer-pin'] || req.query.pin || req.body.pin;
  const data = readData();
  const configuredPin = data.tournament.organizerPin || 'NEXTIAS2026';

  if (!pin || pin !== configuredPin) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Organizer PIN.' });
  }
  next();
}

// 3. ADMIN LOGIN CHECK
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const data = readData();
  const configuredPin = data.tournament.organizerPin || 'NEXTIAS2026';

  if (pin === configuredPin) {
    return res.json({ success: true, message: 'Organizer authentication successful.' });
  }
  return res.status(401).json({ error: 'Incorrect Organizer PIN. Default is NEXTIAS2026' });
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

// 6. ADMIN EXPORT CSV
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
