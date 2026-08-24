import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] border text-sm font-semibold transition-[background-color,color,transform,box-shadow] [transition-duration:var(--dur-micro)] [transition-timing-function:var(--ease-out)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 data-[state=loading]:cursor-wait data-[state=error]:border-destructive data-[state=success]:border-[var(--color-success)]",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:bg-[var(--color-accent-dark)]",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:opacity-90",
        outline:
          "border-input bg-background hover:bg-secondary",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground hover:bg-[var(--color-paper-3)]",
        ghost: "border-transparent hover:bg-secondary",
        link: "text-primary underline-offset-4 hover:underline",
        thread:
          "border-primary bg-primary text-primary-foreground hover:bg-[var(--color-accent-dark)]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-11 px-3 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
