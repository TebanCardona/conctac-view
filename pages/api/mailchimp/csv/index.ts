import type { NextApiRequest, NextApiResponse } from "next";
import { sendToMailchimp } from "./cvsToArray";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = await sendToMailchimp(req.body);
    return res.status(200).json(data);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
