'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export const NavLink = ({
  href,
  children,
  className = "",
  activeClassName = "font-semibold",
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-primary",
        className,
        isActive && activeClassName
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;