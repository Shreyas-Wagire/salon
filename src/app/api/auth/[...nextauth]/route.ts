import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

const adminUsers = [
  { id: "1", email: "admin@salon.com", password: "admin123", role: "admin" },
  // Add a dummy client user for demo purposes
  { id: "2", email: "client@example.com", password: "dummy-password", role: "client" },
];

export const authConfig: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you would typically validate the credentials against your database
        if (credentials?.email === "admin@example.com" && credentials?.password === "admin123") {
          return {
            id: "1",
            email: "admin@example.com",
            name: "Admin User",
            role: "admin"
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Add role to token on login
      if (user) {
        token.role = user.role || "client";
        
        // If Google login, set role as client
        if (account?.provider === "google") {
          token.role = "client";
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add role from token to session
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.role = token.role || "client";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST }; 