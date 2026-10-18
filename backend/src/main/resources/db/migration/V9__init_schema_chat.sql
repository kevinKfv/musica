CREATE SCHEMA IF NOT EXISTS schema_chat;

CREATE TABLE schema_chat.conversations (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- DIRECT, GROUP
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_chat.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES schema_chat.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE schema_chat.messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES schema_chat.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
