import { cn } from "@/lib/utils"

interface GradientBarProps {
  className?: string
}

export function GradientBar({ className }: GradientBarProps) {
  return (
    <div 
      className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-lime via-sun to-lime z-20",
        className
      )} 
    />
  )
}
