// navigating to http://localhost:3000/api/revalidate
// clears cache in dev mode, and calls res.revalidate in production
// works as per the docs

import fs from "fs";
import path from "path";

import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      message: string;
    }
  | { revalidated: Boolean }
  | { cacheCleared: Boolean }
  | string;

const directory = process.cwd() + "/.next/cache/fetch-cache";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("clearing cache");
      fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      });
      return res.json({ cacheCleared: true });
    } else {
      console.log("revalidating");
      await res.revalidate("/");
      return res.json({ revalidated: true });
    }
  } catch (err) {
    console.log("an error occured", err);
    return res.status(500).send("Error revalidating");
  }
}
