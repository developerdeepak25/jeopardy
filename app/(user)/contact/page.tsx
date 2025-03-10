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
// import ContactImage from "@/assets/images/12982910_5124556.jpg"
import Image from "next/image";

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
    <div className="flex items-center justify-center min-h-full bg-gray-100 p-6 ">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden  w-full py-6 px-4 mx-24">
        {/* Image Section */}
        <div className="hidden md:block w-1/2">
          <Image
            src="/images/contact.jpg"
            alt="Contact Us"
            className="object-cover w-full h-full"
            width={500}
            height={600}
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Contact Us
          </h2>
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
              <p className="text-sm text-red-500">
                {errors.captchaToken.message}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
