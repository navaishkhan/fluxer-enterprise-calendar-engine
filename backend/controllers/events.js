const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Create a new event (User Story: Hazel)
exports.createEvent = async (req, res) => {
    const { communityId, name, description, startTime, endTime, rrule, channelId, password } = req.body;
    const userId = req.user.id;

    // Check permissions
    const permissions = await db.query('SELECT permissions FROM community_members WHERE user_id = $1 AND community_id = $2', [userId, communityId]);
    if (!permissions.rows[0]?.permissions.includes('manage_events') && !permissions.rows[0]?.permissions.includes('create_events')) {
        return res.status(403).json({ error: 'Missing create_events permission' });
    }

    try {
        await db.query('BEGIN');
        
        // Hash password if provided for secure events
        let passwordHash = null;
        if (password) {
            const bcrypt = require('bcrypt');
            passwordHash = await bcrypt.hash(password, 10);
        }

        const newEvent = await db.query(
            `INSERT INTO calendar_events (community_id, channel_id, creator_id, name, description, start_time, end_time, rrule, password_hash)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [communityId, channelId, userId, name, description, startTime, endTime, rrule, passwordHash]
        );

        // Auto-RSVP the creator (Hazel)
        await db.query(
            `INSERT INTO event_attendees (event_id, user_id, status) VALUES ($1, $2, 'attending')`,
            [newEvent.rows[0].id, userId]
        );

        await db.query('COMMIT');
        
        // Emit to WebSocket for real-time calendar updates
        req.io.to(`community_${communityId}`).emit('EVENT_CREATED', newEvent.rows[0]);
        
        res.status(201).json(newEvent.rows[0]);
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to create event' });
    }
};

// Subscribe / RSVP to an event (User Story: Megan)
exports.toggleRsvp = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    const existing = await db.query('SELECT * FROM event_attendees WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
    
    if (existing.rowCount > 0) {
        // Un-RSVP
        await db.query('DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
        res.json({ attending: false });
    } else {
        // RSVP
        await db.query('INSERT INTO event_attendees (event_id, user_id, status) VALUES ($1, $2, $3)', [eventId, userId, 'attending']);
        res.json({ attending: true });
    }
};

// Get personal calendar (My Journal - User Story: Megan)
exports.getPersonalCalendar = async (req, res) => {
    const userId = req.user.id;
    
    // Fetch all events across all communities the user is attending
    const events = await db.query(`
        SELECT ce.*, c.name as community_name 
        FROM calendar_events ce
        JOIN event_attendees ea ON ce.id = ea.event_id
        JOIN communities c ON ce.community_id = c.id
        WHERE ea.user_id = $1
        ORDER BY ce.start_time ASC
    `, [userId]);
    
    res.json(events.rows);
};
