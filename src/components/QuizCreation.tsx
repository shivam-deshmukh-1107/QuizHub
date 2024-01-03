"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import LoadingQuestions from "./loadingQuestions";

type Props = {
  topic: string;
};

type Input = z.infer<typeof QuizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);

  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      try {
        const response = await axios.post("/api/game", {
          amount,
          topic,
          type,
        });
        return response.data;
      } catch (error: any) {
        if (error.response) {
          console.error("Server error response:", error.response.data);
        }
        throw error;
      }
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(QuizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: topicParam,
      type: "open_ended",
    },
  });

  function onSubmit(data: Input) {
    setShowLoader(true);
    getQuestions(data, {
      onSuccess: ({ gameId }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") == "open_ended") {
            router.push(`/play/open_ended/${gameId}`);
          } else {
            router.push(`/play/mcq/${gameId}`);
          }
        }, 1000);
      },
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
        }
      },
    });
  }

  form.watch();
  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2x font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic:</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on
                      here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a number..."
                        {...field}
                        min={1}
                        max={10}
                        type="number"
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "open_ended");
                  }}
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button disabled={isPending} type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
