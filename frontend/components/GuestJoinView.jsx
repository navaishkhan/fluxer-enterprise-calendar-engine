import React, { useState } from 'react';

export default function GuestJoinView({ eventName, startsAt }) {
    const [guestName, setGuestName] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState(null);

    const handleJoin = async (e) => {
        e.preventDefault();
        setIsJoining(true);
        // const res = await fetch('/api/events/join', { method: 'POST', body: JSON.stringify({ guestName }) });
        // Redirect to Voice Channel if successful, or show error (e.g. "Event not started")
        setTimeout(() => setError("Event has not started yet. Check back at 10:00 PM."), 1000);
    };

    return (
        <div className="min-h-screen bg-[#090A0C] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-[#14171C]/90 backdrop-blur-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden z-10">
                <div className="p-8 text-center border-b border-gray-800 bg-gray-900/50">
                    <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">You've been invited!</h1>
                    <p className="text-gray-400 text-sm">Join <strong className="text-white">Joey</strong> in the event: <br/><span className="text-blue-400 font-semibold">{eventName}</span></p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleJoin}>
                        <div className="mb-6">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">Choose a Guest Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder="Enter a temporary display name"
                                className="w-full p-4 rounded-xl bg-[#0F1115] text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-inner text-lg placeholder-gray-600"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isJoining}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-[0_4px_20px_-5px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center text-lg disabled:opacity-50"
                        >
                            {isJoining ? 'Connecting...' : 'Join Voice Call as Guest'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-xs">
                            No account required. Your session will securely expire when the event ends.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-gray-600 text-sm font-semibold flex items-center">
                Powered by Fluxer Enterprise Calendar Engine
            </div>
        </div>
    );
}
