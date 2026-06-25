import { setupServer } from "msw/node";

/**
 * Shared MSW server for the TMDB HTTP boundary (Seam 1).
 * Tests register per-case handlers with `server.use(...)`.
 */
export const server = setupServer();
