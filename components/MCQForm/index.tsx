import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { JeopardyQuestion } from "@/types/utils";

type MCQFormProps = {
  question: JeopardyQuestion;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: string;
};
const index = ({
  question,
  setSelectedOption,
  selectedOption,
}: MCQFormProps) => {
  const {
    options, 
    // isAnswered,
    value,
  } = question;
  return (
    <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
      <div className="py-4">
        <h3 className="font-medium text-lg mb-4">{value}</h3>
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 mb-3 cursor-pointer"
          >
            <RadioGroupItem
              value={index.toString()}
              id={`option-${index}`}
              className="cursor-pointer"
              // disabled={isAnswered}
              // className={
              //   isAnswered && option === selectedQuestion.correctAnswer
              //     ? "border-green-500 text-green-500"
              //     : isAnswered &&
              //       option === selectedOption &&
              //       option !== selectedQuestion.correctAnswer
              //     ? "border-red-500 text-red-500"
              //     : ""
              // }
            />
            <Label
              htmlFor={`option-${index}`}
              className="cursor-pointer"
              // className={
              //   isAnswered && option === selectedQuestion.correctAnswer
              //     ? "text-green-500"
              //     : isAnswered &&
              //       option === selectedOption &&
              //       option !== selectedQuestion.correctAnswer
              //     ? "text-red-500"
              //     : ""
              // }
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

export default index;
