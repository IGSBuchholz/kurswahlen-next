import {prisma} from "@/utils/prisma";

export async function updateLoginDate(email) {
    await prisma.$executeRaw`SELECT update_login_date(${email});`;
}