"use client"

import { useMemo } from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

/**
 * Render a styled fieldset container for grouping related form fields.
 *
 * @param {string} [className] - Additional class names to merge with the component's default layout classes.
 * @param {object} [props] - Additional props that are spread onto the rendered fieldset element.
 * @returns {JSX.Element} The fieldset element with data-slot="field-set" and combined classes.
 */
function FieldSet({
  className,
  ...props
}) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props} />
  );
}

/**
 * Render a field legend element with variant-controlled styling and slot attributes.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names to merge with the component's defaults.
 * @param {"legend"|"label"} [props.variant="legend"] - Visual variant that adjusts text sizing and styling.
 * @returns {JSX.Element} The legend element annotated with `data-slot="field-legend"` and `data-variant`.
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      {...props} />
  );
}

/**
 * Presentational container that groups related form fields.
 *
 * Renders a div marked with `data-slot="field-group"` and layout classes; additional props are spread onto the div.
 * @returns {JSX.Element} A div element used as the field group container.
 */
function FieldGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props} />
  );
}

const fieldVariants = cva("group/field flex w-full gap-3 data-[invalid=true]:text-destructive", {
  variants: {
    orientation: {
      vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
      horizontal: [
        "flex-row items-center",
        "[&>[data-slot=field-label]]:flex-auto",
        "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      ],
      responsive: [
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
        "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
        "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      ],
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

/**
 * Render a field group container with orientation-based styling.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes applied to the container.
 * @param {'vertical'|'horizontal'|'responsive'} [props.orientation='vertical'] - Layout orientation used to select styling variants.
 * @returns {JSX.Element} A field group element (role="group") with data-slot="field", a data-orientation attribute, and composed classes.
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props} />
  );
}

/**
 * Container for a field's main content (label and input) that applies layout classes and exposes a `data-slot="field-content"`.
 *
 * @param {string} [className] - Additional class names to merge with the default layout classes.
 * @param {object} [props] - Additional props passed through to the rendered div.
 * @returns {JSX.Element} The rendered div element serving as the field content container.
 */
function FieldContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="field-content"
      className={cn("group/field-content flex flex-1 flex-col gap-1.5 leading-snug", className)}
      {...props} />
  );
}

/**
 * Render a styled Label component used as the field's label slot.
 * @param {string} [className] - Additional class names to merge with the component's defaults.
 * @param {object} [props] - Additional props forwarded to the underlying Label component.
 * @returns {JSX.Element} The rendered Label element configured for use as a field label (includes slot and state-related classes).
 */
function FieldLabel({
  className,
  ...props
}) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      {...props} />
  );
}

/**
 * Renders a container for a field's title inside the label area.
 *
 * Merges provided `className` with the component's default styling and sets
 * `data-slot="field-label"` for consistent slot-based theming.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to append to the default classes.
 */
function FieldTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props} />
  );
}

/**
 * Renders a paragraph element used as a field's descriptive helper text.
 *
 * @param {string} [className] - Additional CSS classes to merge with the component's default styling.
 * @param {Object} [props] - Additional props spread onto the paragraph element (e.g., id, children, aria attributes).
 * @returns {JSX.Element} The paragraph element used for field description content.
 */
function FieldDescription({
  className,
  ...props
}) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props} />
  );
}

/**
 * Render a horizontal separator with optional centered content.
 * @param {import('react').ReactNode} [children] - Optional content rendered centered above the separator line.
 * @param {string} [className] - Additional class names applied to the outer container.
 * @returns {JSX.Element} The rendered separator element with a divider and optional centered content.
 */
function FieldSeparator({
  children,
  className,
  ...props
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}>
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content">
          {children}
        </span>
      )}
    </div>
  );
}

/**
 * Render validation error content for a field.
 *
 * If `children` is provided it is used as the content. Otherwise displays a single
 * error message when `errors` contains one item, a list of messages when multiple
 * errors are present, and nothing when there are no errors.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names applied to the container.
 * @param {import('react').ReactNode} [props.children] - Explicit content to render instead of deriving content from `errors`.
 * @param {{ message?: string }[]=} [props.errors] - Array of error objects; each object's `message` is displayed.
 * @returns {import('react').ReactNode} A React element with the error message(s) when present, or `null` when there is no content to show.
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    if (errors?.length == 1) {
      return errors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {errors.map((error, index) =>
          error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}>
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}