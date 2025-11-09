// src/utils/session.ts
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../plugins/auth.js";

export async function getSession(request: any) {
  return auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });
}
