import React, { useState } from 'react';
import { Trophy, Users, Award, Target, ArrowLeft } from 'lucide-react';

export default function GolfTournamentTracker() {
  const courseData = {
    name: "Recreation Park 18",
    tees: "White",
    holes: [
      { number: 1, par: 4, handicap: 15, yardage: 288 },
      { number: 2, par: 4, handicap: 13, yardage: 288 },
      { number: 3, par: 4, handicap: 5, yardage: 394 },
      { number: 4, par: 4, handicap: 9, yardage: 346 },
      { number: 5, par: 3, handicap: 17, yardage: 133 },
      { number: 6, par: 4, handicap: 1, yardage: 454 },
      { number: 7, par: 4, handicap: 3, yardage: 416 },
      { number: 8, par: 4, handicap: 7, yardage: 402 },
      { number: 9, par: 5, handicap: 11, yardage: 443 },
      { number: 10, par: 4, handicap: 2, yardage: 415 },
      { number: 11, par: 4, handicap: 10, yardage: 348 },
      { number: 12, par: 3, handicap: 16, yardage: 129 },
      { number: 13, par: 4, handicap: 14, yardage: 290 },
      { number: 14, par: 5, handicap: 4, yardage: 508 },
      { number: 15, par: 4, handicap: 12, yardage: 325 },
      { number: 16, par: 3, handicap: 18, yardage: 129 },
      { number: 17, par: 5, handicap: 6, yardage: 468 },
      { number: 18, par: 4, handicap: 8, yardage: 379 }
    ]
  };

  const [teams, setTeams] = useState([
    { 
      id: 1, 
      name: 'Team 1', 
      group: 'A', 
      players: [
        { id: 1, name: 'Andy Yang', handicap: 22.9, scores: Array(18).fill(null) },
        { id: 2, name: 'Eugene Yum', handicap: 7, scores: Array(18).fill(null) },
        { id: 3, name: 'John Wong', handicap: 38.7, scores: Array(18).fill(null) },
        { id: 4, name: 'Jon Chen', handicap: 25, scores: Array(18).fill(null) }
      ]
    },
    { 
      id: 2, 
      name: 'Team 2', 
      group: 'B', 
      players: [
        { id: 5, name: 'Eliot Cho', handicap: 25, scores: Array(18).fill(null) },
        { id: 6, name: 'Steve Kang', handicap: 15, scores: Array(18).fill(null) },
        { id: 7, name: 'Brandon Li', handicap: 29.9, scores: Array(18).fill(null) },
        { id: 8, name: 'Derek Taing', handicap: 38, scores: Array(18).fill(null) }
      ]
    }
  ]);

  const pairings = [
    {
      id: 1,
      name: 'Match 1',
      team1Players: [1, 2], // Andy Yang, Eugene Yum
      team2Players: [5, 6]  // Eliot Cho, Steve Kang
    },
    {
      id: 2,
      name: 'Match 2',
      team1Players: [4, 3], // Jon Chen, John Wong
      team2Players: [7, 8]  // Brandon Li, Derek Taing
    }
  ];

  const [selectedPairing, setSelectedPairing] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [viewMode, setViewMode] = useState('pairings'); // 'pairings', 'leaderboard', or 'scorecard'

  const getPlayer = (playerId) => {
    for (const team of teams) {
      const player = team.players.find(p => p.id === playerId);
      if (player) return { ...player, teamId: team.id, teamName: team.name };
    }
    return null;
  };

  const getStrokesForHole = (playerHandicap, holeHandicap) => {
    const roundedHandicap = Math.round(playerHandicap);
    if (roundedHandicap >= holeHandicap) {
      return Math.floor(roundedHandicap / 18) + (holeHandicap <= (roundedHandicap % 18) ? 1 : 0);
    }
    return Math.floor(roundedHandicap / 18);
  };

  const updatePlayerScore = (teamId, playerId, holeIndex, score) => {
    setTeams(teams.map(t =>
      t.id === teamId
        ? {
            ...t,
            players: t.players.map(p =>
              p.id === playerId
                ? { ...p, scores: p.scores.map((s, i) => i === holeIndex ? (score === '' ? null : parseInt(score)) : s) }
                : p
            )
          }
        : t
    ));
  };

  const calculatePlayerTotal = (player) => {
    return player.scores.reduce((sum, score) => sum + (score || 0), 0);
  };

  const calculateTeamGrossScore = (team) => {
    return team.players.reduce((sum, player) => sum + calculatePlayerTotal(player), 0);
  };

  const calculateTeamNetScore = (team) => {
    const grossScore = calculateTeamGrossScore(team);
    const totalHandicap = team.players.reduce((sum, p) => sum + p.handicap, 0);
    return grossScore - totalHandicap;
  };

  const getLeaderboard = (group) => {
    return teams
      .filter(t => t.group === group)
      .map(t => ({ 
        ...t, 
        grossScore: calculateTeamGrossScore(t),
        netScore: calculateTeamNetScore(t) 
      }))
      .sort((a, b) => a.netScore - b.netScore);
  };

  // Scorecard View
  if (viewMode === 'scorecard' && selectedPlayer) {
    const playerData = getPlayer(selectedPlayer);
    if (!playerData) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <button
              onClick={() => {
                setViewMode(selectedPairing ? 'pairing-detail' : 'pairings');
                setSelectedPlayer(null);
              }}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{playerData.name}</h1>
                <p className="text-gray-600">Handicap: {playerData.handicap} • {playerData.teamName}</p>
                <p className="text-sm text-gray-500 mt-1">{courseData.name} - {courseData.tees} Tees</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Gross Score</div>
                <div className="text-4xl font-bold text-green-600">{calculatePlayerTotal(playerData) || '-'}</div>
                <div className="text-sm text-gray-600 mt-1">Net: {calculatePlayerTotal(playerData) ? (calculatePlayerTotal(playerData) - playerData.handicap).toFixed(1) : '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 text-left">Hole</th>
                  {courseData.holes.slice(0, 9).map(hole => (
                    <th key={hole.number} className="p-3 text-center">{hole.number}</th>
                  ))}
                  <th className="p-3 text-center bg-gray-700">OUT</th>
                  {courseData.holes.slice(9).map(hole => (
                    <th key={hole.number} className="p-3 text-center">{hole.number}</th>
                  ))}
                  <th className="p-3 text-center bg-gray-700">IN</th>
                  <th className="p-3 text-center bg-gray-900">TOT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  <td className="p-3 font-semibold">Par</td>
                  {courseData.holes.slice(0, 9).map(hole => (
                    <td key={hole.number} className="p-3 text-center">{hole.par}</td>
                  ))}
                  <td className="p-3 text-center font-semibold">36</td>
                  {courseData.holes.slice(9).map(hole => (
                    <td key={hole.number} className="p-3 text-center">{hole.par}</td>
                  ))}
                  <td className="p-3 text-center font-semibold">36</td>
                  <td className="p-3 text-center font-semibold bg-gray-200">72</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-semibold">HCP</td>
                  {courseData.holes.slice(0, 9).map(hole => (
                    <td key={hole.number} className="p-3 text-center text-xs">{hole.handicap}</td>
                  ))}
                  <td className="p-3"></td>
                  {courseData.holes.slice(9).map(hole => (
                    <td key={hole.number} className="p-3 text-center text-xs">{hole.handicap}</td>
                  ))}
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="p-3 font-semibold">Strokes</td>
                  {courseData.holes.slice(0, 9).map(hole => {
                    const strokes = getStrokesForHole(playerData.handicap, hole.handicap);
                    return (
                      <td key={hole.number} className="p-3 text-center">
                        {strokes > 0 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold">
                            {strokes}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3"></td>
                  {courseData.holes.slice(9).map(hole => {
                    const strokes = getStrokesForHole(playerData.handicap, hole.handicap);
                    return (
                      <td key={hole.number} className="p-3 text-center">
                        {strokes > 0 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold">
                            {strokes}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
                <tr className="bg-white border-t-2 border-gray-300">
                  <td className="p-3 font-semibold">Score</td>
                  {courseData.holes.slice(0, 9).map((hole, idx) => (
                    <td key={hole.number} className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={playerData.scores[idx] === null ? '' : playerData.scores[idx]}
                        onChange={(e) => updatePlayerScore(playerData.teamId, playerData.id, idx, e.target.value)}
                        className="w-12 h-12 text-center border-2 border-gray-300 rounded focus:border-green-500 focus:outline-none text-lg font-semibold"
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold text-lg">
                    {playerData.scores.slice(0, 9).reduce((sum, s) => sum + (s || 0), 0) || '-'}
                  </td>
                  {courseData.holes.slice(9).map((hole, idx) => (
                    <td key={hole.number} className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={playerData.scores[idx + 9] === null ? '' : playerData.scores[idx + 9]}
                        onChange={(e) => updatePlayerScore(playerData.teamId, playerData.id, idx + 9, e.target.value)}
                        className="w-12 h-12 text-center border-2 border-gray-300 rounded focus:border-green-500 focus:outline-none text-lg font-semibold"
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold text-lg">
                    {playerData.scores.slice(9).reduce((sum, s) => sum + (s || 0), 0) || '-'}
                  </td>
                  <td className="p-3 text-center font-bold text-xl bg-green-100">
                    {calculatePlayerTotal(playerData) || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Stroke Allocation Guide</h3>
            <p className="text-gray-600 mb-2">
              With a handicap of <span className="font-semibold">{playerData.handicap}</span>, you receive strokes on the following holes:
            </p>
            <div className="grid grid-cols-9 gap-2 mt-4">
              {courseData.holes.map(hole => {
                const strokes = getStrokesForHole(playerData.handicap, hole.handicap);
                return (
                  <div key={hole.number} className={`p-3 rounded text-center ${strokes > 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50'}`}>
                    <div className="font-bold text-lg">{hole.number}</div>
                    {strokes > 0 && (
                      <div className="text-green-600 font-bold text-sm">{strokes} stroke{strokes > 1 ? 's' : ''}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pairing Detail View
  if (viewMode === 'pairing-detail' && selectedPairing) {
    const pairing = pairings.find(p => p.id === selectedPairing);
    if (!pairing) return null;

    const team1Players = pairing.team1Players.map(id => getPlayer(id));
    const team2Players = pairing.team2Players.map(id => getPlayer(id));

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <button
              onClick={() => {
                setViewMode('pairings');
                setSelectedPairing(null);
              }}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pairings
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{pairing.name}</h1>
                <p className="text-gray-600">{courseData.name} - {courseData.tees} Tees</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[...team1Players, ...team2Players].map(player => (
              <div key={player.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{player.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mt-1">
                      {player.teamName}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlayer(player.id);
                      setViewMode('scorecard');
                    }}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
                  >
                    <Target className="w-4 h-4" />
                    Scorecard
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Handicap:</span>
                    <span className="font-bold text-lg">{player.handicap}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gross Score:</span>
                    <span className="font-bold text-lg">{calculatePlayerTotal(player) || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-semibold">Net Score:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {calculatePlayerTotal(player) ? (calculatePlayerTotal(player) - player.handicap).toFixed(1) : '-'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-3 text-sm text-gray-700">Strokes by Hole</h4>
                  <div className="grid grid-cols-9 gap-1">
                    {courseData.holes.map(hole => {
                      const strokes = getStrokesForHole(player.handicap, hole.handicap);
                      return (
                        <div key={hole.number} className={`text-center p-2 rounded text-xs ${strokes > 0 ? 'bg-green-100 font-bold' : 'bg-gray-50 text-gray-400'}`}>
                          <div>{hole.number}</div>
                          {strokes > 0 && <div className="text-green-600">{strokes}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Pairings View
  const groupATeams = getLeaderboard('A');
  const groupBTeams = getLeaderboard('B');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Golf Tournament</h1>
                <p className="text-sm text-gray-600">{courseData.name} - {courseData.tees} Tees</p>
              </div>
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'pairings' ? 'leaderboard' : 'pairings')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {viewMode === 'pairings' ? 'View Leaderboard' : 'View Pairings'}
            </button>
          </div>
        </div>

        {viewMode === 'leaderboard' ? (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {['A', 'B'].map(group => (
                <div key={group} className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-500" />
                    Group {group} Team Leaderboard
                  </h2>
                  <div className="space-y-2">
                    {(group === 'A' ? groupATeams : groupBTeams).map((team, idx) => (
                      <div
                        key={team.id}
                        className={`p-3 rounded-lg ${
                          idx === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{idx + 1}.</span>
                            <span className="font-semibold">{team.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              Net: {team.netScore ? team.netScore.toFixed(1) : '0.0'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Gross: {team.grossScore}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Individual Leaderboard
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Rank</th>
                      <th className="p-3 text-left">Player</th>
                      <th className="p-3 text-left">Team</th>
                      <th className="p-3 text-center">Handicap</th>
                      <th className="p-3 text-center">Gross</th>
                      <th className="p-3 text-center">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams
                      .flatMap(team => 
                        team.players.map(player => ({
                          ...player,
                          teamName: team.name,
                          teamGroup: team.group,
                          gross: calculatePlayerTotal(player),
                          net: calculatePlayerTotal(player) ? (calculatePlayerTotal(player) - player.handicap) : 0
                        }))
                      )
                      .sort((a, b) => {
                        if (a.gross === 0 && b.gross === 0) return 0;
                        if (a.gross === 0) return 1;
                        if (b.gross === 0) return -1;
                        return a.net - b.net;
                      })
                      .map((player, idx, arr) => {
                        const prevPlayer = idx > 0 ? arr[idx - 1] : null;
                        const rank = player.gross === 0 ? '-' : (prevPlayer && prevPlayer.gross > 0 && prevPlayer.net === player.net ? arr[idx - 1].rank : idx + 1);
                        player.rank = rank;
                        return player;
                      })
                      .map((player, idx) => (
                        <tr key={player.id} className={`border-b ${idx === 0 && player.gross > 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                          <td className="p-3">
                            <span className={`font-bold text-lg ${idx === 0 && player.gross > 0 ? 'text-yellow-600' : ''}`}>
                              {player.rank}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedPlayer(player.id);
                                setViewMode('scorecard');
                              }}
                              className="font-semibold text-green-600 hover:text-green-700 hover:underline text-left"
                            >
                              {player.name}
                            </button>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block text-xs px-2 py-1 rounded ${
                              player.teamName === 'Team 1' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {player.teamName}
                            </span>
                          </td>
                          <td className="p-3 text-center">{player.handicap}</td>
                          <td className="p-3 text-center font-semibold">{player.gross || '-'}</td>
                          <td className="p-3 text-center">
                            <span className="font-bold text-green-600 text-lg">
                              {player.gross ? player.net.toFixed(1) : '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pairings.map(pairing => {
              const team1Players = pairing.team1Players.map(id => getPlayer(id));
              const team2Players = pairing.team2Players.map(id => getPlayer(id));

              return (
                <div key={pairing.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{pairing.name}</h2>
                    <button
                      onClick={() => {
                        setSelectedPairing(pairing.id);
                        setViewMode('pairing-detail');
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Team 1 (Group A)</h3>
                      </div>
                      {team1Players.map(player => (
                        <div key={player.id} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
                          <span className="font-medium">{player.name}</span>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">HC: {player.handicap}</div>
                            <div className="text-xs text-gray-500">
                              {calculatePlayerTotal(player) ? `${calculatePlayerTotal(player)} / ${(calculatePlayerTotal(player) - player.handicap).toFixed(1)}` : '-'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-gray-400 font-bold">VS</div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-red-900">Team 2 (Group B)</h3>
                      </div>
                      {team2Players.map(player => (
                        <div key={player.id} className="flex justify-between items-center py-2 border-b border-red-100 last:border-0">
                          <span className="font-medium">{player.name}</span>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">HC: {player.handicap}</div>
                            <div className="text-xs text-gray-500">
                              {calculatePlayerTotal(player) ? `${calculatePlayerTotal(player)} / ${(calculatePlayerTotal(player) - player.handicap).toFixed(1)}` : '-'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}