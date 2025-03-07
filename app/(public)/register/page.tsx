"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { registerFormType, registerSchema } from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerFormType>({
    resolver: zodResolver(registerSchema),
  });

  // ?dev
  useEffect(() => {
    console.log(errors);
  });

  const onSubmit: SubmitHandler<registerFormType> = async (data) => {
    console.log(data);
    // const getGeopardyTable = async () => {/
    const res = await axios.post("/api/user/register", data);
    console.log(res);
  };
  return (
    <div>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="container">
          <h1>Login page</h1>
          <Input placeholder="Name" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p>{errors.email?.message}</p>}
          <Input placeholder="Password" {...register("password")} />
          {errors.password && <p>{errors.password?.message}</p>}
          {errors && <p>{errors.root?.message}</p>}
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;
