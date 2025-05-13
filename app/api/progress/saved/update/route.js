import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/utils/prisma";
async function handler(req, res) {
    const token = await getToken({ req })
    if(!token) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }
    const body = await req.json()
    const newSave = await prisma.saves.update({where: {id: body.id, email: token.email}, data: {savedata: JSON.stringify(body.context)} });
    console.log("Updated Data for " + token.email + "'s Save, " + newSave.savename + " ( ID" + newSave.id + " )")
    return NextResponse.json({message: "SUCCESS", save: newSave})
}
export { handler as POST }