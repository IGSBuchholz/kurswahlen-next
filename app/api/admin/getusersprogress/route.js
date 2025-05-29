import {NextResponse} from "next/server";
import {prisma} from "@/utils/prisma";
import {getToken} from "next-auth/jwt";

async function retrieve(req) {

    const token = await getToken({ req })
    console.log(token);
    if(!token || !token.isadmin) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }

    const searchParams = req.nextUrl.searchParams;

    const email = searchParams.get("email")

    const users = await prisma.saves.findMany({
        where: {
            email: {
                contains: email.toString().toLowerCase()
            }
        }
    })
    console.log("Users:", users);
    return NextResponse.json({"results": users, "status": "success"});
}

export {retrieve as GET}