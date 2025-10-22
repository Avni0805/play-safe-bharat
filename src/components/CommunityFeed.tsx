import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Share2, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CommunityFeed = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, [user, language]);

  const fetchStories = async () => {
    if (!user) return;

    try {
      // Fetch approved stories with profiles
      const { data: storiesData } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch like counts for each story
      const { data: likesData } = await supabase
        .from('story_likes')
        .select('story_id, user_id');

      // Check which stories current user has liked
      const userLikes: Record<string, boolean> = {};
      const counts: Record<string, number> = {};

      storiesData?.forEach(story => {
        const storyLikes = likesData?.filter(l => l.story_id === story.id) || [];
        counts[story.id] = storyLikes.length;
        userLikes[story.id] = storyLikes.some(l => l.user_id === user.id);
      });

      setStories(storiesData || []);
      setLikes(userLikes);
      setLikeCounts(counts);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (storyId: string) => {
    if (!user) return;

    const isLiked = likes[storyId];

    try {
      if (isLiked) {
        await supabase
          .from('story_likes')
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', user.id);

        setLikeCounts(prev => ({ ...prev, [storyId]: (prev[storyId] || 1) - 1 }));
      } else {
        await supabase
          .from('story_likes')
          .insert({ story_id: storyId, user_id: user.id });

        setLikeCounts(prev => ({ ...prev, [storyId]: (prev[storyId] || 0) + 1 }));
      }

      setLikes(prev => ({ ...prev, [storyId]: !isLiked }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return <div className="space-y-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded" />)}
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-secondary" />
          {t({ en: "Community Feed", hi: "समुदाय फ़ीड" })}
        </h2>
      </div>

      <div className="space-y-4">
        {stories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {t({ en: "No stories yet. Be the first to share!", hi: "अभी तक कोई कहानी नहीं। साझा करने वाले पहले बनें!" })}
            </p>
          </Card>
        ) : (
          stories.map((story) => {
            const profile = story.profiles || {};
            const initials = profile.full_name
              ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
              : '??';

            return (
              <Card key={story.id} className="p-6 bg-card border-border/50 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-secondary">
                      <AvatarFallback className="text-white font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{profile.full_name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground leading-relaxed">{story.content}</p>

                  <div className="flex items-center gap-6 pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 ${likes[story.id] ? 'text-red-500' : ''}`}
                      onClick={() => toggleLike(story.id)}
                    >
                      <Heart className={`h-4 w-4 ${likes[story.id] ? 'fill-current' : ''}`} />
                      <span>{likeCounts[story.id] || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
