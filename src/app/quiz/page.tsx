import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: {
    topic?: string;
  };
};

export const metadata = {
  title: "Quiz | QuizHub",
  description: "Quiz yourself on anything!",
};

const Quizpage = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }
  return <QuizCreation topic={searchParams.topic ?? ""} />;
};

export default Quizpage;
