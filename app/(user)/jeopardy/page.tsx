"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getGeopardyTable = async () => {
  console.log("getGeopardyTable running");

  const res = await axios.get("/api/user/jeopardy");
  return res;
};

export default function Dashboard() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // api requests
  const { isPending, data, isError, error } = useQuery({
    queryKey: ["jeopardy"],
    queryFn: getGeopardyTable,
  });
  const jeopardyData = data?.data?.jeopardyData;
  useEffect(() => {
    console.log(data);
    console.log("user data", data?.data?.jeopardyData);
    console.log("error", error);
  }, [error, data]);

  if (status === "loading") return <p>Loading...</p>;
  // if (!session) {
  //   router.push("/login");
  //   return null;
  // }
  console.log("session", session);

  return (
    <div>
      <h1>Jeopardy</h1>
      <div className="flex gap-4 mx-10 my-6">

      {jeopardyData &&
        jeopardyData.map((category) => (
          <div key={category.id}>
            <h2>{category.name}</h2>
            {category.questions.map((question) => (
              <div key={question.id} className="p-3">
                <h3>{question.question}</h3>
                {/* {question?.answ/ers?.map((answer, idx) => ( */}
                <div>
                  <p>{question.amount}</p>
                </div>
                {/* ))} */}
              </div>
            ))}
          </div>
        ))}
        </div>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
}
