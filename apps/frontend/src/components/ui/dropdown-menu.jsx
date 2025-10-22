"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders the DropdownMenu root wrapper with a consistent `data-slot` attribute for composition.
 *
 * @param {object} props - Props forwarded to the underlying Radix DropdownMenu Root element.
 * @returns {JSX.Element} The rendered DropdownMenu root element.
 */
function DropdownMenu({
  ...props
}) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Renders a Radix DropdownMenu Portal wrapper that forwards props and sets data-slot="dropdown-menu-portal".
 * @param {Object} props - Props to pass through to the underlying Radix DropdownMenu Portal.
 * @returns {JSX.Element} The rendered DropdownMenu Portal element.
 */
function DropdownMenuPortal({
  ...props
}) {
  return (<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />);
}

/**
 * Renders a Trigger element for the DropdownMenu.
 *
 * The component forwards all received props to the underlying trigger and applies
 * a data-slot attribute of "dropdown-menu-trigger" for composition and styling hooks.
 *
 * @param {Object} props - Props to forward to the underlying trigger element.
 * @returns {JSX.Element} The rendered DropdownMenu trigger element.
 */
function DropdownMenuTrigger({
  ...props
}) {
  return (<DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />);
}

/**
 * Renders styled dropdown menu content inside a portal.
 * @param {string} [className] - Additional CSS classes to merge with the component's default styles.
 * @param {number} [sideOffset=4] - Distance in pixels between the trigger and the content.
 * @param {Object} [props] - Additional props forwarded to the underlying Radix DropdownMenu Content.
 * @return {JSX.Element} The DropdownMenu content element wrapped in a portal.
 */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props} />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * Renders a grouped container for dropdown menu items with a data-slot of "dropdown-menu-group".
 *
 * @returns {JSX.Element} The DropdownMenu Group element.
 */
function DropdownMenuGroup({
  ...props
}) {
  return (<DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />);
}

/**
 * Renders a styled dropdown menu item backed by the Radix DropdownMenu primitive.
 *
 * @param {string} [className] - Additional CSS class names to merge with the component's default styles.
 * @param {boolean} [inset] - When true, applies inset padding to align the item with other inset content.
 * @param {string} [variant="default"] - Visual variant modifier (e.g., "default", "destructive") applied via data attribute.
 * @param {Object} [props] - Additional props spread to the underlying Radix DropdownMenu.Item (e.g., event handlers, accessibility attributes).
 * @returns {JSX.Element} The rendered DropdownMenu item element.
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} />
  );
}

/**
 * Render a checkbox-style dropdown menu item with an indicator and an optional checked state.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the item.
 * @param {import('react').ReactNode} [props.children] - Content rendered as the item's label.
 * @param {boolean} [props.checked] - Whether the checkbox item is checked.
 * @returns {import('react').ReactElement} The rendered checkbox menu item element.
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}>
      <span
        className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/**
 * Render a radio group container for dropdown menu radio items.
 * @param {Object} props - Props forwarded to the underlying RadioGroup element.
 * @returns {JSX.Element} The rendered dropdown menu RadioGroup.
 */
function DropdownMenuRadioGroup({
  ...props
}) {
  return (<DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />);
}

/**
 * Render a styled dropdown menu radio item with a left-aligned selection indicator.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes applied to the root element.
 * @param {import('react').ReactNode} [props.children] - Content shown as the item's label.
 * @param {Object} [props.*] - Any other props are forwarded to the underlying RadioItem primitive.
 * @returns {JSX.Element} The rendered dropdown menu radio item element.
 */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      <span
        className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/**
 * Render a styled dropdown menu label element with optional inset padding.
 *
 * @param {string} [className] - Additional CSS classes to apply to the label.
 * @param {boolean} [inset] - If true, applies inset left padding to align with item indicators.
 * @param {Object} [props] - Additional props forwarded to the underlying Radix Label primitive.
 * @returns {JSX.Element} The rendered DropdownMenu label element.
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
      {...props} />
  );
}

/**
 * Render a styled separator for dropdown menu items.
 * @param {string} [className] - Optional additional CSS classes to apply to the separator.
 * @param {object} [props] - Additional props forwarded to the underlying Separator primitive.
 * @returns {JSX.Element} The rendered dropdown menu separator element.
 */
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props} />
  );
}

/**
 * Renders a styled span for displaying keyboard shortcut text inside a dropdown menu.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the element.
 * @returns {JSX.Element} A span element with shortcut styling and data-slot="dropdown-menu-shortcut".
 */
function DropdownMenuShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props} />
  );
}

/**
 * Render a Radix DropdownMenu Sub wrapper that forwards props and sets a consistent data-slot for composition.
 * @param {object} props - Props forwarded to the underlying Radix DropdownMenu.Sub element.
 * @returns {JSX.Element} The rendered DropdownMenu Sub component.
 */
function DropdownMenuSub({
  ...props
}) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * Render a styled submenu trigger that opens a nested dropdown and displays a right-pointing chevron.
 *
 * @param {string} [className] - Additional CSS classes to merge with the component's default classes.
 * @param {boolean} [inset] - If `true`, apply inset styling (adds left padding to align with item indicators).
 * @param {import('react').ReactNode} [children] - Trigger content.
 * @param {Object} [props] - Additional props forwarded to the underlying Radix `SubTrigger` element.
 * @returns {JSX.Element} The rendered dropdown submenu trigger element.
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/**
 * Renders the submenu content element for a dropdown, including positioning, animations, and styling.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to merge with the component's default styling.
 * @returns {JSX.Element} The submenu content element.
 */
function DropdownMenuSubContent({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props} />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}