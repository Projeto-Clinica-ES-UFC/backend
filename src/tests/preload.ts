/**
 * Test preload script - Sets up test environment variables BEFORE any imports
 * This file is loaded first via bun's --preload flag
 */

// Set test database BEFORE any other imports happen
process.env.DATABASE_URL = "file:./test.db";
process.env.NODE_ENV = "test";

console.log("[TEST] Using test database: test.db");
