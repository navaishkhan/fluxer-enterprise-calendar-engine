import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';

export default function CalendarGrid({ communityId }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock fetch for the reference implementation
    useEffect(() => {
        // fetch('/api/events?community=' + communityId)
        setEvents([
            { id: 1, name: "Super Smash Bros Tournament", startTime: new Date(Date.now() + 86400000), endTime: new Date(Date.now() + 90000000), attendees: 24, location: "Gaming VC" },
            { id: 2, name: "Karaoke Night", startTime: new Date(Date.now() + 172800000), endTime: new Date(Date.now() + 180000000), attendees: 12, location: "Music VC" }
        ]);
    }, [communityId]);

    const renderDays = () => {
        // Simplified calendar grid logic for the reference UI
        const days = [];
        for (let i = 1; i <= 31; i++) {
            const hasEvent = events.find(e => e.startTime.getDate() === i);
            days.push(
                <div key={i} className={`min-h-[120px] p-2 border border-gray-800 transition-colors ${hasEvent ? 'bg-[#151921] hover:bg-[#1A1F29]' : 'bg-[#0F1115]'}`}>
                    <div className="text-gray-500 text-sm font-semibold mb-2">{i}</div>
                    {hasEvent && (
                        <div 
                            onClick={() => setSelectedEvent(hasEvent)}
                            className="bg-blue-600/20 border border-blue-500/50 text-blue-400 text-xs p-1.5 rounded cursor-pointer hover:bg-blue-600/40 transition-colors line-clamp-2 flex flex-col items-start"
                        >
                            <span className="font-bold mr-1">{hasEvent.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="leading-tight">{hasEvent.name}</span>
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="flex-1 bg-[#090A0C] flex flex-col h-full relative">
            
            {/* Header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0F1115]">
                <h1 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Community Events
                </h1>
                <div className="flex space-x-3">
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        Export Calendar
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-colors">
                        + Create Event
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-7 gap-px bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-[#14171C] py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                            {day}
                        </div>
                    ))}
                    {renderDays()}
                </div>
            </div>

            {/* Event Modal Overlay */}
            {selectedEvent && (
                <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </div>
    );
}
