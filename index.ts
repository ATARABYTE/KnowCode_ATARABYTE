import { Hono } from "hono";
import apis from "./routes/apis/index";
import { logger } from "hono/logger";

const port = Bun.env.PORT || 3999

const app = new Hono();

// middlewares
app.use(logger())

// file endpoints
app.route("/api", apis);



// BUN SERVER TO SERVE THE APP
Bun.serve({
    port: port,
    fetch: (() => {
        console.log(`server Started on http://localhost:${port}\n`)
        return app.fetch
    })()
})