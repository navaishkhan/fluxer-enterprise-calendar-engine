import React, { useState, useEffect } from 'react';

export default function EventModal({ event, onClose }) {
    const [isAttending, setIsAttending] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

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

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#292B2F] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-sm border border-[#202225] overflow-hidden flex flex-col transform transition-all">
                
                {/* Header */}
                <div className="h-12 border-b border-[#202225] flex items-center justify-between px-4 bg-[#292B2F]">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="font-bold text-white text-sm">Event Details</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="h-32 bg-[#5865F2] rounded-lg flex items-center justify-center mb-6 shadow-inner">
                        <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>

                    <h2 className="text-white font-bold text-xl mb-1">{event.name}</h2>
                    <div className="flex items-center mb-6">
                        <div className="w-4 h-4 bg-[#5865F2] rounded-full flex items-center justify-center text-[8px] font-bold text-white mr-2">U</div>
                        <span className="text-sm font-semibold text-gray-300">Creator</span>
                    </div>

                    <div className="space-y-4 text-sm text-gray-400 leading-relaxed mb-8">
                        <p>{event.description || "This is a description of our awesome event! We have been planning it for a while."}</p>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-semibold">From:</span>
                            <span className="text-gray-200 font-bold">{event.startTime.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-semibold">Location:</span>
                            <span className="text-gray-200 font-bold flex items-center">
                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                                {event.location}
                            </span>
                        </div>
                        
                        {/* RSVP Action */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#202225]">
                            <div className="flex -space-x-1.5 items-center">
                                <div className="w-6 h-6 rounded-full bg-red-500 border border-[#292B2F]"></div>
                                <div className="w-6 h-6 rounded-full bg-purple-500 border border-[#292B2F]"></div>
                                <div className="w-6 h-6 rounded-full bg-green-500 border border-[#292B2F]"></div>
                                <span className="text-[10px] text-gray-400 font-bold ml-2">+{event.attendees}</span>
                            </div>
                            
                            <button 
                                onClick={() => setIsAttending(!isAttending)}
                                className={`${isAttending ? 'bg-[#393C43] hover:bg-[#40444B]' : 'bg-[#5865F2] hover:bg-[#4752C4]'} text-white text-xs font-bold px-4 py-2 rounded flex items-center transition-colors shadow-md`}
                            >
                                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                {isAttending ? "I'm going" : "Join Event"}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
