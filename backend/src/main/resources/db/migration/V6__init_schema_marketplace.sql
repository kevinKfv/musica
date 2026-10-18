CREATE SCHEMA IF NOT EXISTS schema_marketplace;

CREATE TABLE schema_marketplace.service_offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE schema_marketplace.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_offering_id UUID NOT NULL REFERENCES schema_marketplace.service_offerings(id),
    client_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_marketplace.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES schema_marketplace.bookings(id),
    reviewer_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_offerings_provider ON schema_marketplace.service_offerings(provider_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookings_service ON schema_marketplace.bookings(service_offering_id);
CREATE INDEX idx_bookings_client ON schema_marketplace.bookings(client_id);
