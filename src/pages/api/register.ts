// /pages/api/register.js

import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Destructure the email and password from the request body
  console.log(req.body);
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if user already exists in Prisma
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a new user in Supabase

    // Create a new user in Prisma
    const prismaUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    return res.status(201).json(prismaUser);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default handler;
