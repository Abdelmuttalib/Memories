import bcrypt from "bcryptjs";

export const comparePasswords = async (
  plaintextPassword: string,
  hashedPassword: string
) => {
  try {
    const match = await bcrypt.compare(plaintextPassword, hashedPassword);
    return match;
  } catch (error) {
    // Handle error
    console.error("Error comparing passwords:", error);
    return false;
  }
};

const SALT_ROUNDS = 10;
export async function hashPassword(plaintextPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(plaintextPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    // Handle error
    console.error("Error hashing password:", error);
    return "";
  }
}
