import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET /api/admin/jeopardy/question
// Route to get all questions
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
        { error: "Only admins can view questions" },
        { status: 403 }
      );
    }

    // Get all questions with their categories and answer counts
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        value: true,
        options: true,
        amount: true,
        CorrectIdx: true,
        categoryId: true,
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Answer: true,
          },
        },
      },
      orderBy: {
        category: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
