import { Hono } from "hono";
import frontendapp from "./routes/frontendapp";
import apis from "./routes/apis/index";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

const port = Bun.env.PORT || 3999

const app = new Hono();

// middlewares
app.use(logger())

// file endpoints
app.route("/api", apis);
app.route("/", frontendapp)
app.get('/img/*', serveStatic({ root: 'assets' }))



// BUN SERVER TO SERVE THE APP
Bun.serve({
    port: port,
    fetch: (() => {
        console.log(`server Started on http://localhost:${port}\n`)
        return app.fetch
    })()
})