// navigating to http://localhost:3000/api/revalidate
// revalidates up to and including 13.1.6, but not in latest canary

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
    console.log("clearing cache");
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
    if (process.env.NODE_ENV == "production") {
      console.log("revalidating");
      await res.revalidate("/");
      return res.json({ revalidated: true });
    } else {
      return res.json({ cacheCleared: true });
    }
  } catch (err) {
    console.log("an error occured", err);
    return res.status(500).send("Error revalidating");
  }
}
