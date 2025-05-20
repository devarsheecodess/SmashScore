import React from 'react'

const ScoreTournaments = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">Score Tournaments</h1>
            <div className="flex justify-center mt-5">
                <form className="w-full max-w-sm">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tournamentId">
                            Tournament ID
                        </label>
                        <input
                            type="text"
                            id="tournamentId"
                            placeholder="Enter Tournament ID"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Score Tournament
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ScoreTournaments
