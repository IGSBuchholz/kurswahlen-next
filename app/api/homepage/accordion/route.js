import {prisma} from "@/utils/prisma";
import {NextResponse} from "next/server";

import {redis} from "@/utils/redis";
import {getToken} from "next-auth/jwt";

export async function getter(req, res) {
    return NextResponse.json(await getAccordionData())
}

export {getter as GET}

async function getAccordionData() {
    const cacheKey = "accordion_data";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    // If not cached, fetch from DB
    const data = await fetchFromDatabase();

    // Store in Redis with a TTL (e.g., 1 hour)
    await redis.set(cacheKey, JSON.stringify(data), "EX", 3600);

    return data;
}

const fetchFromDatabase = async () => {
    const results = await prisma.homepageaccordion.findMany({
        orderBy: {
            id: "desc",
        }
    });
    console.log("Res", results);
    return results;
}

export async function setter(req, res) {
    const token = await getToken({ req })
    if((!token || !token.isadmin)) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }

    await redis.del("accordion_data");
    const data = await req.json();
    console.log(data)
    await prisma.homepageaccordion.deleteMany();
    let i = 0;
    for (const element of (data)) {
        (await prisma.homepageaccordion.create(
        {
            data: {
                id: i,
                answer: element.answer,
                question: element.question
            }
        }));
        i++;
    }
    return NextResponse.json({message: "SUCCESS"}, {status: 200});
}

export {setter as POST}