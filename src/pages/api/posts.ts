// pages/api/posts.ts
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { description, imageUrl } = req.body;

    const posts = await prisma.post.findMany();
    console.log("posts", posts);

    try {
      const post = await prisma.post.create({
        data: {
          description: description,
          memoryImageUrl: imageUrl,
        },
      });

      res.status(200).json(post);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(405).json({ error: "Method not allowed. Use POST" });
  }
}
