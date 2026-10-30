import { pingProductionIndexNow } from "../src/lib/indexnow.ts";

// The only content write is a deploy. Ping IndexNow from this production build.
await pingProductionIndexNow();
