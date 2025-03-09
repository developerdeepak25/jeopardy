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


export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  image?: string;
  totalAmount: number;
}
