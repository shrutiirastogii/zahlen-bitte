import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import { Link } from "react-router";

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

export default function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-page text-ink">
      <div className="flex h-20 w-full items-center justify-between px-3 md:px-5">
        {" "}
        <Link
          to="/"
          aria-label="Zahlen, bitte! Home"
          className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <img
            src={isDark ? logoDark : logoLight}
            alt="Zahlen, bitte!"
            className="block h-10 w-auto md:h-12"
          />
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-5 md:gap-8"
        >
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Dark mode"
            aria-pressed={isDark}
            className="flex h-9 w-16 cursor-pointer items-center rounded-full border border-ink/30 p-1 transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span
              aria-hidden="true"
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-page transition-transform motion-reduce:transition-none ${
                isDark ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {isDark ? "☾" : "☀"}
            </span>
          </button>

          <a
            href="#about"
            className="rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
