import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Compose multiple class name inputs into a single class string and resolve Tailwind CSS conflicts.
 *
 * @param {...any} inputs - Class name inputs (strings, arrays, objects, or falsy values) to be combined.
 * @returns {string} The final merged class string with conflicting Tailwind classes resolved.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}