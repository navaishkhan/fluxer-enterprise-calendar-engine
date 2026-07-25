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
            { id: 2, name: "Code Review", startTime: new Date(Date.now() + 172800000), endTime: new Date(Date.now() + 180000000), attendees: 12, location: "Voice" }
        ]);
    }, [communityId]);

    const renderDays = () => {
        const days = [];
        for (let i = 1; i <= 31; i++) {
            const hasEvent = events.find(e => e.startTime.getDate() === i);
            const isToday = i === 25; // mock today

            days.push(
                <div key={i} className="border-r border-b border-[#202225] relative flex flex-col min-h-[100px]">
                    {isToday ? (
                        <span className="w-7 h-7 flex items-center justify-center bg-[#5865F2] text-white text-xs font-bold rounded mt-2 ml-2">
                            {i}
                        </span>
                    ) : (
                        <span className="text-xs font-bold text-gray-500 ml-3 mt-3 block">{i}</span>
                    )}

                    {hasEvent && (
                        <div 
                            onClick={() => setSelectedEvent(hasEvent)}
                            className="absolute bottom-4 left-3 right-3 bg-[#393C43] text-gray-300 text-xs px-2.5 py-1.5 rounded-md flex items-start z-20 cursor-pointer shadow-md hover:bg-[#43464D] transition-colors"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#5865F2] mr-2 shrink-0 mt-1"></div> 
                            <span className="line-clamp-2 font-medium tracking-wide leading-tight">{hasEvent.name}</span>
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="flex-1 bg-[#36393F] flex flex-col border border-[#202225] rounded-xl overflow-hidden shadow-2xl h-full relative">
            
            {/* Header */}
            <div className="h-16 border-b border-[#202225] flex items-center justify-between px-6 bg-[#36393F]">
                <div className="flex items-center text-gray-400 cursor-pointer hover:text-gray-200 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    <span className="text-sm font-semibold">Filter</span>
                </div>
                <div className="text-white font-bold text-lg flex items-center cursor-pointer">
                    March 2026
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span className="text-sm font-semibold">Export</span>
                    </button>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 flex flex-col bg-[#36393F] overflow-y-auto">
                <div className="grid grid-cols-7 border-b border-[#202225] bg-[#36393F] sticky top-0 z-10">
                    <div className="py-3 text-center text-xs font-bold text-gray-500">Monday</div>
                    <div class="py-3 text-center text-xs font-bold text-gray-500">Tuesday</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-200">Wednesday</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-500">Thursday</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-500">Friday</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-500">Saturday</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-500">Sunday</div>
                </div>
                <div className="grid grid-cols-7 flex-1">
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
