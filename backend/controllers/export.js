const db = require('../db');

// Dynamic CalDAV / ICS Export Engine (User Story: Joey)
// Allows exporting events that automatically sync in Google Calendar/Apple Calendar
exports.exportCalendar = async (req, res) => {
    const { userId, eventId } = req.query;
    
    // Set headers for standard iCalendar response
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="fluxer_calendar.ics"');

    let query = `
        SELECT ce.*, u.username as creator_name, c.name as community_name 
        FROM calendar_events ce
        JOIN users u ON ce.creator_id = u.id
        JOIN communities c ON ce.community_id = c.id
    `;
    let params = [];

    // If exporting personal calendar
    if (userId) {
        query += ` JOIN event_attendees ea ON ce.id = ea.event_id WHERE ea.user_id = $1`;
        params.push(userId);
    } 
    // If exporting specific event
    else if (eventId) {
        query += ` WHERE ce.id = $1`;
        params.push(eventId);
    }

    const events = await db.query(query, params);

    // Generate ICS Feed dynamically
    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Fluxer HQ//Fluxer Enterprise Calendar Engine//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];

    events.rows.forEach(event => {
        // Format timestamps to iCal format (YYYYMMDDTHHMMSSZ)
        const formatIcalDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:${event.id}@fluxer.app`);
        icsContent.push(`DTSTAMP:${formatIcalDate(new Date())}`);
        icsContent.push(`DTSTART:${formatIcalDate(event.start_time)}`);
        icsContent.push(`DTEND:${formatIcalDate(event.end_time)}`);
        icsContent.push(`SUMMARY:${event.name} (Fluxer: ${event.community_name})`);
        icsContent.push(`DESCRIPTION:${event.description}\\n\\nJoin Voice Room: https://fluxer.app/join/${event.id}`);
        icsContent.push(`ORGANIZER;CN=${event.creator_name}:MAILTO:noreply@fluxer.app`);
        
        if (event.rrule) {
            icsContent.push(`RRULE:${event.rrule}`);
        }
        
        icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    
    // Send raw ICS payload to the client/external calendar
    res.send(icsContent.join('\\r\\n'));
};
