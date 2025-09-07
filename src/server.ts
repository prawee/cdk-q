import { serve } from "@hono/node-server";
import app from "./app";

serve({ fetch: app.fetch, port: 3000 }, (server) =>
  console.log(`Server running on port ${server.port}`)
);
