import { Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">How It Works</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Social</h4>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="mailto:contact@PriceWatcher.com" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Newsletter</h4>
            <p className="text-sm text-muted-foreground">Subscribe to our newsletter for updates and exclusive offers.</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PriceWatcher. All rights reserved.
        </div>
      </div>
    </footer>
  );
}