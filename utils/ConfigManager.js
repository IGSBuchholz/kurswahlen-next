
import {prisma} from "@/utils/prisma";
import email from "next-auth/core/lib/email/signin";

export async function get(key) {

    const res = await prisma.config.findUnique({ where: { key: key } })

    console.log(res)

}

export async function set(key, value) {


    let valueString = null
    let valueNumber = null
    let valueBool = null
    let valueArray = null

    switch (value.typeOf) {
        case "string":
            valueString = value
            break;
        case "number":
            valueNumber = value
            break;

    }

}