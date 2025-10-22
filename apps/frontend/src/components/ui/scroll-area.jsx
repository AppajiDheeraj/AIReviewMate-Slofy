"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

/**
 * Render a scrollable container composed of a viewport, a scrollbar, and a corner using Radix ScrollArea primitives.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to apply to the root element.
 * @param {import('react').ReactNode} [props.children] - Content rendered inside the scroll viewport.
 * @returns {JSX.Element} The composed ScrollArea element.
 */
function ScrollArea({
  className,
  children,
  ...props
}) {
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * Renders a scrollbar for a ScrollArea that adapts layout and styling based on orientation.
 *
 * @param {("vertical"|"horizontal")} orientation - Orientation of the scrollbar; "vertical" uses a vertical track, "horizontal" uses a horizontal track.
 * @param {string} [className] - Additional CSS classes applied to the scrollbar root.
 * @returns {JSX.Element} The rendered ScrollArea scrollbar element.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar }