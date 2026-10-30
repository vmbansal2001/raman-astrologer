import { NextResponse, type NextRequest } from "next/server";
import attachments from "@/content/legacy-attachments.json";
import media from "@/content/legacy-media.json";
import mediaRedirects from "@/content/media-redirects.json";
const attachmentMap = attachments as Record<string, string>;
const mediaMap: Record<string, string> = { ...media, ...mediaRedirects };
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/_next/image" || pathname === "/_next/image/") {
    const source = request.nextUrl.searchParams.get("url");
    if (source?.startsWith("/") && !source.startsWith("//")) {
      let sourcePath: string;
      try {
        sourcePath = new URL(source, request.url).pathname;
      } catch {
        return NextResponse.next();
      }
      const destination = mediaMap[sourcePath];
      if (destination) {
        // Previously rendered pages can still request optimized local images.
        // Move that request to the CDN source before the image optimizer runs.
        const optimized = request.nextUrl.clone();
        optimized.searchParams.set("url", destination);
        return NextResponse.redirect(optimized, 308);
      }
    }
  }
  const image = mediaMap[pathname];
  const destination =
    image || attachmentMap[pathname.endsWith("/") ? pathname : `${pathname}/`];
  if (destination)
    return NextResponse.redirect(new URL(destination, request.url), 301);
  const response = NextResponse.next();
  if (request.cookies.has("__prerender_bypass"))
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
export const config = {
  matcher: [
    "/_next/image/:path*",
    "/media/:path*",
    "/((?!api|_next/static|_next/image|media/|fonts/|favicon.ico|icon.svg|opengraph-image).*)",
  ],
};
