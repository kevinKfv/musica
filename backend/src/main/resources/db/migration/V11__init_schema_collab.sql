CREATE SCHEMA IF NOT EXISTS schema_collab;

CREATE TABLE schema_collab.collab_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_collab_owner ON schema_collab.collab_projects(owner_id) WHERE deleted_at IS NULL;

CREATE TABLE schema_collab.audio_stems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES schema_collab.collab_projects(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL,
    file_url VARCHAR(1024) NOT NULL,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_audio_stems_project ON schema_collab.audio_stems(project_id) WHERE deleted_at IS NULL;

CREATE TABLE schema_collab.timeline_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stem_id UUID NOT NULL REFERENCES schema_collab.audio_stems(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    timestamp_seconds INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timeline_comments_stem ON schema_collab.timeline_comments(stem_id);
