import { cn } from "@/lib/utils"

/**
 * Render a lightweight visual skeleton used as a placeholder while content loads.
 * @param {Object} options - Component props.
 * @param {string} [options.className] - Additional CSS classes merged with the component's default "bg-accent animate-pulse rounded-md".
 * @param {Object} [options.props] - Additional props spread onto the root div (e.g., id, style, aria attributes).
 * @returns {JSX.Element} A div with a pulsing background and rounded corners used as a loading placeholder.
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }