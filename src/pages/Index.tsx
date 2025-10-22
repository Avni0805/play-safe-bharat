import Header from "@/components/Header";
import ProgressOverview from "@/components/ProgressOverview";
import CommunityFeed from "@/components/CommunityFeed";
import UpcomingEvents from "@/components/UpcomingEvents";
import PostStoryDialog from "@/components/PostStoryDialog";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Welcome to Play Safe India
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your journey towards clean sport excellence starts here. Track progress, connect with athletes, and stay informed.
            </p>
          </div>

          {/* Post Story Button */}
          <div className="flex justify-center">
            <PostStoryDialog />
          </div>

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
