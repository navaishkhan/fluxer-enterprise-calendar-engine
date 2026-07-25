import React, { useState, useEffect } from 'react';

export default function EventModal({ event, onClose }) {
    const [isAttending, setIsAttending] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    // Smart Timezone & Countdown Engine
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = event.startTime - now;
            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`Starts in ${hours}h ${mins}m`);
            } else {
                setTimeLeft('Event is Live!');
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [event.startTime]);

    const handleRsvp = async () => {
        // await fetch(`/api/events/${event.id}/rsvp`, { method: 'POST' });
        setIsAttending(!isAttending);
    };

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#14171C] rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 overflow-hidden transform transition-all">
                
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-8 pt-6 relative">
                    {/* Floating Date Badge */}
                    <div className="absolute -top-12 left-8 bg-[#1A1D24] border-2 border-gray-700 rounded-xl p-3 text-center shadow-xl">
                        <div className="text-red-400 text-xs font-bold uppercase">{event.startTime.toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div className="text-white text-2xl font-black">{event.startTime.getDate()}</div>
                    </div>

                    <div className="flex justify-between items-start mt-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{event.name}</h2>
                            <div className="text-sm font-medium text-blue-400 flex items-center">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {event.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {timeLeft}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                        Join us for an epic night! This event will take place in the dedicated voice channel. 
                        Bring your friends via the external share link!
                    </p>

                    <div className="mt-6 flex items-center space-x-2 bg-[#1A1D24] p-3 rounded-lg border border-gray-800">
                        <div className="bg-gray-800 p-2 rounded-md">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location</div>
                            <div className="text-white text-sm font-semibold flex items-center">
                                {event.location}
                                {timeLeft === 'Event is Live!' && <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-6">
                        <div className="flex -space-x-2">
                            {/* Avatar stack */}
                            <div className="w-8 h-8 rounded-full border-2 border-[#14171C] bg-gradient-to-tr from-yellow-400 to-orange-500"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-[#14171C] bg-gradient-to-tr from-cyan-400 to-blue-500"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-[#14171C] bg-gradient-to-tr from-pink-400 to-purple-500"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-[#14171C] bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold">
                                +{event.attendees}
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                Share
                            </button>
                            <button 
                                onClick={handleRsvp}
                                className={`px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                                    isAttending ? 'bg-gray-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                            >
                                {isAttending ? '✓ Going' : "I'm Going"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
