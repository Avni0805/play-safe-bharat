import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PenSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { storySchema } from "@/lib/validation";

const PostStoryDialog = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    // Validate with zod
    const validation = storySchema.safeParse({ content });
    
    if (!validation.success) {
      const errorMsg = validation.error.errors[0].message;
      toast.error(t({ en: errorMsg, hi: errorMsg }));
      return;
    }

    if (!user) {
      toast.error(t({ en: "You must be logged in", hi: "आपको लॉगिन करना होगा" }));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          content: content.trim(),
          language,
          is_approved: false
        });

      if (error) throw error;

      toast.success(t({ 
        en: "Your story has been submitted for moderation", 
        hi: "आपकी कहानी मॉडरेशन के लिए सबमिट की गई है" 
      }));
      setContent("");
      setOpen(false);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error posting story:', error);
      }
      toast.error(t({ en: "Failed to post story. Please try again.", hi: "कहानी पोस्ट करने में विफल। कृपया पुनः प्रयास करें।" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md">
          <PenSquare className="h-4 w-4" />
          {t({ en: "Share Your Story", hi: "अपनी कहानी साझा करें" })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t({ en: "Share Your Story", hi: "अपनी कहानी साझा करें" })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Textarea
            placeholder={t({ 
              en: "Share your clean sport journey, experiences, or achievements...", 
              hi: "अपनी स्वच्छ खेल यात्रा, अनुभव, या उपलब्धियां साझा करें..." 
            })}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {content.length}/5000 {t({ en: "characters", hi: "वर्ण" })}
            </span>
            {content.length > 5000 && (
              <span className="text-destructive font-medium">
                {t({ en: "Too long!", hi: "बहुत लंबा!" })}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {t({ 
              en: "Note: Your story will be reviewed by moderators before being published.", 
              hi: "नोट: प्रकाशित होने से पहले आपकी कहानी की समीक्षा की जाएगी।" 
            })}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t({ en: "Cancel", hi: "रद्द करें" })}
            </Button>
            <Button onClick={handlePost} className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90" disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? t({ en: "Posting...", hi: "पोस्ट हो रहा है..." }) : t({ en: "Post", hi: "पोस्ट करें" })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostStoryDialog;
