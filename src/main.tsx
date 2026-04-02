import { createRoot } from "react-dom/client";
import "./index.css";

const applySavedTheme = () => {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
    }
  } catch {
    // localStorage blocked or unavailable
  }
};

const BootstrapFallback = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div className="max-w-sm w-full text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto text-2xl">⚠️</div>
      <div className="space-y-2">
        <h1 className="text-xl font-heading font-bold">Não foi possível iniciar o app</h1>
        <p className="text-sm text-muted-foreground">
          Tente recarregar. Se a área interna falhar, a página inicial continuará disponível.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Recarregar
        </button>
        <button
          onClick={() => window.location.assign("/")}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-surface-2 px-4 text-sm font-semibold text-foreground"
        >
          Ir para início
        </button>
      </div>
    </div>
  </div>
);

const root = document.getElementById("root");
if (root) {
  const reactRoot = createRoot(root);

  const bootstrap = async () => {
    applySavedTheme();

    try {
      const { default: App } = await import("./App.tsx");
      reactRoot.render(<App />);
    } catch (error) {
      console.error("[bootstrap] Failed to start app", error);
      reactRoot.render(<BootstrapFallback />);
    }
  };

  void bootstrap();
}
