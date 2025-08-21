import { prisma } from "./db";
import { resend } from "./resend";
import { betterAuth } from "better-auth";
import { emailOTP, admin } from "better-auth/plugins";
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
          from: "VarTex <noreply@redsan.in>",
          to: [email],
          subject: "VarTex - Verify your email.",
          html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verify your email - VarTex</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f9fafb; font-family: Arial, sans-serif; color:#111827;">
      <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.05); overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color:#111827; padding:20px; text-align:center;">
                  <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:600;">
                    VarTex
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px;">
                  <h2 style="margin-top:0; font-size:20px; color:#111827; font-weight:600;">Verify your email</h2>
                  <p style="font-size:16px; color:#374151; line-height:1.5;">
                    Thanks for signing up with <strong>VarTex</strong> 🎓  
                    To complete your registration, please use the OTP below:
                  </p>

                  <!-- OTP Box -->
                  <div style="margin:30px 0; text-align:center;">
                    <p style="display:inline-block; padding:12px 24px; font-size:22px; letter-spacing:3px; font-weight:bold; color:#111827; background-color:#f3f4f6; border-radius:6px; border:1px solid #e5e7eb;">
                      ${otp}
                    </p>
                  </div>

                  <p style="font-size:14px; color:#6b7280; line-height:1.5;">
                    This OTP will expire in 10 minutes. If you didn’t request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#9ca3af;">
                  © ${new Date().getFullYear()} VarTex. All rights reserved.  
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`,
        });
      },
    }),
    admin(),
  ],
});
