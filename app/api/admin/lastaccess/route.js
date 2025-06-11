import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    const user = await prisma.users.findUnique({
        where: { email: session.user.email },
        select: { previousLoginDate: true }
    });

    return new Response(JSON.stringify({ previousLoginDate: user?.previousLoginDate || null }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}