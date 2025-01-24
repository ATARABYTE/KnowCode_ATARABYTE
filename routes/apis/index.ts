import { Hono } from "hono";
import Records from "./Records/Records";


export default new Hono()
    .route("/records", Records)