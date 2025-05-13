import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";
import {runChecks} from '@/utils/ConnectivityChecker'

async function retrieve(req) {

    const token = await getToken({req})
    console.log(token);
    if (!token || !token.isadmin) {
        return NextResponse.json({message: "NOT AUTHORIZED"}, {status: 401});
    }

    let checks = await runChecks(true);



    return NextResponse.json(checks, {status: 200})

}

export {retrieve as GET}