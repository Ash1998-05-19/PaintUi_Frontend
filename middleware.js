import { NextResponse } from "next/server";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { PROD_URL, UI_URL } from "./utils/constant";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/admin/:path*", "/"],
};

// const navUrl = process.env.NODE_ENV == "development" ? UI_URL : PROD_URL;
const navUrl = UI_URL;
//console.log("navUrl", navUrl);
export default async function middleware(req) {
  try {
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.redirect(`${navUrl}/login`);
    }

    const cleanedToken = token.value.replace(/"/g, "");
    const jwtRes = await jwtVerify(
      cleanedToken,
      new TextEncoder().encode("somethingRandom")
    );
    if (!jwtRes?.payload?.id) {
      return NextResponse.redirect(`${navUrl}/login`);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.redirect(`${navUrl}/login`);
  }
}
