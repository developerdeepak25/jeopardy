"use client";
import QuestionsList from "@/components/Pages/Admin/QuestionsList";
import UsersList from "@/components/Pages/Admin/UsersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPanel() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="users">User Profiles</TabsTrigger>
          <TabsTrigger value="questions">MCQ Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersList />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
