import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/utils/prisma";
import {getVersion} from "@/app/api/rulesengine/version/route";
export default async function handler(req, res) {
    const token = await getToken({ req })

    console.log(token);
    if(!token) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }
    const searchParams = req.nextUrl.searchParams;
    if(!searchParams.has("id")) {
        return NextResponse.json({message: "MISSING ID"}, {status: 400});
    }
    const queryId = searchParams.get("id");
    const results = await prisma.saves.findMany({where: {id: queryId, email: token.email, cfv: (await getVersion()).version}})
    if(results.length == 0){
        return NextResponse.json({message: "NOT FOUND"}, {status: 404});
    }
    return NextResponse.json({message: "SUCCESS", result: results[0]})
}
export { handler as GET }