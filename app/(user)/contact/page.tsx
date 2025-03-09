"use client";
import { InputWithLabel } from "@/components/Inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { contactFormType, contactSchema } from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

const ContactPage = () => {
  const captchaRef = React.useRef<ReCAPTCHA>(null);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<contactFormType>({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit", // This ensures validation happens on submit
  });

  const mutation = useMutation({
    mutationFn: async (data: contactFormType) => {
      const response = await axios.post("/api/public/contact-mail", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      reset();
      captchaRef.current?.reset();
    },
    onError: (error: Error) => { //? Error tpye may be wrong here
      toast.error(error.message || "Failed to send message. Please try again.");
      captchaRef.current?.reset();
    },
  });

  const onSubmit = async (data: contactFormType) => {
    // const token = captchaRef.current?.getValue();
    // if (!token) {
    //   setValue("captchaToken", '', {
    //     shouldValidate: true,
    //   });
    //   return;
    // }
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputWithLabel
        label="Enter Your Name"
        {...register("name")}
        error={errors.name}
      />
      <InputWithLabel
        label="Enter Your Email"
        {...register("email")}
        error={errors.email}
      />
      <InputWithLabel
        label="Enter Your Message"
        {...register("message")}
        error={errors.message}
      />
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
        ref={captchaRef}
        onChange={(token) =>
          setValue("captchaToken", token ?? "", { shouldValidate: true })
        }
      />
      {errors.captchaToken && (
        <p className="text-sm text-red-500">{errors.captchaToken.message}</p>
      )}
      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        {mutation.isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactPage;
