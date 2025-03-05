import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ?This route is used to submit the answer for the question it also returns the answer obj

// takes two query params quesId and ansIndex
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const quesId = searchParams.get("quesId");
    const ansIndex = searchParams.get("ansIndex");
    console.log(quesId, ansIndex);

    if (!quesId || !ansIndex) {
      return NextResponse.json(
        { error: "Question and Answer Index is required" },
        { status: 400 }
      );
    }
    const question = await prisma.question.findUnique({
      where: {
        id: quesId,
      },
    });

    const answer = await prisma.answer.create({
      data: {
        userId: session.user.id,
        questionId: quesId,
        selectedIdx: ansIndex,
        correct: parseInt(ansIndex) === question?.CorrectIdx,
      },
    });

    return NextResponse.json(
      { message: "Answer Submitted", answer },
      { status: 200 }
    );
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
