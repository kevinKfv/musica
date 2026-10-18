CREATE SCHEMA IF NOT EXISTS schema_social;

CREATE TABLE schema_social.posts (
    id UUID PRIMARY KEY,
    author_id UUID NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_social.post_media (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES schema_social.posts(id) ON DELETE CASCADE,
    media_url VARCHAR(1024) NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- IMAGE, VIDEO, AUDIO
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_social.comments (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES schema_social.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_social.reactions (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES schema_social.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    reaction_type VARCHAR(50) NOT NULL, -- LIKE, LOVE, HAHA, WOW, SAD, ANGRY
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

CREATE TABLE schema_social.followers (
    id UUID PRIMARY KEY,
    follower_id UUID NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, target_id)
);
