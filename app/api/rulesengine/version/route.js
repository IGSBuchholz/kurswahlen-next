import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";
import {prisma} from "@/utils/prisma";
import {redis} from "@/utils/redis";

export default async function handler(req, res) {
    const token = await getToken({ req })
    console.log(token);
    if(!token) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }
    return NextResponse.json(await getVersion(), {status: 200});
}
export { handler as GET }

export async function getVersionFromDatabase() {
    const results = await prisma.creationfiles.findFirst({
        orderBy: {
            id: "desc",
        },
    })
    if(!results) {
        return { message: "NO DATA FOUND", version: -1 }
    }
    return {message: "SUCCESS", version: results.id}
}

export async function getVersion() {
    const cacheKey = "rulesengine_version";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    // If not cached, fetch from DB
    const data = (await getVersionFromDatabase()).version;

    // Store in Redis with a TTL (e.g., 1 hour)
    await redis.set(cacheKey, data, "EX", 3600);

    return {message: "SUCCESS", version: data}
}