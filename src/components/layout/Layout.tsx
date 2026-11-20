import "lenis/dist/lenis.css";

import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollPercent } from "@/components/ScrollPercent";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No <html>/<body> here: this is a Vite SPA mounted into #root (index.html owns
  // those). Rendering them makes React 19 hoist the app out of #root, and then no
  // React event handlers (onClick etc.) fire.
  return (
    <SmoothScroll>
      <ScrollPercent />
      {children}
    </SmoothScroll>
  );
}
