import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { PenSquare, Send } from "lucide-react";
import { toast } from "sonner";

const PostStoryDialog = () => {
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const handlePost = () => {
    if (!content.trim()) {
      toast.error(t({ en: "Please write something to post", hi: "पोस्ट करने के लिए कुछ लिखें" }));
      return;
    }
    toast.success(t({ 
      en: "Your story has been submitted for moderation", 
      hi: "आपकी कहानी मॉडरेशन के लिए सबमिट की गई है" 
    }));
    setContent("");
    setOpen(false);
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
            <Button onClick={handlePost} className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Send className="h-4 w-4" />
              {t({ en: "Post", hi: "पोस्ट करें" })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostStoryDialog;
