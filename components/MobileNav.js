"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/lib/icons";

/* The reference's mobile bottom bar, with real destinations only: no
   Favorites, no Profile, because there are no accounts and pretending
   otherwise is how trust dies. Search opens the browse panel, which is
   where search already lives. */

const ITEMS = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/tools/", icon: "square", label: "All tools" },
  { search: true, icon: "search", label: "Search" },
  { href: "/blog/", icon: "file-text", label: "Blog" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav" aria-label="Quick navigation">
      {ITEMS.map((item) =>
        item.search ? (
          <button
            key="search"
            type="button"
            onClick={() => window.dispatchEvent(new Event("tip-open-browse"))}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </Link>
        )
      )}
    </nav>
  );
}
