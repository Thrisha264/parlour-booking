import { Link } from "@tanstack/react-router";
import { Heart, Sparkles } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-plum text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center shadow-gold">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <span className="font-display text-xl font-semibold text-white">
                Glamour <span className="text-gold">Parlour</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 font-body leading-relaxed">
              Where beauty meets luxury. Experience the finest treatments
              curated for your wellbeing.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-gold tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/"
                  className="hover:text-gold transition-colors"
                  data-ocid="footer.home.link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/book"
                  search={{}}
                  className="hover:text-gold transition-colors"
                  data-ocid="footer.book.link"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-gold transition-colors"
                  data-ocid="footer.admin.link"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-gold tracking-wider uppercase">
              Hours
            </h4>
            <ul className="space-y-1 font-body text-sm text-primary-foreground/70">
              <li>Monday – Friday: 9:00 AM – 7:00 PM</li>
              <li>Saturday: 9:00 AM – 6:00 PM</li>
              <li>Sunday: 10:00 AM – 4:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/50 font-body">
          <span>© {year} Glamour Parlour. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose fill-current" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
