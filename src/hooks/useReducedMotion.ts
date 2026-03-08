/**
 * Re-export Framer Motion's useReducedMotion hook.
 *
 * Usage:
 *   const prefersReduced = useReducedMotion();
 *   <motion.div animate={prefersReduced ? {} : { opacity: 1, y: 0 }} />
 *
 * Respects both the OS-level `prefers-reduced-motion` media query
 * and the custom `html.reduce-motion` class used by the
 * AccessibilityMenu toolkit.
 */
export { useReducedMotion } from 'framer-motion';
