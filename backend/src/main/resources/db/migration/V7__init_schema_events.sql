CREATE SCHEMA IF NOT EXISTS schema_events;

CREATE TABLE schema_events.events (
    id UUID PRIMARY KEY,
    organizer_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE schema_events.ticket_tiers (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES schema_events.events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    capacity INT NOT NULL,
    available_quantity INT NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE schema_events.tickets (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES schema_events.events(id) ON DELETE CASCADE,
    ticket_tier_id UUID NOT NULL REFERENCES schema_events.ticket_tiers(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL,
    qr_token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);
