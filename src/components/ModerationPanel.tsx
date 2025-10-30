import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Shield, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const ModerationPanel = () => {
  const { t } = useLanguage();
  const [pendingStories, setPendingStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStories();
  }, []);

  const fetchPendingStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingStories(data || []);
    } catch (error) {
      console.error('Error fetching pending stories:', error);
      toast.error(t({ en: "Failed to load pending stories", hi: "लंबित कहानियां लोड करने में विफल" }));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({ is_approved: true })
        .eq('id', storyId);

      if (error) throw error;

      toast.success(t({ en: "Story approved", hi: "कहानी स्वीकृत" }));
      setPendingStories(prev => prev.filter(s => s.id !== storyId));
    } catch (error) {
      console.error('Error approving story:', error);
      toast.error(t({ en: "Failed to approve story", hi: "कहानी स्वीकृत करने में विफल" }));
    }
  };

  const handleReject = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      toast.success(t({ en: "Story rejected", hi: "कहानी अस्वीकृत" }));
      setPendingStories(prev => prev.filter(s => s.id !== storyId));
    } catch (error) {
      console.error('Error rejecting story:', error);
      toast.error(t({ en: "Failed to reject story", hi: "कहानी अस्वीकृत करने में विफल" }));
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  if (pendingStories.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-lg font-bold">
            {t({ en: "Pending Stories for Review", hi: "समीक्षा के लिए लंबित कहानियां" })}
          </h3>
          <span className="ml-auto px-2 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
            {pendingStories.length}
          </span>
        </div>

        <div className="space-y-3">
          {pendingStories.map((story) => {
            const profile = story.profiles || {};
            const initials = profile.full_name
              ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
              : '??';

            return (
              <Card key={story.id} className="p-4 bg-card">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-secondary">
                      <AvatarFallback className="text-white text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{profile.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/90 line-clamp-3">{story.content}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(story.id)}
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t({ en: "Approve", hi: "स्वीकृत करें" })}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(story.id)}
                      className="flex-1 gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      {t({ en: "Reject", hi: "अस्वीकृत करें" })}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ModerationPanel;
