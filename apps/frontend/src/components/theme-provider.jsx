"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps a next-themes provider and forwards all received props and children to it.
 *
 * @param {Object} params - Component parameters.
 * @param {import('react').ReactNode} params.children - Child nodes to be rendered inside the provider.
 * @param {Object} [params.props] - Additional props forwarded to the underlying theme provider.
 * @returns {import('react').ReactElement} A React element rendering the theme provider with the given props and children.
 */
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}