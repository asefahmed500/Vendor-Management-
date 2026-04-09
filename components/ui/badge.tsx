import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80 dark:bg-emerald-600 dark:text-emerald-50",
        warning:
          "border-transparent bg-amber-500 text-white hover:bg-amber-500/80 dark:bg-amber-600 dark:text-amber-50",
        info:
          "border-transparent bg-indigo-500 text-white hover:bg-indigo-500/80 dark:bg-indigo-600 dark:text-indigo-50",
        danger:
          "border-transparent bg-rose-500 text-white hover:bg-rose-500/80 dark:bg-rose-600 dark:text-rose-50",
        outline: "text-zinc-500 border-zinc-200 dark:text-zinc-400 dark:border-zinc-800",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
