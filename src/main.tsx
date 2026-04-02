import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme preference safely
try {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.documentElement.classList.add("light");
  }
} catch {
  // localStorage blocked or unavailable
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
