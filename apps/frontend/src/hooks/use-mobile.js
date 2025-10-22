import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Determines whether the current viewport width is considered mobile based on MOBILE_BREAKPOINT.
 *
 * Subscribes to viewport width changes and updates the result when the window crosses the breakpoint.
 * @returns {boolean} `true` if the viewport width is less than MOBILE_BREAKPOINT, `false` otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}