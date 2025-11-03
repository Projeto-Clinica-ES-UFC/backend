import { password as BunPassword } from "bun";

export async function hashPassword(password: string): Promise<string> {
  const hash = await BunPassword.hash(password, {
    algorithm: "argon2d",
    /**
     * The amount of memory to be used by the hash function, in kilobytes.
     */
    memoryCost: 19456,
    /**
     * The time cost is the amount of passes (iterations) used by the hash function
     */
    timeCost: 2,
  });

  return hash;
}

export async function checkPasswordHash(
  hash: string,
  password: string
): Promise<boolean> {
  const isValid = await BunPassword.verify(hash, password);

  return isValid;
}
