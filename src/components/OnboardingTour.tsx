import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TourStep {
  target: string;
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  steps: TourStep[];
  storageKey: string;
  onComplete?: () => void;
}

const OnboardingTour = ({ steps, storageKey, onComplete }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const positionTooltip = useCallback(() => {
    if (!visible || currentStep >= steps.length) return;

    const step = steps[currentStep];
    const el = document.querySelector(step.target);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 480;
    const tooltipWidth = isMobile ? Math.min(vw - 32, 300) : 280;
    const tooltipHeight = 140;
    const padding = isMobile ? 8 : 12;

    if (!el) {
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${tooltipWidth}px`,
        maxWidth: "calc(100vw - 32px)",
        zIndex: 10001,
      });
      setArrowStyle({ display: "none" });
      return;
    }

    const rect = el.getBoundingClientRect();
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // On mobile, always place tooltip below or above the element
    let placement = step.placement || "bottom";
    if (isMobile && (placement === "left" || placement === "right")) {
      placement = rect.top > vh / 2 ? "top" : "bottom";
    }

    let top = 0;
    let left = 0;
    let arrowTop = 0;
    let arrowLeft = 0;

    switch (placement) {
      case "bottom":
        top = rect.bottom + padding;
        left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, vw - tooltipWidth - 16));
        arrowTop = rect.bottom + 2;
        arrowLeft = Math.min(Math.max(rect.left + rect.width / 2 - 8, 24), vw - 24);
        break;
      case "top":
        top = rect.top - tooltipHeight - padding;
        left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, vw - tooltipWidth - 16));
        arrowTop = rect.top - padding + 2;
        arrowLeft = Math.min(Math.max(rect.left + rect.width / 2 - 8, 24), vw - 24);
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + padding;
        arrowTop = rect.top + rect.height / 2 - 8;
        arrowLeft = rect.right + 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - padding;
        arrowTop = rect.top + rect.height / 2 - 8;
        arrowLeft = rect.left - padding + 2;
        break;
    }

    // Clamp top so tooltip never goes off-screen
    top = Math.max(16, Math.min(top, vh - tooltipHeight - 16));

    setTooltipStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      maxWidth: "calc(100vw - 32px)",
      zIndex: 10001,
    });

    setArrowStyle({
      position: "fixed",
      top: `${arrowTop}px`,
      left: `${arrowLeft}px`,
      zIndex: 10001,
    });
  }, [visible, currentStep, steps]);

  useEffect(() => {
    positionTooltip();
    window.addEventListener("resize", positionTooltip);
    return () => window.removeEventListener("resize", positionTooltip);
  }, [positionTooltip]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(storageKey, "true");
    onComplete?.();
  };

  if (!visible || currentStep >= steps.length) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const targetEl = document.querySelector(step.target);
  const targetRect = targetEl?.getBoundingClientRect();

  return createPortal(
    <>
      {/* Overlay with cutout */}
      <div
        className="fixed inset-0 z-[10000] transition-all duration-300"
        onClick={handleClose}
        style={{
          background: "rgba(0,0,0,0.7)",
          ...(targetRect && {
            clipPath: `polygon(
              0% 0%, 0% 100%, 
              ${targetRect.left - 4}px 100%, 
              ${targetRect.left - 4}px ${targetRect.top - 4}px, 
              ${targetRect.right + 4}px ${targetRect.top - 4}px, 
              ${targetRect.right + 4}px ${targetRect.bottom + 4}px, 
              ${targetRect.left - 4}px ${targetRect.bottom + 4}px, 
              ${targetRect.left - 4}px 100%, 
              100% 100%, 100% 0%
            )`,
          }),
        }}
      />

      {/* Highlight ring */}
      {targetRect && (
        <div
          className="fixed z-[10000] rounded-xl border-2 border-primary animate-pulse pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: "0 0 16px hsl(var(--primary) / 0.4)",
          }}
        />
      )}

      {/* Arrow */}
      <div style={arrowStyle} className="text-primary">
        {(step.placement === "bottom" || !step.placement) && (
          <ArrowDown className="w-4 h-4 animate-bounce" />
        )}
        {step.placement === "top" && (
          <ArrowDown className="w-4 h-4 animate-bounce rotate-180" />
        )}
        {step.placement === "right" && (
          <ArrowRight className="w-4 h-4 animate-bounce" />
        )}
        {step.placement === "left" && (
          <ArrowRight className="w-4 h-4 animate-bounce rotate-180" />
        )}
      </div>

      {/* Tooltip */}
      <div
        style={tooltipStyle}
        className="bg-card border border-border/40 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/40 animate-scale-in"
      >
        <div className="flex items-start justify-between mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <h3 className="font-heading text-xs sm:text-sm font-bold text-foreground truncate">{step.title}</h3>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors p-0.5 shrink-0 ml-1">
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{step.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  i === currentStep ? "bg-primary" : i < currentStep ? "bg-primary/40" : "bg-muted"
                )}
              />
            ))}
          </div>
          <Button size="sm" onClick={handleNext} className="h-7 sm:h-8 text-[11px] sm:text-xs font-semibold bg-primary hover:bg-primary/90 px-3">
            {isLast ? "Começar!" : "Próximo"}
            {!isLast && <ArrowRight className="w-3 h-3 ml-1" />}
          </Button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default OnboardingTour;
