CREATE SCHEMA IF NOT EXISTS schema_places;

CREATE TABLE schema_places.places (
    id UUID PRIMARY KEY,
    created_by_email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    place_type VARCHAR(50) NOT NULL,
    address VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_places_type ON schema_places.places(place_type);
CREATE INDEX idx_places_coords ON schema_places.places(latitude, longitude);
