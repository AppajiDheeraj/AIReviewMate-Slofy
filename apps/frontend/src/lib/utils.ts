import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose and merge CSS class names, resolving conflicting Tailwind utility classes.
 *
 * @param inputs - Class values (strings, arrays, objects, or conditional expressions) to include in the composed class list
 * @returns A string containing the composed class names with conflicting Tailwind classes resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}