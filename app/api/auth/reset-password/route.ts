import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });
    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
