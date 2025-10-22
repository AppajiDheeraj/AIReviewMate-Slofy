"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root container for the sheet UI.
 *
 * Renders the underlying Radix Sheet root element, attaches a `data-slot="sheet"` attribute,
 * and forwards all received props to the root element.
 * @param {object} props - Props forwarded to the Sheet root element (e.g., open state, handlers, className).
 * @returns {JSX.Element} The Sheet root element.
 */
function Sheet({
  ...props
}) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

/**
 * Render a trigger element for the Sheet that forwards received props to the underlying Radix trigger.
 * @param {object} props - Props to pass through to the underlying trigger element (e.g., event handlers, className, children).
 * @returns {JSX.Element} The Sheet trigger element with a `data-slot="sheet-trigger"` attribute.
 */
function SheetTrigger({
  ...props
}) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

/**
 * Render a sheet close trigger that forwards received props and marks the element with data-slot="sheet-close".
 *
 * @param {object} props - Props forwarded to the underlying close element (e.g., event handlers, className, aria attributes).
 * @returns {import('react').JSX.Element} The rendered sheet close element.
 */
function SheetClose({
  ...props
}) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/**
 * Render a Sheet portal that forwards all received props to Radix's Portal element.
 * @param {object} props - Props to forward to the underlying Portal element.
 * @returns {JSX.Element} The rendered Sheet portal element with data-slot="sheet-portal".
 */
function SheetPortal({
  ...props
}) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Render the sheet overlay backdrop with default backdrop, positioning, and open/close animation classes.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names to merge with the overlay's default classes.
 * @returns {JSX.Element} The overlay element for the sheet.
 */
function SheetOverlay({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

/**
 * Render the sheet's content area inside a portal with side-specific sizing, animations, overlay, and an integrated close button.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the component's default styling.
 * @param {import('react').ReactNode} [props.children] - Content to render inside the sheet.
 * @param {'right'|'left'|'top'|'bottom'} [props.side="right"] - Edge from which the sheet opens; adjusts positioning, size, and enter/exit animations.
 * @returns {import('react').JSX.Element} The rendered sheet content element (wrapped in a portal with overlay and close control).
 */
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}>
        {children}
        <SheetPrimitive.Close
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/**
 * Renders a sheet header container with vertical layout, spacing, and padding.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the component's default classes.
 * @returns {JSX.Element} The rendered header element.
 */
function SheetHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props} />
  );
}

/**
 * Render a footer container for the sheet that pushes content to the end and applies spacing and padding.
 *
 * @param {string} [className] - Additional CSS class names to merge with the component's default layout and spacing classes.
 * @returns {JSX.Element} The sheet footer element.
 */
function SheetFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} />
  );
}

/**
 * Renders the sheet's title element with default title styles and optional additional classes.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to merge with the default title styles.
 * @returns {JSX.Element} The rendered Sheet title element.
 */
function SheetTitle({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props} />
  );
}

/**
 * Render a sheet description element with the component's default muted text styling.
 *
 * @param {string} [className] - Additional CSS classes to merge with the component's default classes.
 * @param {Object} [props] - Additional props forwarded to the underlying Description element.
 * @returns {JSX.Element} The SheetPrimitive.Description element with merged classes and forwarded props.
 */
function SheetDescription({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}