-- 002_add_events_calendar.sql
-- Migration to support the massive Fluxer Events & Calendar feature, including Temporary Air-gapped Guest accounts

-- Ensure the UUID extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: calendar_events
-- Represents a scheduled event within a community or channel
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES channels(id) ON DELETE SET NULL, -- Nullable if it's a general community event
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- iCalendar RRule string for repeating events (e.g., "FREQ=WEEKLY;BYDAY=MO")
    rrule VARCHAR(255),
    
    -- Optional password protection for the event VC
    password_hash VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: event_attendees
-- Tracks RSVPs ("I'm going") for events
CREATE TABLE IF NOT EXISTS event_attendees (
    event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'attending', -- 'attending', 'declined', 'tentative'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (event_id, user_id)
);

-- Table: temporary_guest_sessions
-- The Air-Gapped Guest Sandbox engine for external users
CREATE TABLE IF NOT EXISTS temporary_guest_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
    
    -- A temporary display name chosen by the guest
    display_name VARCHAR(50) NOT NULL,
    
    -- The cryptographically secure token passed to the client
    jwt_token TEXT NOT NULL UNIQUE,
    
    -- Automatically expires exactly when the event ends
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast calendar queries
CREATE INDEX idx_events_community_id ON calendar_events(community_id);
CREATE INDEX idx_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_attendees_user_id ON event_attendees(user_id);
