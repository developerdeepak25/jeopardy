import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Alert from "@/components/Alert";

const getUsers = async () => {
  const response = await axios.get("/api/admin/user");
  return response.data;
};

const deleteUser = async (userId: string) => {
  const response = await axios.delete(`/api/admin/user/${userId}`);
  return response.data;
};

const UsersList = () => {
  const queryClient = useQueryClient();
  const {
    data: users,
    error,
    isPending,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteUser = (userId: string) => {
    console.log("Delete user:", userId);
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      console.log("Delete user success:", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteDialogOpen(false);
      console.log("User deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  if (error) {
    console.error("Error fetching users:", error);
    return <div>Error loading users</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Answers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>${user.totalAmount}</TableCell>
                  <TableCell>{user._count.Answer}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      <Alert
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default UsersList;
