import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

const prisma = new PrismaClient();

// GET /api/admin/user
// This route is used to get all users

export async function GET() {
  try {
    // Get the session and verify if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the authenticated user is an admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can view users" },
        { status: 403 }
      );
    }

    // Get all users with their total amount and answers count
    const users = await prisma.user.findMany({
      where:{
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        totalAmount: true,
        _count: {
          select: {
            Answer: true,
          },
        },
      },
     
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
