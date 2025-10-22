"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render a Dialog root element with a data-slot of "dialog".
 *
 * @param {Object} props - Props forwarded to the underlying Dialog root.
 * @returns {JSX.Element} The rendered dialog root element.
 */
function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Render a dialog trigger element with a data-slot attribute.
 * @param {Object} props - Props forwarded to the underlying trigger element; a `data-slot="dialog-trigger"` attribute is always applied.
 * @return {React.ReactElement} The rendered dialog trigger element.
 */
function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Render a dialog portal element with a data-slot marker and forwarded props.
 * @param {object} props - Props forwarded to the portal element.
 * @returns {JSX.Element} A portal element with `data-slot="dialog-portal"` and the provided props.
 */
function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Wraps Radix's DialogPrimitive.Close, forwarding all props and attaching data-slot="dialog-close".
 * @param {object} props - Props to pass through to the underlying Close element (e.g., children, className, onClick).
 * @returns {JSX.Element} A Dialog close element with the data-slot attribute and forwarded props.
 */
function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Renders a dialog backdrop overlay with consistent styling and animation hooks.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to merge with the overlay's default classes.
 * @returns {JSX.Element} The dialog overlay element with a `data-slot="dialog-overlay"` attribute and a composed className for positioning, backdrop, and open/close animations.
 */
function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

/**
 * Renders dialog content inside a portal with an overlay and an optional close button.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional class names applied to the content container.
 * @param {import('react').ReactNode} [props.children] - Content to render inside the dialog.
 * @param {boolean} [props.showCloseButton=true] - Whether to render the built-in close button.
 * @returns {JSX.Element} The dialog content element rendered within a portal and overlay.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * Render a dialog header container with standardized layout and slot metadata.
 * @param {string} className - Additional CSS class names to merge with the component's default layout classes.
 * @returns {JSX.Element} The header element with `data-slot="dialog-header"` and the composed className.
 */
function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props} />
  );
}

/**
 * Renders the dialog footer container that arranges action elements responsively.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the component's default layout classes.
 * @returns {JSX.Element} The dialog footer element with `data-slot="dialog-footer"`.
 */
function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props} />
  );
}

/**
 * Renders the dialog's title element with consistent styling and a `data-slot="dialog-title"` attribute.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the default title styles.
 * @returns {JSX.Element} A React element representing the dialog title.
 */
function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props} />
  );
}

/**
 * Render a styled dialog description element.
 *
 * @param {string} className - Additional CSS classes to apply to the description.
 * @param {...any} props - Additional props forwarded to the underlying description element.
 * @returns {JSX.Element} The rendered DialogPrimitive.Description element.
 */
function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}