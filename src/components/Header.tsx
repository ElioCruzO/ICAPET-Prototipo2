import { Package } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/contacts" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Contact Keeper
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
