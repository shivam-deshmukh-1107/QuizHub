import { NextResponse } from "next/server";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { strict } from "assert";
import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";

export const runtime = "nodejs";
export const maxDuration = 500;

// POST /api/questions
// export const POST = async (req: Request, res: Response) => {
//   console.log("API Route Received a Request");
//   const session = await getAuthSession();
//   // if (!session?.user) {
//   //   return NextResponse.json(
//   //     { error: "You must be logged in to create a game." },
//   //     {
//   //       status: 401,
//   //     }
//   //   );
//   // }
//   try {
//     console.log("Raw Request Body:", await req.text());
//     const body = await req.json();
//     console.log("Parsed body:", body);

//     console.log("Body structure:", typeof body, Array.isArray(body));

//     const { amount, topic, type } = QuizCreationSchema.parse(body);
//     let questions: any;
//     if (type === "open_ended") {
//       questions = await strict_output(
//         "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
//         new Array(amount).fill(
//           `You are to generate a random hard open_ended questions about ${topic}`
//         ),
//         {
//           question: "question",
//           answer: "answer with max length of 15 words",
//         }
//       );
//     } else if (type === "mcq") {
//       questions = await strict_output(
//         "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
//         new Array(amount).fill(
//           `You are to generate a random hard mcq question about ${topic}`
//         ),
//         {
//           question: "question",
//           answer: "answer with max length of 15 words",
//           option1: "option1 with max length of 15 words",
//           option2: "option2 with max length of 15 words",
//           option3: "option3 with max length of 15 words",
//         }
//       );
//     }

//     return NextResponse.json(
//       {
//         questions: questions,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error("Error in POST:", error);
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         {
//           error: error.issues,
//         },
//         {
//           status: 404,
//         }
//       );
//     } else {
//       console.error("elle gpt error", error);
//       return NextResponse.json(
//         { error: "An unexpected error occurred." },
//         {
//           status: 500,
//         }
//       );
//     }
//   }
// };

export async function POST(req: Request, res: Response) {
  try {
    // const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a game." },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();
    const { amount, topic, type } = QuizCreationSchema.parse(body);
    let questions: any;
    if (type === "open_ended") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard open-ended questions about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    }
    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("elle gpt error", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}
