import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";
import {prisma} from "@/utils/prisma";
import {redis} from "@/utils/redis";

export async function getter(req, res) {
    const token = await getToken({ req })
    console.log(token);
    if(!token) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }

    return NextResponse.json({message: "SUCCESS", results: await getRulesEngineData()}, {status: 200});
}

async function getRulesEngineData() {
    const cacheKey = "rulesengine";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    // If not cached, fetch from DB
    const data = await getRulesEngineFromDataBase();

    // Store in Redis with a TTL (e.g., 1 hour)
    await redis.set(cacheKey, JSON.stringify(data), "EX", 3600);

    return data;
}

async function getRulesEngineFromDataBase() {
    const results = await prisma.creationfiles.findFirst({
        orderBy: {
            id: "desc",
        },
    });
    if (!results) {
        return "NO DATA FOUND";
    }
    return results;
}

export { getter as GET }



export async function setter(req, res)  {
    const token = await getToken({ req })
    if(!token || !token.isadmin) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }
    await redis.del("rulesengine_version")
    await redis.del("rulesengine")

    return NextResponse.json({message: "SUCCESS"}, {status: 200});
}

export { setter as POST }
