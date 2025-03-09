import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

const prisma = new PrismaClient();

type QuestionUpdateData = {
  value?: string;
  options?: string[];
  amount?: number;
  CorrectIdx?: number;
  categoryId?: string;
};

//  Route to edit/delete the question
// ! this route edits the question but but it also remoce all records related to it like answered by, removes the questions existinence for user even if they did answered it
// ? but we exception to not reduce totalAmount for the user for now
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the session and verify if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the authenticated user is an admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete users" },
        { status: 403 }
      );
    }

    // Logic to edit qestion

    /**
     * * things to do
     * #1. if a user has answered the question then delete the answer for user
     * #2.( propbaly reduce the totalAmount. If reducing amount make sure do not decrement if user has answeed wrong) - currently not doing this
     *
     *  */

    const { id } = await params;
    const body: QuestionUpdateData = await request.json();

    // Check if question exists
    const questionExists = await prisma.question.findUnique({
      where: { id },
    });

    if (!questionExists) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Update question
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(
      {
        message: "Question updated successfully",
        question: updatedQuestion,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
