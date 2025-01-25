import { Hono } from "hono";
import Records from "./Records/Records";
import { serveStatic } from "hono/bun";


export default new Hono()
    .route("/records", Records)