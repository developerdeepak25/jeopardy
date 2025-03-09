"use client";
import React from "react";
import { InputWithLabel } from "@/components/Inputs/InputWithLabel";
import { useForm, SubmitHandler } from "react-hook-form";
import { registerFormType, registerSchema } from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerFormType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<registerFormType> = async (data) => {
    try {
      const res = await axios.post("/api/user/register", data);
      if (res.status !== 200) {
        toast.error("Registration failed. Please try again.");
        return;
      }
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2>Register Account</h2>
      <p>Please fill in your details to create an account</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md p-4"
      >
        <InputWithLabel
          label="Full Name"
          {...register("name")}
          error={errors.name}
        />
        <InputWithLabel
          label="Email Address"
          {...register("email")}
          error={errors.email}
        />
        <InputWithLabel
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password}
        />
        <Button type="submit" disabled={isSubmitting}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
