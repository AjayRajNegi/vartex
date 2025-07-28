import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Asynchronous function to enforce admin-only access
export async function requireAdmin() {
  // Attempt to get the user's session from the authentication API, using the request headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/login");
  }

  if (session.user.role !== "admin") {
    return redirect("/not-admin");
  }

  return session;
}
