import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email });

                if (!user) return null;

                if (!user.password) return null; // No password, must have signed up with OAuth

                const isMatch = await bcrypt.compare(credentials.password as string, user.password);
                if (!isMatch) return null;

                return { id: user._id.toString(), name: user.name, email: user.email, image: user.image, role: user.role };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                await connectToDatabase();
                let existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    existingUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: "google",
                        googleId: account.providerAccountId,
                        role: "user",
                    });
                }
                // @ts-ignore
                user.id = existingUser._id.toString();
                // @ts-ignore
                user.role = existingUser.role;
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.image = token.image;
            }
            return session;
        },
        async jwt({ token, user, account, trigger, session }: { token: any, user: any, account: any, trigger?: string, session?: any }) {
            if (trigger === "update" && session) {
                // DO NOT update token.role from session! This is a severe privilege escalation vulnerability.
                if (session.name) {
                    token.name = session.name;
                }
                if (session.image) {
                    token.image = session.image;
                }
            }
            if (account && user) {
                if (account.provider === "google") {
                    await connectToDatabase();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.sub = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.image = dbUser.image;
                    }
                } else {
                    token.sub = user.id;
                    token.role = user.role;
                    token.image = user.image;
                }
            }
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecretkey123",
};
