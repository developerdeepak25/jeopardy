"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import QuestionModal from "@/components/QuestionModal/index";
import MCQForm from "@/components/MCQForm/index";
import { Category, JeopardyQuestion } from "@/types/utils";
import { toast } from "sonner";
import { Badge,  CircleCheck, CircleSlash, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const getGeopardyTable = async () => {
  console.log("getGeopardyTable running");
  const res = await axios.get("/api/user/jeopardy");
  return res;
};

const submitAnswer = async (questionId: string, ansIndex: string) => {
  console.log("submitAnswer running");
  const res = await axios.post(
    `/api/user/answer?quesId=${questionId}&ansIndex=${ansIndex}`
  );
  return res;
};

export default function JeopardyPage() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<JeopardyQuestion>();
  const [selectedCategory, setSelectedCategory] = useState("");

  // TODO remove this effect after dev
  useEffect(() => {
    console.log("selectedOption", selectedOption);
  }, [selectedOption]);

  const { data: session, status } = useSession();
  // const router = useRouter();

  // api requests
  const { data, error } = useQuery({
    queryKey: ["jeopardy"],
    queryFn: getGeopardyTable,
  });

  const { mutate, data: mutateData ,isPending} = useMutation({
    mutationKey: ["submitAnswer"],
    mutationFn: async () => {
      if (!selectedQuestion?.id || !selectedOption) {
        throw new Error("Question or answer not selected");
      }
      return await submitAnswer(selectedQuestion.id, selectedOption);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: () => {
      toast.success("Answer submitted successfully"); //TODO show diff toast for wrong and right answer
      setIsModelOpen(false);
      setSelectedOption("");
    },
  });

  // TODO remove this effect after dev
  useEffect(() => {
    console.log("mutateData", mutateData?.data.data.answer);
  }, [mutateData]);

  //
  const jeopardyData = data?.data?.jeopardyData;

  // TODO remove this effect after dev
  useEffect(() => {
    console.log(data);
    console.log(selectedOption);
    console.log(selectedQuestion);
    console.log("user data", data?.data?.jeopardyData);
    console.log("error", error);
  }, [error, data, selectedOption, selectedQuestion]);

  // if (status === "loading") return <p>Loading...</p>;
  // if (!session) {
  //   router.push("/login");
  //   return null;
  // }
  console.log("session", session);

  function handleQuesClick(question: JeopardyQuestion, category: string) {
    setSelectedQuestion(question);
    setIsModelOpen(true);
    setSelectedCategory(category);
  }
  // const handleSubmit = () => {
  // setIsModelOpen(false);
  // setSelectedOption("");
  // if (selectedQuestion?.id) {
  // const answer = submitAnswer(selectedQuestion.id, selectedOption);
  // console.log("answer", answer.data.data.answer); // TODO: remoce it
  // mutate();
  // }
  // };
   if (isPending || status === "loading") {
     return (
       <div className="h-full w-full flex justify-center items-center">
         <Loader2 className="animate-spin aspect-square h-10 w-10" />
       </div>
     );
   }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="flex justify-center mb-8">
        <h1 className="text-4xl font-bold text-center  px-8 py-3 rounded-md ">
          Jeopardy!
        </h1>
      </div>

      <div className="flex gap-4 w-full">
        {jeopardyData &&
          jeopardyData.map((category) => (
            <div key={category.id} className="flex flex-col gap-3 grow">
              <Card className="bg-primary p-3">
                <h2 className="text-white font-bold text-center text-lg truncate">
                  {category.name}
                </h2>
              </Card>

              {category.questions.map((question) => (
                <Card
                  key={question.id}
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
                      handleQuesClick(question, category.name);
                    }
                  }}
                >
                  <div className="text-center relative w-full h-full flex flex-col items-center justify-center">
                    {question.isAnswered ? (
                      <>
                        <div
                          className={cn(
                            "absolute top-1 right-1",
                            // question.isCorrect ? "bg-green-500" : "bg-red-500"
                          )}
                        >
                          {/* {question.isCorrect ? (
                            <CircleCheck className="w-6 aspect-square mr-1" />
                          ) : (
                            <CircleSlash  className="w-6 aspect-square mr-1" />
                          )} */}
                          {/* {question.isCorrect ? "Correct" : "Incorrect"} */}
                        </div>
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            question.isCorrect
                              ? "text-green-700"
                              : "text-red-700"
                          )}
                        >
                          ${question.amount}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-blue-700">
                        ${question.amount}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ))}
      </div>
      {selectedQuestion && (
        <QuestionModal
          isOpen={isModelOpen}
          setIsOpen={setIsModelOpen}
          title={`${selectedCategory}: $${selectedQuestion?.amount}`}
          onSubmit={() => mutate()}
        >
          <MCQForm
            question={selectedQuestion}
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
          />
        </QuestionModal>
      )}
    </div>
  );
}
