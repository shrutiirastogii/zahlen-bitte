import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Embassies from "./pages/Embassies";
import Ages from "./pages/Ages";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Deaths from "./pages/Deaths";

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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/embassies" element={<Embassies />} />
        <Route path="/ages" element={<Ages />} />
        <Route path="/deaths" element={<Deaths />} />
        <Route
          path="*"
          element={
            <main className="px-6 py-16 text-center">Page not found.</main>
          }
        />
      </Routes>
    </div>
  );
}
