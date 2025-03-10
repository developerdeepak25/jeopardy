"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/utils";
import { Loader2, LoaderCircle } from "lucide-react";

const getGeopardyTable = async () => {
  console.log("getGeopardyTable running");
  const res = await axios.get("/api/user/leaderboard");
  return res;
};

const LeaderBoard = () => {
  // api requests
  const { data,  isPending, isError } = useQuery({
    queryKey: ["leaderbord"],
    queryFn: getGeopardyTable,
  });

  console.log(data);

  if (isError) {
    return <h1>Something went wrong</h1>;
  }
  if (isPending) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin aspect-square h-10 w-10" />
      </div>
    );
  }

  const getPositionBadge = (position: number) => {
    if (position === 1) {
      return (
        <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
          1st
        </Badge>
      );
    } else if (position === 2) {
      return (
        <Badge className="bg-gray-300 text-black hover:bg-gray-400">2nd</Badge>
      );
    } else if (position === 3) {
      return (
        <Badge className="bg-amber-600 text-white hover:bg-amber-700">
          3rd
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center h-full w-full">
      <div className="container p-4 shadow-md bg-white h-full">
        {/* <h2 className="text-2xl font-bold mb-4">Leaderboard</h2> */}
        <Table>
          <TableCaption>Top performers ranked by amount won.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Amount Won</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.data.map((user: User, index: number) => {
              console.log(user);
              return (
                <TableRow
                  key={user.id}
                  className={index < 3 ? "font-medium" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {index + 1}
                      {getPositionBadge(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.image}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${user.totalAmount.toString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeaderBoard;
