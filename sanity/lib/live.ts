import { defineLive } from "next-sanity/live";
import { client } from "./client";
export const live = client
  ? defineLive({
      client,
      serverToken: process.env.SANITY_API_READ_TOKEN,
      browserToken: process.env.SANITY_API_READ_TOKEN,
    })
  : null;
