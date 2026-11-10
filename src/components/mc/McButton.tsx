import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const mcButton = cva("mc-btn", {
  variants: {
    variant: {
      stone: "bg-stone text-foreground",
      emerald: "bg-grass text-primary-foreground hover:shadow-[var(--bevel),var(--glow-emerald)]",
      lava: "bg-lava text-primary-foreground hover:shadow-[var(--bevel),var(--glow-lava)]",
      portal: "bg-portal text-primary-foreground hover:shadow-[var(--bevel),var(--glow-portal)]",
      dark: "bg-obsidian-3 text-foreground",
      selected: "bg-grass-dark text-mc-yellow outline-2 outline-mc-yellow -outline-offset-4",
    },
    size: {
      sm: "px-3 py-2 text-[0.6rem]",
      md: "px-5 py-3",
      lg: "px-6 py-4 text-[0.75rem] sm:px-8",
      icon: "h-11 w-11 p-0",
    },
  },
  defaultVariants: { variant: "stone", size: "md" },
});

type Variants = VariantProps<typeof mcButton>;

export const McButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & Variants>(
  function McButton({ className, variant, size, type = "button", ...props }, ref) {
    return <button ref={ref} type={type} className={cn(mcButton({ variant, size }), className)} {...props} />;
  },
);

export function McLink({
  className,
  variant,
  size,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & Variants) {
  return <a className={cn(mcButton({ variant, size }), className)} {...props} />;
}
