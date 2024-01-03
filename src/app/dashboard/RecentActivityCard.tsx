import HistoryComponent from "@/components/HistoryComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const RecentActivityCard = async (props: Props) => {
  const session = await getAuthSession();
  if (!session) {
    return redirect("/");
  }
  const gameCount = await prisma.game.count({
    where: { userId: session.user.id },
  });
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
        <CardDescription>
          You have given a total of {gameCount} quizzes
        </CardDescription>
      </CardHeader>

      <CardContent className="mx-h-[58px] overflow-scroll">
        <HistoryComponent limit={5} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
