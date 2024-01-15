-- Add migration script here
CREATE TABLE users (
    id uuid NOT NULL,
    PRIMARY KEY (id),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE users_info (
    id uuid NOT NULL,
    PRIMARY KEY (id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    bio TEXT,
    user_id uuid NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at timestamptz NOT NULL,
    updated_at timestamptz
);

CREATE TABLE posts (
    id uuid NOT NULL,
    PRIMARY KEY (id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_deleted BIT NOT NULL,
    owner_id uuid NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    created_at timestamptz NOT NULL,
    updated_at timestamptz
);

CREATE TABLE posts_likes (
    id uuid NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at timestamptz NOT NULL
);

CREATE TABLE posts_tag (
    id uuid NOT NULL,
    name TEXT NOT NULL,
    post_id uuid NOT NULL,
    created_at timestamptz NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE comments (
    id uuid NOT NULL,
    PRIMARY KEY (id),
    content TEXT NOT NULL,
    post_id uuid NOT NULL,
    owner_id uuid NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    created_at timestamptz NOT NULL,
    updated_at timestamptz
);

CREATE TABLE comments_likes (
    id uuid NOT NULL,
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at timestamptz NOT NULL
);

CREATE TABLE follows (
    id uuid NOT NULL,
    follower_id uuid NOT NULL,
    followee_id uuid NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followee_id ) REFERENCES users(id),
    created_at timestamptz NOT NULL
);
