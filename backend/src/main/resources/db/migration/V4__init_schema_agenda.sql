CREATE SCHEMA IF NOT EXISTS schema_agenda;

CREATE TABLE schema_agenda.calendar_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Reference to schema_users or leader
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- REHEARSAL, GIG, CLASS, MEETING, etc.
    reference_id UUID, -- Optional reference to band_id or other entity
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE schema_agenda.event_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL REFERENCES schema_agenda.calendar_entries(id),
    reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
    method VARCHAR(50) NOT NULL, -- EMAIL, PUSH, IN_APP
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE schema_agenda.rsvp_confirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL REFERENCES schema_agenda.calendar_entries(id),
    user_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL, -- CONFIRMED, DECLINED, MAYBE
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(entry_id, user_id)
);

CREATE INDEX idx_calendar_entries_time ON schema_agenda.calendar_entries(start_time, end_time) WHERE deleted_at IS NULL;
CREATE INDEX idx_calendar_entries_user ON schema_agenda.calendar_entries(user_id) WHERE deleted_at IS NULL;
