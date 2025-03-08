"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Modal } from "@/components/modal";
import { InputWithLabel } from "@/components/Inputs/InputWithLabel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditQuestionFormType, EditQuestionSchema } from "@/schema/zodSchema";

interface Question {
  id: string;
  value: string;
  options: string[];
  amount: number;
  CorrectIdx: number;
  categoryId: string;
  category: {
    name: string;
  };
  _count: {
    Answer: number;
  };
}

const getQuestions = async () => {
  const response = await axios.get("/api/admin/jeopardy/question");
  return response.data;
};

const QuestionsList = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const updateQuestion = async (question: Partial<Question>) => {
    console.log("Updating question:", question);
    const response = await axios.patch(
      `/api/admin/jeopardy/question/${selectedQuestion?.id}`,
      question
    );
    return response.data;
  };

  const {
    data: questions,
    error,
    isPending,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const editMutation = useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setIsModalOpen(false);
      setSelectedQuestion(null);
    },
    onError: (error) => {
      console.error("Error updating question:", error);
    },
  });

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  if (error) return <div>Error loading questions</div>;
  if (isPending) return <div>Loading...</div>;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Correct Answer</TableHead>
              <TableHead>Total Answers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions?.map((question: Question) => (
              <QuestionRow
                key={question.id}
                question={question}
                onEdit={handleEditQuestion}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedQuestion && (
        <EditQuestionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuestion(null);
          }}
          onSubmit={editMutation.mutate}
          defaultValues={{
            value: selectedQuestion.value,
            options: selectedQuestion.options,
            CorrectIdx: selectedQuestion.CorrectIdx,
          }}
        />
      )}
    </>
  );
};

const QuestionRow = ({
  question,
  onEdit,
}: {
  question: Question;
  onEdit: (question: Question) => void;
}) => {
  return (
    <TableRow key={question.id}>
      <TableCell className="font-medium">{question.value}</TableCell>
      <TableCell>{question.category.name}</TableCell>
      <TableCell>${question.amount}</TableCell>
      <TableCell>{question.options[question.CorrectIdx]}</TableCell>
      <TableCell>{question._count.Answer}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={() => onEdit(question)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};

const EditQuestionModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditQuestionFormType) => void;
  defaultValues?: EditQuestionFormType;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditQuestionFormType>({
    resolver: zodResolver(EditQuestionSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          CorrectIdx: defaultValues.CorrectIdx + 1,
        }
      : undefined,
  });

  useEffect(() => {
    console.log(errors);
  });

  const handleFormSubmit = (data: EditQuestionFormType) => {
    onSubmit({
      ...data,
      CorrectIdx: data.CorrectIdx - 1,
      value: data.value,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Question">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <InputWithLabel
          label="Question"
          {...register("value")}
          error={errors.value}
        />
        {[0, 1, 2, 3].map((index) => (
          <InputWithLabel
            key={index}
            label={`Option ${index + 1}`}
            {...register(`options.${index}`)}
            error={errors.options?.[index]}
          />
        ))}
        <InputWithLabel
          label="Correct Option (1-4)"
          type="number"
          // min={1}
          // max={4}
          {...register("CorrectIdx", { valueAsNumber: true })}
          error={errors.CorrectIdx}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuestionsList;
