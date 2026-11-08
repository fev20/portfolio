import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4 rounded-[var(--radius)] border-border bg-card shadow-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--rose-soft)] rounded-full" />
              <AlertCircle className="relative h-16 w-16 text-[var(--rose)]" />
            </div>
          </div>

          <h1 className="text-6xl font-extrabold text-foreground mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "normal" }}>404</h1>

          <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, letterSpacing: "normal" }}>
            Page Not Found
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            Sorry, the page you are looking for doesn't exist.
            <br />
            It may have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-primary hover:bg-[var(--sage-deep)] text-primary-foreground px-6 py-2.5 rounded-[var(--radius-sm)] transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
