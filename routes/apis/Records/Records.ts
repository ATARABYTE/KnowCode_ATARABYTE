import { Hono } from "hono";
import { Database } from "bun:sqlite";
import Post from "./Post";
import Put from "./Put";
import Delete from "./Delete";
import Get from "./Get";
import GetById from "./GetById";

const db = new Database("db/db.sqlite");

db.run(`
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Auto-incrementing primary key
        parent_name TEXT NOT NULL UNIQUE,               -- Parent's name (required, unique)
        parent_email TEXT NOT NULL UNIQUE,              -- Parent's email (required, unique)
        parent_phone_number TEXT NOT NULL UNIQUE,       -- Parent's phone number (required, unique)
        parent_pickup_code TEXT NOT NULL UNIQUE,        -- Unique pickup code for the parent (required)
        child_name TEXT NOT NULL UNIQUE,                -- Child's name (required, unique)
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,       -- Timestamp of record creation
        parent_img_url TEXT,                            -- Parent's image URL (optional)
        child_img_url TEXT                              -- Child's image URL (optional)
    )
`);

const app = new Hono()

app.get("/", (c) => Get(c, db));
app.get("/:id", (c) => GetById(c, db));
app.post("/", (c) => Post(c, db));
app.put("/:id", (c) => Put(c, db));
app.delete("/:id", (c) => Delete(c, db));

export default app