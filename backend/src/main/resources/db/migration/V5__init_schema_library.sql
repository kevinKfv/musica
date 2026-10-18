CREATE SCHEMA IF NOT EXISTS schema_library;

CREATE TABLE schema_library.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    artist VARCHAR(200),
    genre VARCHAR(100),
    created_by UUID NOT NULL, -- Reference to user_id (uploader/creator)
    band_id UUID, -- Optional reference to a specific band owning the song
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE schema_library.sheet_music (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES schema_library.songs(id),
    instrument VARCHAR(100) NOT NULL,
    format_type VARCHAR(50) NOT NULL, -- PDF, MUSICXML, CHORD_CHART
    file_url VARCHAR(500) NOT NULL,
    version_number INTEGER NOT NULL DEFAULT 1,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE schema_library.audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES schema_library.songs(id),
    track_type VARCHAR(50) NOT NULL, -- BACKING_TRACK, ORIGINAL, STEM, METRONOME
    file_url VARCHAR(500) NOT NULL,
    duration_seconds INTEGER,
    version_number INTEGER NOT NULL DEFAULT 1,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE schema_library.resource_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL, -- Reference to either sheet_music.id or audio_tracks.id (polymorphic)
    resource_type VARCHAR(50) NOT NULL, -- SHEET_MUSIC, AUDIO_TRACK
    version_number INTEGER NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_songs_band ON schema_library.songs(band_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_sheet_music_song ON schema_library.sheet_music(song_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audio_tracks_song ON schema_library.audio_tracks(song_id) WHERE deleted_at IS NULL;
