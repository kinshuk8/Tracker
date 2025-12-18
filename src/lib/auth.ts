import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Adjust path if needed
import { nextCookies } from "better-auth/next-js";

import { users, sessions, accounts, verifications } from "@/db/schema";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
    }
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>", // TODO: Update with verified domain
            to: [data.user.email],
            subject: "Reset your password",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${data.url}">${data.url}</a>`,
        });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      image: { 
        type: "string", 
        required: false,
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()], 
});
