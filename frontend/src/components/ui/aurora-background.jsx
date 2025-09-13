"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900",
          className
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            "--aurora": "repeating-linear-gradient(100deg,#81D4BB_10%,#B5D0D9_15%,#E3C0D5_20%,#CEC5DD_25%,#81D4BB_30%)",
            "--dark-gradient": "repeating-linear-gradient(100deg,#26262A_0%,#26262A_7%,transparent_10%,transparent_12%,#26262A_16%)",
            "--white-gradient": "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
            "--tiffany": "#81D4BB",
            "--columbia": "#B5D0D9",
            "--thistle": "#E3C0D5",
            "--light-thistle": "#CEC5DD",
            "--raisin": "#26262A",
            "--white": "#fff",
            "--transparent": "transparent"
          }}
        >
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--tiffany)_10%,var(--columbia)_15%,var(--thistle)_20%,var(--light-thistle)_25%,var(--tiffany)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--raisin)_0%,var(--raisin)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--raisin)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-multiply after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:after:[background-image:var(--dark-gradient),var(--aurora)]`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,var(--tiffany)_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};