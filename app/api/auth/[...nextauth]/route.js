import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/utils/prisma";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("🟢 authorize() wurde aufgerufen mit:", credentials);

                const email = credentials.username;

                try {
                    let user = await prisma.users.findUnique({ where: { email } });

                    if (!user) {
                        const now = new Date().toISOString();
                        const createdUser = await prisma.users.create({
                            data: {
                                email,
                                isadmin: false,
                                lastLoginDate: now,
                                previousLoginDate: null
                            }
                        });
                        console.log("🆕 NEUER USER ANGELEGT:", createdUser);
                        return { email, isadmin: false };
                    }

                    console.log("📌 EXISTIERENDER USER:", user);

                    const previousLogin = user.lastLoginDate;

                    const updatedUser = await prisma.users.update({
                        where: { email },
                        data: {
                            previousLoginDate: previousLogin || null,
                            lastLoginDate: new Date().toISOString(),
                        }
                    });

                    console.log("📅 BISHERIGES LOGIN:", previousLogin);
                    console.log("✅ UPDATE ERFOLGREICH FÜR:", updatedUser.email);
                    return { email, isadmin: updatedUser.isadmin };

                } catch (e) {
                    console.log("❌ FEHLER IN authorize():", e);
                    return null;
                }
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
