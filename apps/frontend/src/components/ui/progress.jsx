"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * Render a styled progress bar whose filled indicator is positioned according to `value`.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional class names applied to the root container.
 * @param {number} [props.value=0] - Progress percentage from 0 to 100; 0 results in an empty indicator, 100 results in a fully filled indicator.
 * @param {Object} [props.rest] - Additional props are spread onto the root progress element.
 * @returns {JSX.Element} The rendered progress bar component.
 */
function Progress({
  className,
  value,
  ...props
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress }