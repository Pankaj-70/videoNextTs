import User from "@/models/user.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Enter all details");
                }
                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("User not registered yet");

                    }

                    const isValid = bcrypt.compare(user.password, credentials.password);
                    if (!isValid) {
                        throw new Error("Invalid credentials");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }

                } catch (error) {
                    console.error("Error in next-auth login: ", error);
                    throw new Error("Internal Server Error");

                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user)
                token.id = user.id;
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET,
}