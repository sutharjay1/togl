"use client";

import { Button } from "@/components/ui/button";
import { useOnClickOutside } from "@/hook/useClickOutside";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import Logo from "./logo";

const NAV_ITEMS = [
  { name: "Docs", href: "/docs" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Status", href: "/status" },
  { name: "Contributors", href: "/contributors" },
];

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(mobileNavRef, () => setIsMobileMenuOpen(false));

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 mx-auto max-w-5xl px-2 md:px-0"
      ref={mobileNavRef}
    >
      <nav className="my-4">
        <div className="relative flex items-center justify-between rounded-2xl border border-primary/10 bg-background/80 p-3 backdrop-blur-md md:mx-2">
          <Logo />
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-base transition-colors hover:text-primary",
                    {
                      "text-primary": isActive,
                      "text-muted-foreground": !isActive,
                    },
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
            <div className="ml-2 h-6 w-px bg-primary/10" />

            <div className="ml-2 flex flex-row space-x-3">
              <Button
                className="w-full border border-input bg-transparent text-primary hover:text-primary"
                asChild
                variant="gooeyRight"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            {/* <ToggleTheme /> */}
            <div className="flex w-full flex-row space-x-2">
              <Button
                className="w-full border border-input bg-transparent px-7 text-primary hover:text-primary"
                asChild
                variant="gooeyRight"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                variant="gooeyRight"
                size="icon"
                className="w-full rounded-xl border border-input bg-transparent text-primary hover:text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 mx-2 mt-2 rounded-2xl border border-primary/10 bg-background/95 p-4 backdrop-blur-md md:mx-0 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.href === pathname;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center rounded-lg px-4 py-2 text-sm transition-colors hover:bg-primary/10",
                        {
                          "bg-primary/10 text-primary": isActive,
                          "text-muted-foreground": !isActive,
                        },
                      )}
                    >
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto h-1 w-1 rounded-full bg-primary"
                          layoutId="navbar-active-mobile"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default NavBar;
