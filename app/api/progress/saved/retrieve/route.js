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
    console.log((await getVersion()).version)
    const results = await prisma.saves.findMany({where: {email: token.email, cfv: (await getVersion()).version}})
    const update = await prisma.users.update({
        where: {email: token.email},
        data: {lastLoginDate: new Date().toISOString(), previousLoginDate: null}
    })
    return NextResponse.json({message: "SUCCESS", results: results})
}
export { handler as GET }