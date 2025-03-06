import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/utils/prisma";
export default async function handler(req, res) {
    const token = await getToken({ req })
    console.log(token);
    if(!token) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }

    const results = await prisma.saves.findMany({where: {email: token.email}})
    return NextResponse.json({message: "SUCCESS", results: results})
}
export { handler as GET }