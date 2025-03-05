import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type MCQFormProps = {
    options: string[];
    selectedOption: string;
    setSelectedOption: (option: string) => void;
    isAnswered?: boolean;
}
const index = ({ options, selectedOption, setSelectedOption, isAnswered }: MCQFormProps) => {
  return (
    <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2 mb-3">
          <RadioGroupItem
            value={option}
            id={`option-${index}`}
            disabled={isAnswered}
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
    </RadioGroup>
  );
};

export default index;
