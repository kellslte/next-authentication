"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(32, {
      message: "Password must be between 6 and 32 characters",
    }),
});

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>("password");
  const router = useRouter();

  const formDetails = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmission = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    setTimeout(() => {
      if (response!.ok && response!.status === 200) {
        setIsSubmitting(false);
        toast.success("User Logged In Successfully");
        router.push("/dashboard");
      }
    }, 3000);
  };

  const changeInputType = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <Form {...formDetails}>
      <form
        method="post"
        className="space-y-4 w-[30rem]"
        onSubmit={formDetails.handleSubmit(handleFormSubmission)}
      >
        <FormField
          control={formDetails.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formDetails.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex itemsce-center">
                  <Input
                    {...field}
                    type={inputType}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={changeInputType}
                    className="-ml-6"
                  >
                    {inputType === "password" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-center justify-center my-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
