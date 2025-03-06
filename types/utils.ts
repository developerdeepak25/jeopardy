export type JeopardyQuestion = {
  id: string;
  value: string;
  options: string[];
  amount: number;
  // correctAnswer: string;
};

export type Category ={
  id: string;
  name: string;
  questions: JeopardyQuestion[];
}
