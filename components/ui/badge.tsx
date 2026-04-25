import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1c1c1c] text-[#fcfbf8] hover:opacity-90",
        secondary:
          "border-[#eceae4] bg-[#f7f4ed] text-[#5f5f5d] hover:bg-[#eceae4]",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        outline: "text-[#5f5f5d] border-[#eceae4]",
        pill: "bg-[#1c1c1c] text-[#fcfbf8] rounded-full px-3 py-1",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        md: "px-2.5 py-0.5 text-[11px]",
        lg: "px-3 py-1 text-xs",
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
