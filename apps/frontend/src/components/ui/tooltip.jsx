"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * Render a Radix Tooltip provider that configures tooltip behavior for its children.
 *
 * @param {number} [delayDuration=0] - Milliseconds to wait before showing the tooltip.
 * @param {object} props - Additional props forwarded to the underlying TooltipPrimitive.Provider.
 * @returns {JSX.Element} The configured TooltipPrimitive.Provider element with forwarded props.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (<TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />);
}

/**
 * Compose a TooltipPrimitive.Root enclosed by a TooltipProvider to ensure provider context.
 * @param {Object} props - Props forwarded to TooltipPrimitive.Root (for example: children, open, defaultOpen, onOpenChange, etc.).
 * @returns {JSX.Element} The Tooltip root element wrapped with its provider.
 */
function Tooltip({
  ...props
}) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

/**
 * Render the interactive element that toggles tooltip visibility.
 * @param {object} props - Props forwarded to the underlying trigger element (e.g., event handlers, className, children).
 * @returns {JSX.Element} The tooltip trigger React element with forwarded props.
 */
function TooltipTrigger({
  ...props
}) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Renders tooltip content and its arrow inside a portal.
 *
 * Renders a positioned tooltip panel with default styling and an arrow, and mounts it in a portal.
 *
 * @param {string} [className] - Additional CSS class names applied to the content container.
 * @param {number} [sideOffset=0] - Distance in pixels between the trigger and the content.
 * @param {import('react').ReactNode} [children] - Content to display inside the tooltip.
 * @param {Object} [props] - Additional props forwarded to the rendered tooltip content element.
 * @returns {JSX.Element} The rendered tooltip content element including its arrow.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}>
        {children}
        <TooltipPrimitive.Arrow
          className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }