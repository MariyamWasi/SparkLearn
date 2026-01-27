import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Zap, Target } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Learning</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            Learn anything,<br />one concept at a time
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Tell us what you want to learn, and we'll create a personalized 
            curriculum just for you. AI-generated lessons that adapt to your pace.
          </p>

          {/* CTA */}
          <div className="pt-4">
            <Button size="lg" asChild>
              <Link to="/auth?mode=signup">
                Start Learning Free
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
              <BookOpen className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="font-medium text-foreground">Personalized Curriculum</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI designs a custom learning path based on your topic of interest.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="font-medium text-foreground">Progressive Content</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lessons are generated as you learn, keeping content fresh and relevant.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
              <Target className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="font-medium text-foreground">Focused Learning</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              One concept at a time. No distractions, just clear explanations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
