import { NextResponse } from "next/server";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message too long"),
});

export async function POST(req: Request) {
   try {
     const body = await req.json();

     // Validate input
     const validation = contactSchema.safeParse(body);
     if (!validation.success) {
       return NextResponse.json(
         {
           error: validation.error.errors[0].message,
         },
         { status: 400 }
       );
     }

     const { name, email, message } = validation.data;

     // Initialize Brevo API client
     const client = SibApiV3Sdk.ApiClient.instance;
     client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

     const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

     // Email to ADMIN (User's message)
     const adminEmail = {
       sender: { name, email }, // Show user's name & email
       to: [{ email: process.env.ADMIN_MAIL, name: "Admin" }],
       subject: `New Contact Form Submission from ${name}`,
       htmlContent: `
        <h3>New Message from ${name} (${email}):</h3>
        <p>${message}</p>
      `,
     };

     // Email to USER (Confirmation)
     const userEmail = {
       sender: { name: "Your Website", email: "no-reply@yourdomain.com" },
       to: [{ email, name }],
       subject: "Thanks for Contacting Us!",
       htmlContent: `
        <p>Hello ${name},</p>
        <p>Thank you for reaching out! We received your message:</p>
        <blockquote>${message}</blockquote>
        <p>We'll get back to you soon!</p>
        <p>- The Team</p>
      `,
     };

     // Send both emails
     await emailApi.sendTransacEmail(adminEmail);
     await emailApi.sendTransacEmail(userEmail);

     return NextResponse.json({
       message: "Emails sent successfully",
       status: 200,
     });
   } catch (error) {
     console.error("Brevo error:", error);
     return NextResponse.json({ error: "Failed to send email", status: 500 });
   }
}
