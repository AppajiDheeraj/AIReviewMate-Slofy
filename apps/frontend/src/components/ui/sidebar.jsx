"use client";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

/**
 * Access the sidebar context provided by a SidebarProvider.
 *
 * @returns {SidebarContext} The context value with sidebar state and controls (state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar).
 * @throws {Error} If called outside of a SidebarProvider.
 */
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

/**
 * Provides sidebar state and controls to descendants and renders the sidebar wrapper.
 *
 * Exposes context values including `state` ("expanded" | "collapsed"), `open`, `setOpen`,
 * `isMobile`, `openMobile`, `setOpenMobile`, and `toggleSidebar`. Persists desktop open
 * state to a cookie and registers a global keyboard shortcut (Cmd/Ctrl+B) to toggle the sidebar.
 *
 * @param {Object} props
 * @param {boolean} [props.defaultOpen=true] - Initial open state when the component is uncontrolled.
 * @param {boolean} [props.open] - Controlled open state; when provided, takes precedence over internal state.
 * @param {(boolean) => void} [props.onOpenChange] - Controlled state updater called when open state changes.
 * @param {string} [props.className] - Additional class names applied to the outer wrapper.
 * @param {React.CSSProperties} [props.style] - Inline styles applied to the outer wrapper; CSS variables for sidebar widths are merged.
 * @param {React.ReactNode} [props.children] - Rendered children inside the provider.
 * @returns {JSX.Element} The SidebarContext provider wrapping children with a TooltipProvider and a styled wrapper.
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [setOpenProp, open])

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar])

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style
            }
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/**
 * Renders a responsive sidebar that adapts between mobile (sheet) and desktop layouts and supports variants and collapsible behaviors.
 *
 * @param {Object} props - Component props.
 * @param {"left"|"right"} [props.side="left"] - Which side of the viewport the sidebar is attached to.
 * @param {"sidebar"|"floating"|"inset"} [props.variant="sidebar"] - Visual variant affecting padding, borders, rounding, and shadow.
 * @param {"offcanvas"|"icon"|"none"} [props.collapsible="offcanvas"] - Collapsible mode: `none` renders a non-collapsible panel; `offcanvas` slides out of view; `icon` collapses to an icon rail.
 * @param {string} [props.className] - Additional class names applied to the outer container.
 * @param {import('react').ReactNode} [props.children] - Sidebar content.
 * @param {Object} [props...] - Additional props forwarded to the rendered container or Sheet component.
 * @returns {import('react').ReactElement} The rendered sidebar element configured for the current device and props.
 */
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE
            }
          }
          side={side}>
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar">
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )} />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}>
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Render a compact sidebar toggle button that activates the sidebar toggle handler from context.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {(event: import('react').MouseEvent) => void} [props.onClick] - Optional click handler that will be invoked before the sidebar toggle.
 * @returns {JSX.Element} The trigger button element that calls the provided `onClick` (if any) and then toggles the sidebar. 
 */
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}>
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/**
 * Renders a slim rail button anchored to the sidebar edge that toggles the sidebar visibility.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional CSS classes to apply to the rail button.
 * @returns {JSX.Element} The sidebar rail button element which forwards remaining props to the underlying button.
 */
function SidebarRail({
  className,
  ...props
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props} />
  );
}

/**
 * Layout container for the application's main content when the sidebar uses the inset variant.
 *
 * Applies responsive inset-specific spacing and visual styles, and forwards any additional props to the root <main> element.
 * @param {string} [className] - Additional CSS classes to apply to the root element.
 * @param {object} [props] - Additional props forwarded to the root <main> element.
 * @returns {JSX.Element} The rendered <main> element serving as the sidebar inset content area.
 */
function SidebarInset({
  className,
  ...props
}) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props} />
  );
}

