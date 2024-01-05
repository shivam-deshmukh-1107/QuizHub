import { prisma } from "@/lib/db";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import axios from "axios";
import { Session } from "next-auth";

export async function createGameAndFetchQuestions(session: Session, body: any) {
  const { amount, topic, type } = QuizCreationSchema.parse(body);
  const [game, { data }] = await Promise.all([
    prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    }),
    axios.post(`${process.env.API_URL as string}/api/questions`, {
      amount,
      topic,
      type,
    }),
  ]);
  return { game, data, type };
}
