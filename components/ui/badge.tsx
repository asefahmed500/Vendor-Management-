import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-pill border px-2.5 py-0.5 text-badge transition-colors focus:outline-none focus:ring-2 focus:ring-[#097fe8]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0075de] text-notion-white hover:opacity-90",
        secondary:
          "border-[rgba(0,0,0,0.1)] bg-[#f2f9ff] text-[#097fe8] hover:bg-[#e6f3ff]",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        outline: "text-[#615d59] border-[rgba(0,0,0,0.1)]",
        pill: "bg-[#0075de] text-notion-white rounded-pill px-3 py-1",
        success: "border-transparent bg-[#1aae39]/10 text-[#1aae39]",
        warning: "border-transparent bg-[#dd5b00]/10 text-[#dd5b00]",
        danger: "border-transparent bg-red-100 text-red-700",
        info: "border-transparent bg-[#0075de]/10 text-[#0075de]",
      },
      size: {
        sm: "px-1.5 py-0 text-micro",
        md: "px-2.5 py-0.5 text-badge",
        lg: "px-3 py-1 text-caption",
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