/**
 * Render an Input styled for use inside the sidebar.
 *
 * @param {object} props - Props passed to the underlying Input component.
 * @param {string} [props.className] - Additional CSS classes to apply to the input.
 * @return {JSX.Element} The sidebar-styled Input element.
 */
function SidebarInput({
  className,
  ...props
}) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props} />
  );
}

/**
 * Render a header container for sidebar content.
 *
 * The element receives layout classes for vertical stacking and spacing, sets
 * `data-slot="sidebar-header"` and `data-sidebar="header"` attributes, forwards
 * remaining props to the root element, and merges any `className` provided.
 *
 * @param {string} [className] - Additional CSS classes to apply to the header.
 * @returns {JSX.Element} The sidebar header container element.
 */
function SidebarHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props} />
  );
}

/**
 * Render the footer area inside a sidebar.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the footer container.
 * @returns {JSX.Element} A div element configured as the sidebar footer (`data-slot="sidebar-footer"`), forwarding remaining props to the element.
 */
function SidebarFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props} />
  );
}

/**
 * Render a themed Separator configured for sidebar layouts.
 *
 * @param {string} [className] - Additional CSS class names to merge with the component's default sidebar styles.
 * @param {Object} [props] - Additional props forwarded to the underlying Separator element.
 * @returns {JSX.Element} The rendered Separator element with sidebar-specific data attributes and classes.
 */
function SidebarSeparator({
  className,
  ...props
}) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props} />
  );
}

/**
 * Render the sidebar's scrollable content container.
 *
 * Renders a div intended to host the main sidebar children and provide vertical scrolling;
 * it respects the sidebar's collapsed icon state by hiding overflow when appropriate.
 * @returns {JSX.Element} A div element serving as the sidebar's scrollable content container.
 */
function SidebarContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Render a vertical group container for related sidebar items.
 * @param {string} [className] - Additional CSS class names to apply to the wrapper.
 * @param {object} [props] - Additional props are spread onto the wrapper <div> (e.g., event handlers, aria attributes).
 * @returns {JSX.Element} A <div> element that groups sidebar content and applies layout padding and flex column styling.
 */
function SidebarGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props} />
  );
}

/**
 * Render a styled label element for a sidebar group, adapting layout for collapsible/icon modes.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names to apply to the label container.
 * @param {boolean} [props.asChild=false] - If true, use a Slot so the caller can supply the element type; otherwise render a `div`.
 * @returns {JSX.Element} The rendered sidebar group label element.
 */
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props} />
  );
}

/**
 * Render an absolute-positioned action control for a sidebar group.
 *
 * @param {string} [className] - Additional CSS class names to apply to the element.
 * @param {boolean} [asChild=false] - If true, renders the provided child element (via `Slot`) instead of a native `button`.
 * @param {...any} props - Additional props forwarded to the rendered element (e.g., event handlers, ARIA attributes).
 * @returns {JSX.Element} A positioned action element suitable for use inside a sidebar group.
 */
function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Renders a container for the content of a sidebar group.
 * @param {string} className - Additional CSS class names to apply to the container.
 * @param {Object} [props] - Additional props passed through to the root div.
 * @returns {JSX.Element} The rendered div element for sidebar group content.
 */
function SidebarGroupContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props} />
  );
}

/**
 * Render a vertical list element configured as the sidebar menu.
 *
 * Renders a <ul> element with data attributes for sidebar integration, baseline layout classes, and any
 * additional classes or HTML attributes passed via props.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to append to the menu container.
 * @returns {JSX.Element} A `<ul>` element configured as the sidebar menu with merged classes and passed props.
 */
function SidebarMenu({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props} />
  );
}

/**
 * Render a list item used as a sidebar menu item.
 *
 * Forwards additional DOM props to the underlying <li> and applies sidebar-specific data attributes and classes.
 * @returns {JSX.Element} The `<li>` element representing the sidebar menu item.
 */
function SidebarMenuItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props} />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Render a styled sidebar menu button with optional tooltip and variant/size states.
 *
 * Renders either a plain button or a passed-through child element when `asChild` is true, applies active/variant/size styling, and—if `tooltip` is provided—wraps the button in a tooltip that is hidden when the sidebar is expanded or on mobile.
 *
 * @param {Object} props - Component props.
 * @param {boolean} [props.asChild=false] - If true, renders the provided child element (Slot) instead of a native `button`.
 * @param {boolean} [props.isActive=false] - Marks the button as active for styling (`data-active`).
 * @param {string} [props.variant="default"] - Visual variant for the button (controls styling).
 * @param {string} [props.size="default"] - Size variant for the button (controls styling).
 * @param {string|Object} [props.tooltip] - If a string, used as tooltip content; if an object, forwarded to TooltipContent as props.
 * @param {string} [props.className] - Additional class names to apply to the button.
 * @returns {JSX.Element} A JSX element representing the sidebar menu button, optionally wrapped with a tooltip.
 */
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props} />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip} />
    </Tooltip>
  );
}

/**
 * Renders a positioned action control for a sidebar menu item.
 *
 * The component places an icon-sized action (button or passed child element) at the top-right of a menu item,
 * increases the mobile hit area, hides in collapsible-icon sidebar states, and can be configured to only show on hover/active.
 *
 * @param {string} [className] - Additional CSS classes applied to the action element.
 * @param {boolean} [asChild=false] - If true, renders a Slot and forwards props to the child instead of rendering a native `button`.
 * @param {boolean} [showOnHover=false] - If true, hides the action by default on desktop and reveals it on hover/active/focus states.
 * @param {Object} [props] - Additional props forwarded to the underlying element (`button` or `Slot`), including event handlers and ARIA attributes.
 * @returns {JSX.Element} A JSX element that renders the sidebar menu action control.
 */
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props} />
  );
}

/**
 * Render a small positioned badge for a sidebar menu button.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes applied to the badge container.
 * @returns {JSX.Element} The badge element positioned at the right edge of a sidebar menu button.
 */
function SidebarMenuBadge({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Renders a skeleton placeholder for a sidebar menu item.
 *
 * The text placeholder receives a randomized width between 50% and 90% to simulate loading.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names applied to the root container.
 * @param {boolean} [props.showIcon=false] - Whether to render an icon placeholder at the start of the item.
 * @returns {JSX.Element} A JSX element representing the menu item skeleton. */
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}>
      {showIcon && (
        <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width
          }
        } />
    </div>
  );
}

/**
 * Render a nested submenu container for sidebar menu items.
 *
 * Renders a styled <ul> with data attributes used by the sidebar system, applies
 * default layout and border classes, hides when the sidebar is in the collapsible
 * icon state, and forwards additional props to the underlying element.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the list.
 * @returns {JSX.Element} The rendered unordered list element for a nested sidebar menu.
 */
function SidebarMenuSub({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Render a list item container for a sidebar sub-menu.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the list item.
 * @returns {JSX.Element} The rendered `<li>` element representing a sidebar sub-menu item.
 */
function SidebarMenuSubItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props} />
  );
}

/**
 * Renders a sub-menu control for a sidebar as an anchor or a provided child component.
 *
 * Renders an accessible, styled element for nested sidebar menu items and applies size and active state variations.
 *
 * @param {Object} options - Component props.
 * @param {boolean} [options.asChild=false] - If true, renders the passed child component (Slot) instead of an anchor.
 * @param {'sm'|'md'} [options.size='md'] - Visual size variant; controls typography and spacing.
 * @param {boolean} [options.isActive=false] - When true, applies the active styling variant.
 * @param {string} [options.className] - Additional class names to apply to the element.
 * @param {Object} [options.props] - Additional props forwarded to the rendered element (e.g., href, onClick, aria-*).
 * @returns {JSX.Element} The rendered anchor or child element configured as a sidebar sub-menu button.
 */
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}