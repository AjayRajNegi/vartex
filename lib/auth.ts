import { prisma } from "./db";
import { resend } from "./resend";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "VarTex <onboarding@resend.dev>",
          to: [email],
          subject: "VarTex - Verify your email.",
          html: `<p>Your OTP is <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
});
