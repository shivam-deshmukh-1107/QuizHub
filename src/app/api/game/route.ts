import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

//  /api/game
export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in already!!",
        },
        {
          status: 401,
        }
      );
    }
    const body = await req.json();

    // Example: Logging inputs and intermediate results
    console.log("Received request body:", body);

    const { amount, topic, type } = QuizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    await prisma.topic_count.upsert({
      where: {
        topic,
      },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });

    const { data } = await axios.post(
      `${process.env.API_URL as string}/api/questions`,
      {
        amount,
        topic,
        type,
      }
    );

    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      let manyData = data.questions.map((question: mcqQuestion) => {
        let options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "mcq",
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    } else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };
      let manydata = data.questions.map((question: openQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          gameId: game.id,
          questionType: "open_ended",
        };
      });
      await prisma.question.createMany({
        data: manydata,
      });
    }
    return NextResponse.json({
      gameId: game.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log the ZodError issues for debugging
      console.error("ZodError:", error.issues);

      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      // Log the unexpected error for debugging
      console.error("Unexpected error:", error);

      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}
