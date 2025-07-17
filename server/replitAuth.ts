import type { Express, RequestHandler } from "express";

// Standalone mode - no authentication required
console.log("Running in standalone mode - authentication disabled");

// No session or user management needed in standalone mode

export async function setupAuth(app: Express) {
  console.log("Authentication disabled - running in standalone mode");
  // No authentication setup needed for standalone mode
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // No authentication required in standalone mode
  return next();
};
