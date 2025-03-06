import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/utils/prisma";
async function handler(req, res) {
    const token = await getToken({ req })
    console.log(token);
    if(!token) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }
    const body = await req.json()
    const newSave = await prisma.saves.create({ data: {email: token.email, savename: body.name, savedata: JSON.stringify(body.context), pinned: false} })
    console.log("Saved Data for " + token.email + " " + body.name + " ( " + newSave.id + " )")
    return NextResponse.json({message: "SUCCESS", save: newSave})
}
export { handler as POST }