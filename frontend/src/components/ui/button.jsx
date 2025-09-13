import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-[#B399D4] text-white hover:bg-[#A085C4] shadow-sm", // Purple color
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-2 border-[#B399D4] bg-transparent text-[#B399D4] hover:bg-[#B399D4] hover:text-white",
    secondary: "bg-[#A085C4] text-white hover:bg-[#8F71B4]", // Darker purple
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-[#B399D4] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }