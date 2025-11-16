"use client";

import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
          <TooltipProvider delayDuration={150}>
            {children}
          </TooltipProvider>

      </body>
    </html>
  );
}
