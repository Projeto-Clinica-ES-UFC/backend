import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);

const prefixes = {
  jwt: "jwt",
  ip: "ip",
} as const;

/**
 * Generates a new ID with the given prefix.
 * @param {keyof typeof prefixes} prefix - The prefix to be added to the ID.
 * @returns {string} - The newly generated ID.
 */
export function generateId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], nanoid(32)].join("_");
}
