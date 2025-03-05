import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type DialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const index = ({ isDialogOpen, setIsDialogOpen, children }: DialogProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* <DialogTitle className="text-xl">
            {selectedCategory.name}: ${selectedQuestion.amount} Question
          </DialogTitle> */}
        </DialogHeader>
        {/* <div className="py-4"> */}
        {/* <h3 className="font-medium text-lg mb-4">
            {selectedQuestion.question}
          </h3> */}

        {/* 
          {isAnswered && (
            <div
              className={`mt-4 p-3 rounded-md ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isCorrect
                ? "Correct! Well done."
                : `Incorrect. The correct answer is ${selectedQuestion.correctAnswer}.`}
            </div>
          )}
        </div> */}
        {children}
        <DialogFooter>
          {/* {!isAnswered ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="w-full"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={() => setIsDialogOpen(false)} className="w-full">
              Close
            </Button>
          )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


//   <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
//     {selectedQuestion.options.map((option, index) => (
//       <div key={index} className="flex items-center space-x-2 mb-3">
//         <RadioGroupItem
//           value={option}
//           id={`option-${index}`}
//           disabled={isAnswered}
//           className={
//             isAnswered && option === selectedQuestion.correctAnswer
//               ? "border-green-500 text-green-500"
//               : isAnswered &&
//                 option === selectedOption &&
//                 option !== selectedQuestion.correctAnswer
//               ? "border-red-500 text-red-500"
//               : ""
//           }
//         />
//         <Label
//           htmlFor={`option-${index}`}
//           className={
//             isAnswered && option === selectedQuestion.correctAnswer
//               ? "text-green-500"
//               : isAnswered &&
//                 option === selectedOption &&
//                 option !== selectedQuestion.correctAnswer
//               ? "text-red-500"
//               : ""
//           }
//         >
//           {option}
//         </Label>
//       </div>
//     ))}
//   </RadioGroup>;

export default index;
