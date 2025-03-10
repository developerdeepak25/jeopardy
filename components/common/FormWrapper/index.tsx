import React from "react";
import { cn } from "@/lib/utils";

interface FormWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const FormWrapper = ({
  title,
  description,
  children,
  className,
  ...props
}: FormWrapperProps) => {
  return (
    <div
      className={cn("space-y-6 border border-gray-300 p-6 py-10 rounded-lg w-fit", className)}
      {...props}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="bg-card">{children}</div>
    </div>
  );
};

export default FormWrapper;
