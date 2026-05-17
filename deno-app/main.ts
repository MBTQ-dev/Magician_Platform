// main.ts — Fresh entry
import { start } from "fresh/server.ts";
import manifest from "./fresh.gen.ts";

if (import.meta.main) {
  console.log("Starting Deno Fresh app on port 8000");
  start({ port: 8000, manifest });
}
