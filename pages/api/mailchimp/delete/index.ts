import { NextApiRequest, NextApiResponse } from "next";
import { delPermanent } from "../exports";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id } = req.query;
    if (!id) return res.status(404).json({ message: "Send an id" });
    try {
      if (typeof id === "string") {
        const data = await delPermanent(id);
        return res.status(200).json({ message: data });
      }
      return res.status(404).json({ message: "Error: Send an email" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
