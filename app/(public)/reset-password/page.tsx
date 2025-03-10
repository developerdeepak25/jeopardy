"use client";
import { InputWithLabel } from "@/components/Inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import AuthPageWrapper from "@/components/common/AuthPageWrapper";
import FormWrapper from "@/components/common/FormWrapper";

// TODO move to zod schema file
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async (data: ResetPasswordInputs) => {
    try {
      const res = await axios.post("/api/auth/reset-password", {
        password: data.password,
        token,
      });

      if (res.status !== 200) {
        toast.error("Failed to reset password. Please try again.");
        return;
      }
      toast.success("Password reset successful. You can now login.");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <AuthPageWrapper>
      <FormWrapper
        title="Reset Password"
        description="Please enter your email to receive password reset link"
      >
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="flex flex-col gap-4 w-full min-w-sm"
        >
          <InputWithLabel
            label="Enter Password"
            type="password"
            {...register("password")}
            error={errors.password}
          />
          <InputWithLabel
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </FormWrapper>
    </AuthPageWrapper>
  );
};

const ResetPasswordPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* //? IDK useSearchParams asked for suspense at build time */}
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
