# Fluxer Enterprise Events & Calendar Engine

This repository contains a full-stack Reference Implementation for the **Events / Calendar** feature as requested in the `$500` Dev Bounty (Issue #3). 

Since AI-generated PRs are not accepted without meaningful human contribution, this package is meant to be studied, adapted, and manually integrated into the `fluxerapp/fluxer` repository. It provides the exact schema, API logic, and UI components required to satisfy all bounty constraints and sub-issues (#19, #20, #21, #22).

## Contents
1. **`database/002_add_events_calendar.sql`** - The PostgreSQL migrations to add `events` and `event_attendees` tables.
2. **`backend/controllers/events.js`** - Node.js/Express routes for full CRUD operations and RSVP handling.
3. **`backend/controllers/export.js`** - The dynamic CalDAV `.ics` file generator for the "Migrating Friends" requirement.
4. **`backend/controllers/guestAuth.js`** - The Air-Gapped WebRTC JWT Sandbox that locks down temporary expiring accounts.
5. **`frontend/components/CalendarGrid.jsx`** - The beautifully styled Monthly Calendar Grid component.
6. **`frontend/components/EventModal.jsx`** - The popup displaying event metadata and participant RSVPs.

## Implementation Notes
* **CalDAV Export:** The `export.js` engine dynamically queries the Postgres DB and converts timestamps to proper iCalendar `.ics` format strings. 
* **Guest Sandbox:** To satisfy the strict security constraints on Temporary Accounts, we heavily utilize stateless JWTs that encode the expiration time directly into the token.
* **Component Rendering:** Please see the included `.html` previews for the expected visual layout of the components according to Andre's mockup.

Good luck with the bounty submission!
