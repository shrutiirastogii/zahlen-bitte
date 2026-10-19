import { useEffect, useState } from "react";
import Header from "./components/Header";

function getInitialTheme(): boolean {
  try {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
  } catch {
    // Fall back to the system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function App() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // The toggle still works when storage is unavailable.
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-page text-ink">
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark((previous) => !previous)}
      />

<main className="px-6 pt-20 pb-12 md:pt-28">
  <h1 className="mx-auto max-w-4xl text-center text-4xl leading-tight font-semibold md:text-6xl">
    Germany, one curious chart at a time.
  </h1>
</main>
    </div>
  );
}