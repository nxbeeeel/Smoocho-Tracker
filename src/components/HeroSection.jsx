/**
 * Hero Section Component - Mobile and Tablet Optimized with Glass Effect
 */
import { Card, CardContent } from '@/components/ui/card';

const HeroSection = () => {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 backdrop-blur-[var(--blur)]">
      <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              🍓 Smoocho Tracker
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Track your daily sales and expenses with ease
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSection;
