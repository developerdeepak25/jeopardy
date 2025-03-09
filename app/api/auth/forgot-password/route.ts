import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import brevo, { SendSmtpEmail } from "@getbrevo/brevo";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const resetUrl = `${process.env.NEXT_URL}/reset-password?token=${resetToken}`;

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );

    // Prepare reset password email
    const resetEmail: SendSmtpEmail = {
      sender: {
        name: "Jeopardy Team",
        email: process.env.ADMIN_EMAIL as string,
      },
      to: [{ email: user.email, name: user.name }],
      subject: "Password Reset Request",
      htmlContent: `
        <p><strong>Hello ${user.name},</strong></p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>- The Jeopardy Team</p>
      `,
    };

    // Send the email
   const res =  await apiInstance.sendTransacEmail(resetEmail);
   console.log(res); //?dev

    return NextResponse.json(
      { message: "Password reset link sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
