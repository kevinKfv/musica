CREATE SCHEMA IF NOT EXISTS schema_bands;

CREATE TABLE schema_bands.bands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_bands.band_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID NOT NULL REFERENCES schema_bands.bands(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_bands.band_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID NOT NULL REFERENCES schema_bands.bands(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_bands.rehearsals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID NOT NULL REFERENCES schema_bands.bands(id) ON DELETE CASCADE,
    date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_bands.setlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID NOT NULL REFERENCES schema_bands.bands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_bands.setlist_songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setlist_id UUID NOT NULL REFERENCES schema_bands.setlists(id) ON DELETE CASCADE,
    song_name VARCHAR(255) NOT NULL,
    notes VARCHAR(255),
    song_order INTEGER
);

CREATE INDEX idx_band_members_band ON schema_bands.band_members(band_id);
CREATE INDEX idx_band_members_user ON schema_bands.band_members(user_id);
CREATE INDEX idx_rehearsals_band ON schema_bands.rehearsals(band_id);
CREATE INDEX idx_setlists_band ON schema_bands.setlists(band_id);
