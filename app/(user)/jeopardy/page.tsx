"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import QuestionModal from "@/components/QuestionModal/index";
import MCQForm from "@/components/MCQForm/index";
import { Category, JeopardyQuestion } from "@/types/utils";

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

export default function Dashboard() {
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

  const { mutate, data: mutateData } = useMutation({
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

  if (status === "loading") return <p>Loading...</p>;
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

  return (
    <div>
      <h1>Jeopardy</h1>
      <div className="flex gap-4 mx-10 my-6">
        {jeopardyData &&
          jeopardyData.map((category: Category) => (
            <div key={category.id} className="flex flex-col gap-4">
              <h2>{category.name}</h2>
              {category.questions.map((question: JeopardyQuestion) => (
                <div key={question.id} className="p-3 border-1 cursor-pointer">
                  {/* {question?.answ/ers?.map((answer, idx) => ( */}
                  <div onClick={() => handleQuesClick(question, category.name)}>
                    <p>{question.amount}</p>
                  </div>
                  {/* ))} */}
                </div>
              ))}
            </div>
          ))}
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
      {/* <Button onClick={() => signOut()}>Logout</Button> */}
    </div>
  );
}
