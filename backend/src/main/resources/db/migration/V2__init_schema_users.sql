CREATE SCHEMA IF NOT EXISTS schema_users;

CREATE TABLE schema_users.user_profiles (
    account_id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_users.actor_role_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES schema_users.user_profiles(account_id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    description TEXT,
    years_of_experience INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_email ON schema_users.user_profiles(email);
CREATE INDEX idx_actor_role_profiles_user ON schema_users.actor_role_profiles(user_profile_id);
