import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fromQuery = req.nextUrl.searchParams.get("secret");
  const path = req.nextUrl.searchParams.get("path");

  if (fromQuery != process.env.MY_SECRET_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  if (!path) {
    return NextResponse.json({ message: "Missing path parameter" }, { status: 400 });
  }
  try {
    if (path) {
      revalidatePath(path, "page");
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }
  } catch (e) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
