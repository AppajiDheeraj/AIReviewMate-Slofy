import * as React from "react";
import { cn } from "@/lib/utils";
/**
 * Card container that provides base card styling and layout.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to merge with the card's base classes.
 * @param {...any} [props] - Any other props are forwarded to the root div (e.g., event handlers, data attributes).
 * @returns {JSX.Element} The rendered card root element.
 */
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
/**
 * Renders the card header container with a responsive grid layout, container-aware styling, and a slot for actions.
 *
 * @param {string} className - Additional CSS classes to merge with the component's base classes.
 * @param {object} props - Additional props forwarded to the root div (e.g., HTML attributes or event handlers).
 * @returns {JSX.Element} The header div element with data-slot="card-header".
 */
function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}
/**
 * Renders the card title container used to display a card's title.
 *
 * @param {Object} params
 * @param {string} [params.className] - Additional CSS class names to merge with the component's base classes.
 * @param {Object} [params.props] - Additional props forwarded to the rendered div.
 * @returns {JSX.Element} The div element representing the card title slot.
 */
function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}
/**
 * Renders the card description slot.
 *
 * Produces a div intended for descriptive text with muted foreground and small text sizing; forwards any additional props to the element.
 *
 * @returns {JSX.Element} The card description div element.
 */
function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}
/**
 * Render the card's action slot positioned for top-right placement within the header grid.
 * @param {string} className - Additional CSS class names to merge with the component's default classes.
 * @returns {JSX.Element} A div element with `data-slot="card-action"` configured for top-right placement; additional props are forwarded to the div.
 */
function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}
/**
 * Renders the card's content container used to wrap the card's main body.
 *
 * @param {Object} props - Props passed to the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the container.
 * @returns {JSX.Element} The card content container element with horizontal padding and forwarded props.
 */
function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}
/**
 * Render a card footer container with top-border spacing, horizontal padding, and centered flex alignment.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the component's default classes.
 * @returns {JSX.Element} The footer element for a Card with `data-slot="card-footer"`.
 */
function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};