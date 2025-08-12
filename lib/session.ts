// /lib/session.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) return null;

  return {
    email: session.user.email,
    name: session.user.name || null,
    id: (session.user as any).id || null, // You may need to inject `id` in callback
  };
}
