import clientPromise from "@/lib/mongodb";
import NextAuth, { getServerSession } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

const adminEmails = ["eadwinezhao@gmail.com", "brianzhao@gmail.com"];
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // OAuth authentication providers...

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    // session: async ({ session, token, user }) => {
    //   console.log(session);

    //   if (adminEmails.includes(session?.user?.email)) {
    //     return session;
    //   } else {
    //     return false;
    //   }
    // },
    async signIn({ user, account, profile, email, credentials}) {
      if(adminEmails.includes(user?.email)) {
        return true;
      } else {
        return false;
      }
    },
    // async session({ session, token, user }) {
    //   console.log(session,token,user,session?.sessionToken)
    //   return session;
    // }
  },
};
export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
