import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
export async function GET(request: Request) {
  if (!client || !process.env.SANITY_API_READ_TOKEN)
    return Response.json(
      { error: "Content preview is not connected." },
      { status: 503 },
    );
  return defineEnableDraftMode({
    client: client.withConfig({
      token: process.env.SANITY_API_READ_TOKEN,
      useCdn: false,
    }),
  }).GET(request);
}
