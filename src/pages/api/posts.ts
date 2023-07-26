/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// pages/api/posts.ts
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { description, imageUrl } = req.body;

    const posts = await prisma.memory.findMany();
    console.log("posts", posts);

    try {
      const post = await prisma.memory.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
