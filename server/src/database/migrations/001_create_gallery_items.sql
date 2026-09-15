-- MongoDB collection equivalent: gallery_items is a PostgreSQL table.
-- Each row is like one MongoDB document; each column is like one document field.
CREATE TABLE IF NOT EXISTS gallery_items (
    -- SERIAL auto-generates an integer. PRIMARY KEY uniquely identifies each row,
    -- similar to MongoDB's automatically-created _id/ObjectId field.
    id SERIAL PRIMARY KEY,

    -- VARCHAR(255) stores bounded text. NOT NULL is a database-level guarantee
    -- that every row has a title (similar in intent to `required: true`).
    title VARCHAR(255) NOT NULL,

    -- TEXT stores variable-length text. Without NOT NULL this column may be NULL.
    description TEXT,

    -- We store only the local public path, never the image binary itself.
    image_url TEXT NOT NULL,

    -- DEFAULT lets PostgreSQL supply timestamps when INSERT omits these columns.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
