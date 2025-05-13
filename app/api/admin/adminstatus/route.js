import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";
import {prisma} from "@/utils/prisma";

async function put(req) {


    const token = await getToken({ req })
    console.log(token);
    if(!token || !token.isadmin) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }

    const { email, isadmin } = await req.json();

    const updatedUser = await prisma.users.update({
        where: {
            email: email.toString()
        },
        data: {
            isadmin: isadmin
        }
    });


    return NextResponse.json(updatedUser, {status: 200});

}

export {put as PUT}