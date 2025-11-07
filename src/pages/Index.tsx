import Header from "@/components/Header";
import ProgressOverview from "@/components/ProgressOverview";
import CommunityFeed from "@/components/CommunityFeed";
import UpcomingEvents from "@/components/UpcomingEvents";
import PostStoryDialog from "@/components/PostStoryDialog";
import ModerationPanel from "@/components/ModerationPanel";
import { useUserRole } from "@/hooks/useUserRole";

const Index = () => {
  const { isModerator } = useUserRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <div className="inline-block">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Play Safe India
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full mt-2 animate-in fade-in duration-1000 delay-300" />
            </div>
            
            <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              India's Premier Anti-Doping Education Platform
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              Empowering athletes, coaches, and sports professionals with comprehensive knowledge about clean sport practices, prohibited substances, and therapeutic use exemptions. Join our community committed to integrity in sports.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <div className="text-center px-6 py-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Active Athletes</div>
              </div>
              <div className="text-center px-6 py-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="text-3xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Educational Modules</div>
              </div>
              <div className="text-center px-6 py-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>

          {/* Post Story Button */}
          <div className="flex justify-center">
            <PostStoryDialog />
          </div>

          {/* Moderation Panel (Moderators/Admins Only) */}
          {isModerator && <ModerationPanel />}

          {/* Progress Overview */}
          <ProgressOverview />

          {/* Two Column Layout */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CommunityFeed />
            </div>
            <div>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
