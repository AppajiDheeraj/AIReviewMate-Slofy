"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Render a styled separator element with configurable orientation and decorative behavior.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the separator.
 * @param {"horizontal"|"vertical"} [props.orientation="horizontal"] - Orientation of the separator.
 * @param {boolean} [props.decorative=true] - Whether the separator is decorative; controls the primitive's decorative attribute.
 * @returns {JSX.Element} A React element representing the separator.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props} />
  );
}

export { Separator }