"use client";
import { JeopardyQuestion } from "@/types/utils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: JeopardyQuestion;
  onQuestionClick: (question: JeopardyQuestion) => void;
}

export default function QuestionCard({
  question,
  onQuestionClick,
}: QuestionCardProps) {
  return (
    <Card
      className={cn(
        "p-4 h-24 flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg",
        question.isAnswered
          ? question.isCorrect
            ? "bg-green-100 border-green-500 border-2"
            : "bg-red-100 border-red-500 border-2"
          : "bg-blue-100 border-blue-300"
      )}
      onClick={() => {
        if (!question.isAnswered) {
          onQuestionClick(question);
        }
      }}
    >
      <div className="text-center relative w-full h-full flex flex-col items-center justify-center">
        {question.isAnswered ? (
          <p
            className={cn(
              "text-2xl font-bold",
              question.isCorrect ? "text-green-700" : "text-red-700"
            )}
          >
            ${question.amount}
          </p>
        ) : (
          <p className="text-2xl font-bold text-blue-700">${question.amount}</p>
        )}
      </div>
    </Card>
  );
}
