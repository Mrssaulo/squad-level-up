import { Trophy, Instagram, Youtube, Twitter } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-10 bg-background border-t border-border/30">
      <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-heading font-bold text-sm">
            <span className="text-gradient">Pro Futebol</span>{" "}
            <span className="text-foreground/70">SM</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </a>
        </div>
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Saulo Moreira. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
