import { prisma } from "@/lib/db";
import { $Enums } from "@prisma/client";

export async function processQuestionsAndCreateTopicCount(
  game: {
    id: string;
    userId?: string;
    timeStarted?: Date;
    topic: string;
    timeEnded?: Date | null;
    gameType?: $Enums.GameType;
  },
  data: any,
  type: string
) {
  await prisma.topic_count.upsert({
    where: { topic: game.topic },
    create: { topic: game.topic, count: 1 },
    update: { count: { increment: 1 } },
  });

  let questionData;
  if (type === "mcq") {
    type mcqQuestion = {
      question: string;
      answer: string;
      option1: string;
      option2: string;
      option3: string;
    };
    questionData = data.questions.map((question: mcqQuestion) => {
      const options = [
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
  } else if (type === "open_ended") {
    type openQuestion = { question: string; answer: string };
    questionData = data.questions.map((question: openQuestion) => {
      return {
        question: question.question,
        answer: question.answer,
        gameId: game.id,
        questionType: "open_ended",
      };
    });
  }
  return questionData;
}
