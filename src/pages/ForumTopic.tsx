import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reply {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

const ForumTopic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [newReply, setNewReply] = useState("");
  
  // Mock data - replace with actual data fetching
  const topic = {
    id: Number(id),
    title_en: "How to verify supplement safety?",
    title_hi: "पूरक सुरक्षा को कैसे सत्यापित करें?",
    author: "Priya Sharma",
    category: "Nutrition & Supplements",
    content_en: "I'm preparing for upcoming competitions and want to ensure the supplements I'm using are safe and compliant. What are the best practices for verifying supplement safety? Are there any trusted databases or certification programs I should look for?",
    content_hi: "मैं आगामी प्रतियोगिताओं की तैयारी कर रहा हूं और यह सुनिश्चित करना चाहता हूं कि मैं जो सप्लीमेंट उपयोग कर रहा हूं वे सुरक्षित और अनुपालन हैं। सप्लीमेंट सुरक्षा सत्यापित करने के लिए सर्वोत्तम प्रथाएं क्या हैं?",
    createdAt: "2024-10-28T10:30:00Z",
    views: 156,
  };

  const [replies, setReplies] = useState<Reply[]>([
    {
      id: 1,
      author: "Rahul Kumar",
      content: "Always check for NSF Certified for Sport or Informed-Choice certifications. These are the gold standard for supplement safety.",
      timestamp: "2 hours ago",
      likes: 8,
    },
    {
      id: 2,
      author: "Anjali Singh",
      content: "I recommend using the Global DRO (Drug Reference Online) to check any supplement ingredients. It's free and very reliable.",
      timestamp: "3 hours ago",
      likes: 5,
    },
    {
      id: 3,
      author: "Vikram Patel",
      content: "Also, always consult with your sports physician or nutritionist before starting any new supplement regimen.",
      timestamp: "5 hours ago",
      likes: 12,
    },
  ]);

  const handleSubmitReply = () => {
    if (!newReply.trim()) {
      toast({
        title: t({ en: "Error", hi: "त्रुटि" }),
        description: t({ 
          en: "Please enter a reply", 
          hi: "कृपया एक उत्तर दर्ज करें" 
        }),
        variant: "destructive",
      });
      return;
    }

    const reply: Reply = {
      id: replies.length + 1,
      author: "You",
      content: newReply,
      timestamp: "Just now",
      likes: 0,
    };

    setReplies([...replies, reply]);
    setNewReply("");
    
    toast({
      title: t({ en: "Reply posted!", hi: "उत्तर पोस्ट किया गया!" }),
      description: t({ 
        en: "Your reply has been added to the discussion", 
        hi: "आपका उत्तर चर्चा में जोड़ दिया गया है" 
      }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/forums")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t({ en: "Back to Forums", hi: "मंचों पर वापस जाएं" })}
          </Button>

          {/* Topic Header */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-2">
                    {topic.category}
                  </div>
                  <h1 className="text-3xl font-bold mb-4">
                    {language === 'en' ? topic.title_en : topic.title_hi}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{topic.author[0]}</AvatarFallback>
                      </Avatar>
                      <span>{topic.author}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{topic.views} {t({ en: "views", hi: "दृश्य" })}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-base leading-relaxed">
                  {language === 'en' ? topic.content_en : topic.content_hi}
                </p>
              </div>
            </div>
          </Card>

          {/* Replies */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {replies.length} {t({ en: "Replies", hi: "उत्तर" })}
            </h2>

            {replies.map((reply) => (
              <Card key={reply.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{reply.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{reply.author}</p>
                        <p className="text-sm text-muted-foreground">{reply.timestamp}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      {reply.likes}
                    </Button>
                  </div>
                  <p className="text-base leading-relaxed pl-12">
                    {reply.content}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">
                {t({ en: "Post Your Reply", hi: "अपना उत्तर पोस्ट करें" })}
              </h3>
              <Textarea
                placeholder={t({ 
                  en: "Share your thoughts...", 
                  hi: "अपने विचार साझा करें..." 
                })}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitReply} className="gap-2">
                  <Send className="h-4 w-4" />
                  {t({ en: "Post Reply", hi: "उत्तर पोस्ट करें" })}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ForumTopic;
