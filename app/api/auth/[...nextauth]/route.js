import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaClient} from "@prisma/client";
import {prisma} from "@/utils/prisma";

export const authOptions = ({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log(credentials);
                // Dummy user for local testing
                const username = credentials.username;
                const password = credentials.password;

                let user = await prisma.users.findUnique({ where: { email: username } });
                if(!user || user.length == 0) {
                    console.log("User not found");
                    user = await prisma.users.create({
                        data: {
                            email: username,
                            isadmin: false,
                        }
                    })
                }

                console.log("User", user)
                return { email: user.email, isadmin: user.isadmin };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.isadmin = user.isadmin;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.isadmin = token.isadmin;
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET

});
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
