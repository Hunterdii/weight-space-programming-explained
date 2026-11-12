import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import React, { forwardRef } from "react";

export interface LinkProps extends NextLinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> {}

/**
 * Custom Link component defaulting to prefetch={false}
 * to prevent background RSC segment 404 requests in Next.js static exports.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { prefetch = false, ...props },
  ref
) {
  return <NextLink ref={ref} prefetch={prefetch} {...props} />;
});

export default Link;
