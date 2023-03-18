// navigating to http://localhost:3000/api/revalidate
// revalidates up to and including 13.1.6, but not in latest canary



import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      message: string;
    }
  | { revalidated: Boolean }
  | string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("revalidating");
    await res.revalidate("/");
    return res.json({ revalidated: true });
  } catch (err) {
    console.log("an error occured", err);
    return res.status(500).send("Error revalidating");
  }
}
