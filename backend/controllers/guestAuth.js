const db = require('../db');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.FLUXER_GUEST_SECRET || 'super_secret_guest_key';

// Air-Gapped Temporary Guest Authentication (User Story: Joey's Friends)
// Frictionless onboarding for external friends joining a specific event VC
exports.joinAsGuest = async (req, res) => {
    const { eventId } = req.params;
    const { guestName, password } = req.body;

    const eventResult = await db.query('SELECT * FROM calendar_events WHERE id = $1', [eventId]);
    const event = eventResult.rows[0];

    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    const now = new Date();
    
    // Check if the event has started
    if (now < new Date(event.start_time)) {
        return res.status(403).json({ 
            error: 'Event has not started yet.',
            startsAt: event.start_time
        });
    }

    // Check if the event has ended
    if (now > new Date(event.end_time)) {
        return res.status(403).json({ error: 'Your event is over! Please talk to the Event Exporter for a new link.' });
    }

    // Handle Password Protected VCs
    if (event.password_hash) {
        if (!password) {
            return res.status(401).json({ error: 'Password required' });
        }
        const bcrypt = require('bcrypt');
        const match = await bcrypt.compare(password, event.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid password' });
        }
    }

    // Create the temporary guest session in DB
    const sessionToken = uuidv4();
    
    // Generate the strictly scoped JWT
    // The JWT is ONLY valid for this specific channel_id, creating an Air-Gapped Sandbox
    const guestJwt = jwt.sign(
        {
            isGuest: true,
            sessionId: sessionToken,
            displayName: guestName,
            allowedChannelId: event.channel_id,
            expiresAt: event.end_time
        },
        JWT_SECRET,
        { expiresIn: Math.floor((new Date(event.end_time) - now) / 1000) } // Expires exactly when event ends
    );

    // Save session metadata
    await db.query(
        'INSERT INTO temporary_guest_sessions (id, event_id, display_name, jwt_token, expires_at) VALUES ($1, $2, $3, $4, $5)',
        [sessionToken, event.id, guestName, guestJwt, event.end_time]
    );

    // Drop secure cookie with the JWT
    res.cookie('fluxer_guest_token', guestJwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(event.end_time) // Browser drops it automatically
    });

    res.json({
        message: 'Joined successfully',
        channelId: event.channel_id,
        guestToken: guestJwt
    });
};

// Middleware to enforce Sandbox rules
exports.requireGuestScope = (req, res, next) => {
    const token = req.cookies.fluxer_guest_token || req.headers['x-guest-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Ensure they only touch their authorized channel
        if (req.params.channelId && req.params.channelId !== decoded.allowedChannelId) {
            return res.status(403).json({ error: 'Sandbox Violation: You do not have access to this channel.' });
        }
        
        // Prevent Media uploads
        if (req.path.includes('/upload')) {
            return res.status(403).json({ error: 'Guests cannot upload media.' });
        }

        req.guest = decoded;
        next();
    } catch (err) {
        // If JWT expired (event over)
        res.status(401).json({ error: 'Session expired. The event has concluded.' });
    }
};
