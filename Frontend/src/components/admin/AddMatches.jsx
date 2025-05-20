import React, { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Clock, Award, Users, UserPlus, X, Save } from 'lucide-react';

const AddMatches = () => {
    const [contentType, setContentType] = useState(null); // 'match' or 'tournament'
    const [matchType, setMatchType] = useState('singles'); // 'singles' or 'doubles'
    const [tournamentMatches, setTournamentMatches] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

    // Match form states
    const [match, setMatch] = useState({
        type: 'singles',
        player1: '',
        player2: '',
        team1Name: '',
        team2Name: '',
        team1Players: ['', ''],
        team2Players: ['', ''],
        date: '',
        time: '',
        location: '',
        totalPoints: '',
        description: ''
    });

    // Tournament form states
    const [tournament, setTournament] = useState({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        prizePool: '',
        numberOfMatches: 1
    });

    // Sample players data (in a real app, this would come from an API)
    const availablePlayers = [
        { id: 1, name: 'Alex Smith', rank: 5, avatar: '/api/placeholder/40/40' },
        { id: 2, name: 'Jordan Lee', rank: 3, avatar: '/api/placeholder/40/40' },
        { id: 3, name: 'Taylor Jones', rank: 7, avatar: '/api/placeholder/40/40' },
        { id: 4, name: 'Casey Wilson', rank: 2, avatar: '/api/placeholder/40/40' },
        { id: 5, name: 'Jamie Rodriguez', rank: 9, avatar: '/api/placeholder/40/40' },
        { id: 6, name: 'Morgan Taylor', rank: 4, avatar: '/api/placeholder/40/40' },
    ];

    const handleMatchChange = (e) => {
        const { name, value } = e.target;
        setMatch(prev => ({ ...prev, [name]: value }));
    };

    const handleTournamentChange = (e) => {
        const { name, value } = e.target;
        setTournament(prev => ({ ...prev, [name]: value }));

        if (name === 'numberOfMatches') {
            // Create empty match objects based on the number of matches
            const matches = [];
            for (let i = 0; i < parseInt(value); i++) {
                matches.push({
                    id: i + 1,
                    type: 'singles',
                    player1: '',
                    player2: '',
                    team1Name: '',
                    team2Name: '',
                    team1Players: ['', ''],
                    team2Players: ['', ''],
                    date: '',
                    time: '',
                    totalPoints: ''
                });
            }
            setTournamentMatches(matches);
        }
    };

    const handleTournamentMatchChange = (matchId, field, value) => {
        setTournamentMatches(prev =>
            prev.map(match =>
                match.id === matchId ? { ...match, [field]: value } : match
            )
        );
    };

    const handleTeamPlayerChange = (teamNumber, playerIndex, value) => {
        if (teamNumber === 1) {
            const updatedPlayers = [...match.team1Players];
            updatedPlayers[playerIndex] = value;
            setMatch(prev => ({ ...prev, team1Players: updatedPlayers }));
        } else {
            const updatedPlayers = [...match.team2Players];
            updatedPlayers[playerIndex] = value;
            setMatch(prev => ({ ...prev, team2Players: updatedPlayers }));
        }
    };

    const handleSubmitMatch = (e) => {
        e.preventDefault();
        // Here you would typically submit the data to your backend
        console.log('Submitting match:', match);
        alert('Match created successfully!');
        // Reset form or redirect
    };

    const handleSubmitTournament = (e) => {
        e.preventDefault();
        // Here you would typically submit the tournament data with its matches
        console.log('Submitting tournament:', { ...tournament, matches: tournamentMatches });
        alert('Tournament created successfully!');
        // Reset form or redirect
    };

    const handleSelectPlayer = (player, position) => {
        setMatch(prev => ({ ...prev, [position]: player.name }));
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const resetForm = () => {
        setContentType(null);
        setMatchType('singles');
        setCurrentStep(1);
        setMatch({
            type: 'singles',
            player1: '',
            player2: '',
            team1Name: '',
            team2Name: '',
            team1Players: ['', ''],
            team2Players: ['', ''],
            date: '',
            time: '',
            location: '',
            totalPoints: '',
            description: ''
        });
        setTournament({
            name: '',
            startDate: '',
            endDate: '',
            location: '',
            description: '',
            prizePool: '',
            numberOfMatches: 1
        });
        setTournamentMatches([]);
    };

    const renderSelectionScreen = () => (
        <div className="flex flex-col space-y-6 items-center justify-center py-10">
            <h1 className="text-2xl font-bold mb-6">What would you like to add?</h1>

            <button
                onClick={() => setContentType('match')}
                className="bg-gray-800 hover:bg-gray-700 w-full max-w-md p-6 rounded-lg flex items-center justify-between transition-all"
            >
                <div className="flex items-center">
                    <Users size={24} className="text-green-500 mr-4" />
                    <span className="text-lg font-medium">Add a Match</span>
                </div>
                <Plus size={20} className="text-green-500" />
            </button>

            <button
                onClick={() => setContentType('tournament')}
                className="bg-gray-800 hover:bg-gray-700 w-full max-w-md p-6 rounded-lg flex items-center justify-between transition-all"
            >
                <div className="flex items-center">
                    <Award size={24} className="text-green-500 mr-4" />
                    <span className="text-lg font-medium">Add a Tournament</span>
                </div>
                <Plus size={20} className="text-green-500" />
            </button>
        </div>
    );

    const renderMatchForm = () => (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={resetForm}
                className="mb-6 flex items-center text-gray-400 hover:text-white"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to selection
            </button>

            <h2 className="text-2xl font-bold mb-6">Add a New Match</h2>

            <form onSubmit={handleSubmitMatch}>
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Match Details</h3>

                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Match Type</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="singles"
                                    checked={match.type === 'singles'}
                                    onChange={handleMatchChange}
                                    className="mr-2 accent-green-500"
                                />
                                <span>Singles</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="doubles"
                                    checked={match.type === 'doubles'}
                                    onChange={handleMatchChange}
                                    className="mr-2 accent-green-500"
                                />
                                <span>Doubles</span>
                            </label>
                        </div>
                    </div>

                    {match.type === 'singles' ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Player 1</label>
                                <input
                                    type="text"
                                    name="player1"
                                    value={match.player1}
                                    onChange={handleMatchChange}
                                    className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter player name"
                                />

                                <div className="mt-4">
                                    <label className="block text-gray-400 mb-2">Or select from available players:</label>
                                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                                        {availablePlayers.map(player => (
                                            <div
                                                key={player.id}
                                                className="flex items-center justify-between bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600"
                                                onClick={() => handleSelectPlayer(player, 'player1')}
                                            >
                                                <div className="flex items-center">
                                                    <img src={player.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                                                    <div>
                                                        <p className="font-medium">{player.name}</p>
                                                        <p className="text-xs text-gray-400">Rank #{player.rank}</p>
                                                    </div>
                                                </div>
                                                <UserPlus size={16} className="text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Player 2</label>
                                <input
                                    type="text"
                                    name="player2"
                                    value={match.player2}
                                    onChange={handleMatchChange}
                                    className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter player name"
                                />

                                <div className="mt-4">
                                    <label className="block text-gray-400 mb-2">Or select from available players:</label>
                                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                                        {availablePlayers.map(player => (
                                            <div
                                                key={player.id}
                                                className="flex items-center justify-between bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600"
                                                onClick={() => handleSelectPlayer(player, 'player2')}
                                            >
                                                <div className="flex items-center">
                                                    <img src={player.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                                                    <div>
                                                        <p className="font-medium">{player.name}</p>
                                                        <p className="text-xs text-gray-400">Rank #{player.rank}</p>
                                                    </div>
                                                </div>
                                                <UserPlus size={16} className="text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Team 1 Name</label>
                                    <input
                                        type="text"
                                        name="team1Name"
                                        value={match.team1Name}
                                        onChange={handleMatchChange}
                                        className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter team name"
                                    />

                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-gray-400 mb-2">Player 1</label>
                                            <input
                                                type="text"
                                                value={match.team1Players[0]}
                                                onChange={(e) => handleTeamPlayerChange(1, 0, e.target.value)}
                                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter player name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Player 2</label>
                                            <input
                                                type="text"
                                                value={match.team1Players[1]}
                                                onChange={(e) => handleTeamPlayerChange(1, 1, e.target.value)}
                                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter player name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Team 2 Name</label>
                                    <input
                                        type="text"
                                        name="team2Name"
                                        value={match.team2Name}
                                        onChange={handleMatchChange}
                                        className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter team name"
                                    />

                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-gray-400 mb-2">Player 1</label>
                                            <input
                                                type="text"
                                                value={match.team2Players[0]}
                                                onChange={(e) => handleTeamPlayerChange(2, 0, e.target.value)}
                                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter player name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Player 2</label>
                                            <input
                                                type="text"
                                                value={match.team2Players[1]}
                                                onChange={(e) => handleTeamPlayerChange(2, 1, e.target.value)}
                                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter player name"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Schedule & Details</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">
                                <Calendar size={16} className="inline mr-2" />
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={match.date}
                                onChange={handleMatchChange}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">
                                <Clock size={16} className="inline mr-2" />
                                Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={match.time}
                                onChange={handleMatchChange}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={match.location}
                                onChange={handleMatchChange}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter match location"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">Total Points</label>
                            <input
                                type="number"
                                name="totalPoints"
                                value={match.totalPoints}
                                onChange={handleMatchChange}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="E.g., 100"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-400 mb-2">Description (Optional)</label>
                        <textarea
                            name="description"
                            value={match.description}
                            onChange={handleMatchChange}
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-24"
                            placeholder="Add any additional details about the match"
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                    >
                        <Save size={18} className="mr-2" />
                        Create Match
                    </button>
                </div>
            </form>
        </div>
    );

    const renderTournamentFormStep1 = () => (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={resetForm}
                className="mb-6 flex items-center text-gray-400 hover:text-white"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to selection
            </button>

            <h2 className="text-2xl font-bold mb-6">Add a New Tournament</h2>

            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">1</div>
                    <div className="h-1 w-16 bg-gray-700 self-center">
                        <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-700'}`}>2</div>
                </div>
                <span className="text-gray-400">Step 1 of 2: Tournament Details</span>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Tournament Name</label>
                        <input
                            type="text"
                            name="name"
                            value={tournament.name}
                            onChange={handleTournamentChange}
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter tournament name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Number of Matches</label>
                        <input
                            type="number"
                            name="numberOfMatches"
                            value={tournament.numberOfMatches}
                            onChange={handleTournamentChange}
                            min="1"
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={tournament.startDate}
                            onChange={handleTournamentChange}
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={tournament.endDate}
                            onChange={handleTournamentChange}
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={tournament.location}
                            onChange={handleTournamentChange}
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter location"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Prize Pool (Optional)</label>
                        <input
                            type="text"
                            name="prizePool"
                            value={tournament.prizePool}
                            onChange={handleTournamentChange}
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="E.g., $1000"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-gray-400 mb-2">Description (Optional)</label>
                    <textarea
                        name="description"
                        value={tournament.description}
                        onChange={handleTournamentChange}
                        className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-24"
                        placeholder="Add any additional details about the tournament"
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                    Next: Add Matches
                </button>
            </div>
        </div>
    );

    const renderTournamentFormStep2 = () => (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={prevStep}
                className="mb-6 flex items-center text-gray-400 hover:text-white"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to tournament details
            </button>

            <h2 className="text-2xl font-bold mb-6">Add Tournament Matches</h2>

            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">1</div>
                    <div className="h-1 w-16 bg-green-500 self-center"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">2</div>
                </div>
                <span className="text-gray-400">Step 2 of 2: Match Details</span>
            </div>

            <form onSubmit={handleSubmitTournament}>
                {tournamentMatches.map((match, index) => (
                    <div key={match.id} className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Match #{match.id}</h3>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    className={`px-3 py-1 rounded ${match.type === 'singles' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => handleTournamentMatchChange(match.id, 'type', 'singles')}
                                >
                                    Singles
                                </button>
                                <button
                                    type="button"
                                    className={`px-3 py-1 rounded ${match.type === 'doubles' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => handleTournamentMatchChange(match.id, 'type', 'doubles')}
                                >
                                    Doubles
                                </button>
                            </div>
                        </div>

                        {match.type === 'singles' ? (
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Player 1"
                                    value={match.player1}
                                    onChange={(e) => handleTournamentMatchChange(match.id, 'player1', e.target.value)}
                                    className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Player 2"
                                    value={match.player2}
                                    onChange={(e) => handleTournamentMatchChange(match.id, 'player2', e.target.value)}
                                    className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4 mb-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Team 1 Name"
                                            value={match.team1Name}
                                            onChange={(e) => handleTournamentMatchChange(match.id, 'team1Name', e.target.value)}
                                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Player 1"
                                                value={match.team1Players ? match.team1Players[0] : ''}
                                                onChange={(e) => {
                                                    const newPlayers = [...(match.team1Players || ['', ''])];
                                                    newPlayers[0] = e.target.value;
                                                    handleTournamentMatchChange(match.id, 'team1Players', newPlayers);
                                                }}
                                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Player 2"
                                                value={match.team1Players ? match.team1Players[1] : ''}
                                                onChange={(e) => {
                                                    const newPlayers = [...(match.team1Players || ['', ''])];
                                                    newPlayers[1] = e.target.value;
                                                    handleTournamentMatchChange(match.id, 'team1Players', newPlayers);
                                                }}
                                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Team 2 Name"
                                            value={match.team2Name}
                                            onChange={(e) => handleTournamentMatchChange(match.id, 'team2Name', e.target.value)}
                                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Player 1"
                                                value={match.team2Players ? match.team2Players[0] : ''}
                                                onChange={(e) => {
                                                    const newPlayers = [...(match.team2Players || ['', ''])];
                                                    newPlayers[0] = e.target.value;
                                                    handleTournamentMatchChange(match.id, 'team2Players', newPlayers);
                                                }}
                                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Player 2"
                                                value={match.team2Players ? match.team2Players[1] : ''}
                                                onChange={(e) => {
                                                    const newPlayers = [...(match.team2Players || ['', ''])];
                                                    newPlayers[1] = e.target.value;
                                                    handleTournamentMatchChange(match.id, 'team2Players', newPlayers);
                                                }}
                                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="date"
                                placeholder="Date"
                                value={match.date}
                                onChange={(e) => handleTournamentMatchChange(match.id, 'date', e.target.value)}
                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="time"
                                placeholder="Time"
                                value={match.time}
                                onChange={(e) => handleTournamentMatchChange(match.id, 'time', e.target.value)}
                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Location"
                                value={match.location}
                                onChange={(e) => handleTournamentMatchChange(match.id, 'location', e.target.value)}
                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="number"
                                placeholder="Total Points"
                                value={match.totalPoints}
                                onChange={(e) => handleTournamentMatchChange(match.id, 'totalPoints', e.target.value)}
                                className="bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">Description (Optional)</label>
                            <textarea
                                placeholder="Add any additional details about the match"
                                value={match.description}
                                onChange={(e) => handleTournamentMatchChange(match.id, 'description', e.target.value)}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-24"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => handleRemoveMatch(match.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                Remove Match
                            </button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleAddMatch}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        Add Another Match
                    </button>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        Create Tournament
                    </button>
                </div>
            </form>
        </div>
    );

    const handleAddMatch = () => {
        setTournamentMatches([...tournamentMatches, { id: Date.now(), type: 'singles', player1: '', player2: '', team1Name: '', team1Players: ['', ''], team2Name: '', team2Players: ['', ''], date: '', time: '', location: '', totalPoints: '', description: '' }]);
    };

    const renderContent = () => {
        if (!contentType) {
            return renderSelectionScreen();
        }

        if (contentType === 'match') {
            return renderMatchForm();
        }

        if (contentType === 'tournament') {
            return currentStep === 1 ? renderTournamentFormStep1() : renderTournamentFormStep2();
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="container mx-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default AddMatches;