import { NextResponse } from "next/server";
import brevo, { SendSmtpEmail } from "@getbrevo/brevo";
import { contactSchema } from "@/schema/zodSchema";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input first
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { captchaToken } = body;
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha token is required" },
        { status: 400 }
      );
    }

    // Verify captcha
    try {
      const captchaResponse = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret: process.env.CAPTCHA_SECRET_KEY,
            response: captchaToken,
          },
        }
      );

      if (!captchaResponse.data.success) {
        return NextResponse.json(
          { error: "Captcha verification failed" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Captcha verification error:", error);
      return NextResponse.json(
        { error: "Failed to verify captcha" },
        { status: 500 }
      );
    }

    const { name, email, message } = validation.data;

    // Initialize Brevo API client with TypeScript support
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );

    // Email to ADMIN (User's message)
    const adminEmail: SendSmtpEmail = {
      sender: { name, email: process.env.ADMIN_EMAIL as string },
      to: [{ email: process.env.ADMIN_EMAIL as string, name: "Admin" }],
      subject: `New Contact Form Submission from ${name}`,
      htmlContent: `
        <h3>New Message from ${name} (${email}):</h3>
        <p><b>message: </b>${message}</p>
      `,
    };
    console.log(adminEmail); //?dev

    // Email to USER (Confirmation)
    const userEmail: SendSmtpEmail = {
      sender: {
        name: "Jeopardy Team",
        email: process.env.ADMIN_EMAIL as string,
      },
      to: [{ email, name }],
      subject: "Thanks for Contacting Us!",
      htmlContent: `
  <p><strong>Hello ${name},</strong></p>
  <p>Thank you for reaching out! We received your message:</p>
  <blockquote><i>${message}</i></blockquote>
  <p>We'll get back to you soon!</p>
  <p>- The Team</p>
  `,
    };
    console.log(userEmail); //?dev

    // Send both emails
    await apiInstance.sendTransacEmail(adminEmail);
    await apiInstance.sendTransacEmail(userEmail);
    // console.log("admin", res);
    // console.log("user", res2);

    return NextResponse.json({
      message: "Emails sent successfully",
      status: 200,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
