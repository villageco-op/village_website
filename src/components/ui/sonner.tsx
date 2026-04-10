"use client"

import { 
  CheckmarkCircle02Icon, 
  InformationCircleIcon, 
  Alert02Icon, 
  MultiplicationSignCircleIcon, 
  Loading03Icon 
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      offset="100px"
      style={{ zIndex: 1300 }}
      icons={{
        success: (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
        ),
        info: (
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />
        ),
        error: (
          <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        style: { translate: "-50% 0" },
        classNames: {
          toast: `
            !left-1/2 !w-max 
            !flex !items-center !justify-center !rounded-full !px-6 !py-3
            !bg-deep-forest !text-cream !border-none
            !font-heading !text-[0.82rem] !font-bold !whitespace-nowrap
            !shadow-[0_8px_32px_rgba(0,0,0,0.2)]
          `,
          title: "!text-cream",
          description: "!text-cream/80",
          icon: "!text-cream",
          actionButton: "!bg-transparent !text-lime !font-heading !font-bold !uppercase !text-[0.75rem] !ml-4",
          cancelButton: "!bg-transparent !text-cream/50 !font-heading !text-[0.75rem]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
