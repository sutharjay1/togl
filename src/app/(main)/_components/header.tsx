"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/global/logo";
import UserDropdownMenu from "@/components/global/user-avatar";
import { useOnClickOutside } from "@/hook/use-click-outside";
import { useRef, useState } from "react";

const NAV_ITEMS = [
  { name: "Docs", href: "/docs" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Status", href: "/status" },
  { name: "Contributors", href: "/contributors" },
];

const Header = () => {
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
        <div className="relative flex items-center justify-between rounded-2xl bg-background/80 p-3 backdrop-blur-md">
          <Logo />
          <div className="hidden items-center gap-1 md:flex">
            <div className="ml-2 mr-2 h-6 w-px bg-primary/10" />
            <UserDropdownMenu />
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex w-full flex-1 flex-grow flex-row space-x-2">
              <UserDropdownMenu className="px-1.5" variant="gooeyLeft" />
              {/* <Button
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
              </Button> */}
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
              className="absolute left-0 right-0 mx-4 mt-2 rounded-2xl border border-primary/10 bg-background/95 p-4 backdrop-blur-md md:mx-0 md:hidden"
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

export default Header;
