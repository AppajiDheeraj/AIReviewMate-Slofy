"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

/**
 * Render a presentational label that wraps the Radix UI Label primitive with standardized styling.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names to merge with the component's default styles.
 * @returns {JSX.Element} The rendered label element.
 */
function Label({
  className,
  ...props
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Label }