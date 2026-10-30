"use server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
export async function disablePreview() {
  (await draftMode()).disable();
  redirect("/");
}
