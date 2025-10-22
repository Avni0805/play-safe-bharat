import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { stories } from "@/data/dummyData";
import { Heart, MessageCircle, Share2, Users } from "lucide-react";

const CommunityFeed = () => {
  const { t } = useLanguage();
  const [storyLikes, setStoryLikes] = useState(
    stories.reduce((acc, story) => ({ ...acc, [story.id]: story.liked }), {})
  );

  const toggleLike = (storyId: number) => {
    setStoryLikes(prev => ({ ...prev, [storyId]: !prev[storyId] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-secondary" />
          {t({ en: "Community Feed", hi: "समुदाय फ़ीड" })}
        </h2>
      </div>

      <div className="space-y-4">
        {stories.map((story) => (
          <Card key={story.id} className="p-6 bg-card border-border/50 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-secondary">
                  <AvatarFallback className="text-white font-semibold">
                    {story.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{story.author.name}</p>
                  <p className="text-sm text-muted-foreground">{story.timestamp}</p>
                </div>
              </div>

              <p className="text-foreground leading-relaxed">{t(story.content)}</p>

              <div className="flex items-center gap-6 pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${storyLikes[story.id] ? 'text-red-500' : ''}`}
                  onClick={() => toggleLike(story.id)}
                >
                  <Heart className={`h-4 w-4 ${storyLikes[story.id] ? 'fill-current' : ''}`} />
                  <span>{story.likes + (storyLikes[story.id] && !story.liked ? 1 : story.liked && !storyLikes[story.id] ? -1 : 0)}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{story.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>{story.shares}</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
