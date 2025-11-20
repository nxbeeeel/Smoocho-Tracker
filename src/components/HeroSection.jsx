/**
 * Hero Section Component - Mobile and Tablet Optimized with Glass Effect
 */
import { Card, CardContent } from '@/components/ui/card';

const HeroSection = () => {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 backdrop-blur-sm">
      <CardContent className="py-4 sm:py-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            🍓 Smoocho Tracker
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Fast daily sales + expenses capture
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSection;
