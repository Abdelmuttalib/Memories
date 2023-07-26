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
