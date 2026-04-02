import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme preference
const saved = localStorage.getItem("theme");
if (saved === "light") {
  document.documentElement.classList.add("light");
}

createRoot(document.getElementById("root")!).render(<App />);
