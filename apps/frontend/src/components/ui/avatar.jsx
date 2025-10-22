"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Renders the avatar root element used as the container for an avatar image or fallback.
 *
 * Merges provided `className` with default avatar styles and forwards all other props to the underlying Radix Avatar root element.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the default avatar styles.
 * @returns {JSX.Element} The Radix `AvatarPrimitive.Root` element with `data-slot="avatar"` and composed classes.
 */
function Avatar({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props} />
  );
}

/**
 * Render the avatar image slot with default square aspect and sizing styles.
 * @param {string} [className] - Additional CSS class names appended to the default image classes.
 * @param {Object} [props] - Additional props forwarded to the underlying AvatarPrimitive.Image element.
 * @returns {JSX.Element} The React element representing the avatar image slot.
 */
function AvatarImage({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props} />
  );
}

/**
 * Renders a styled avatar fallback slot displayed when the avatar image is unavailable.
 * @param {{className?: string, [key: string]: any}} props - Props forwarded to the underlying Radix Avatar Fallback.
 * @param {string} [props.className] - Additional CSS classes merged with the component's default classes.
 * @returns {JSX.Element} The Avatar Fallback React element.
 */
function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback }