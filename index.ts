import { Hono } from "hono";
import apis from "./routes/apis/index";
import { logger } from "hono/logger";

const port = Bun.env.PORT || 3999

const app = new Hono();


app.use(logger())


app.route("/api", apis);




Bun.serve({
    port: port,
    fetch: (() => {
        console.log(`server Start on http://localhost:${port}\n`)
        return app.fetch
    })()
})