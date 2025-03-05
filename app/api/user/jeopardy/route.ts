import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

// route to get the jeopardy Table (with answered Table if any)
const prisma = new PrismaClient();

export async function GET() {
  try {
    // TODO: add check with session using next-auth
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // getting table //TODO add answered  too if exist
    const jeopardyData = await prisma.category.findMany({
      include: {
        questions: true,
      },
    });

    return NextResponse.json(
      { message: "Jeopardy Table", jeopardyData },
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
