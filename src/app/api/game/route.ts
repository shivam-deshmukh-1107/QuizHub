import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { Session } from "next-auth";
import { $Enums } from "@prisma/client";
import { createGameAndFetchQuestions } from "@/lib/creategame_fetchquestions";
import { processQuestionsAndCreateTopicCount } from "@/lib/processquestions_createtopiccount";
// import { createGameAndFetchQuestions } from "../creategame_fetchquestions/route";
// import { processQuestionsAndCreateTopicCount } from "../processquestions_createtopiccount/route";

// export async function POST(req: Request, res: Response) {
//   try {
//     const session = await getAuthSession();
//     if (!session?.user) {
//       return NextResponse.json(
//         { error: "You must be logged in already!!" },
//         { status: 401 }
//       );
//     }
//     const body = await req.json();
//     const { amount, topic, type } = QuizCreationSchema.parse(body);
//     const [game, { data }] = await Promise.all([
//       prisma.game.create({
//         data: {
//           gameType: type,
//           timeStarted: new Date(),
//           userId: session.user.id,
//           topic,
//         },
//       }),
//       axios.post(`${process.env.API_URL as string}/api/questions`, {
//         amount,
//         topic,
//         type,
//       }),
//     ]);
//     await prisma.topic_count.upsert({
//       where: { topic },
//       create: { topic, count: 1 },
//       update: { count: { increment: 1 } },
//     });
//     let questionData;
//     if (type === "mcq") {
//       type mcqQuestion = {
//         question: string;
//         answer: string;
//         option1: string;
//         option2: string;
//         option3: string;
//       };
//       questionData = data.questions.map((question: mcqQuestion) => {
//         const options = [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.answer,
//         ].sort(() => Math.random() - 0.5);
//         return {
//           question: question.question,
//           answer: question.answer,
//           options: JSON.stringify(options),
//           gameId: game.id,
//           questionType: "mcq",
//         };
//       });
//     } else if (type === "open_ended") {
//       type openQuestion = { question: string; answer: string };
//       questionData = data.questions.map((question: openQuestion) => {
//         return {
//           question: question.question,
//           answer: question.answer,
//           gameId: game.id,
//           questionType: "open_ended",
//         };
//       });
//     }
//     await prisma.question.createMany({ data: questionData });
//     return NextResponse.json({ gameId: game.id });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: error.issues }, { status: 400 });
//     } else {
//       return NextResponse.json(
//         { error: "An unexpected error occurred." },
//         { status: 500 }
//       );
//     }
//   }
// }

// async function createGameAndFetchQuestions(session: Session, body: any) {
//   const { amount, topic, type } = QuizCreationSchema.parse(body);
//   const [game, { data }] = await Promise.all([
//     prisma.game.create({
//       data: {
//         gameType: type,
//         timeStarted: new Date(),
//         userId: session.user.id,
//         topic,
//       },
//     }),
//     axios.post(`${process.env.API_URL as string}/api/questions`, {
//       amount,
//       topic,
//       type,
//     }),
//   ]);
//   return { game, data, type };
// }

// async function processQuestionsAndCreateTopicCount(
//   game: {
//     id: string;
//     userId?: string;
//     timeStarted?: Date;
//     topic: string;
//     timeEnded?: Date | null;
//     gameType?: $Enums.GameType;
//   },
//   data: any,
//   type: string
// ) {
//   await prisma.topic_count.upsert({
//     where: { topic: game.topic },
//     create: { topic: game.topic, count: 1 },
//     update: { count: { increment: 1 } },
//   });

//   let questionData;
//   if (type === "mcq") {
//     type mcqQuestion = {
//       question: string;
//       answer: string;
//       option1: string;
//       option2: string;
//       option3: string;
//     };
//     questionData = data.questions.map((question: mcqQuestion) => {
//       const options = [
//         question.option1,
//         question.option2,
//         question.option3,
//         question.answer,
//       ].sort(() => Math.random() - 0.5);
//       return {
//         question: question.question,
//         answer: question.answer,
//         options: JSON.stringify(options),
//         gameId: game.id,
//         questionType: "mcq",
//       };
//     });
//   } else if (type === "open_ended") {
//     type openQuestion = { question: string; answer: string };
//     questionData = data.questions.map((question: openQuestion) => {
//       return {
//         question: question.question,
//         answer: question.answer,
//         gameId: game.id,
//         questionType: "open_ended",
//       };
//     });
//   }
//   return questionData;
// }

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in already!!" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { game, data, type } = await createGameAndFetchQuestions(
      session,
      body
    );
    const questionData = await processQuestionsAndCreateTopicCount(
      game,
      data,
      type
    );

    await prisma.question.createMany({ data: questionData });
    return NextResponse.json({ gameId: game.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
