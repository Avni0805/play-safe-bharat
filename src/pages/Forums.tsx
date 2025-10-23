import { useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageSquare, Search, Plus, TrendingUp, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dummy forum data
const forumCategories = [
  {
    id: 1,
    name_en: "General Discussion",
    name_hi: "सामान्य चर्चा",
    description_en: "General topics about clean sport and anti-doping",
    description_hi: "स्वच्छ खेल और डोपिंग रोधी के बारे में सामान्य विषय",
    topics: 45,
    posts: 234
  },
  {
    id: 2,
    name_en: "Nutrition & Supplements",
    name_hi: "पोषण और पूरक",
    description_en: "Discuss safe nutrition and supplement practices",
    description_hi: "सुरक्षित पोषण और पूरक प्रथाओं पर चर्चा करें",
    topics: 32,
    posts: 156
  },
  {
    id: 3,
    name_en: "Testing & Procedures",
    name_hi: "परीक्षण और प्रक्रियाएं",
    description_en: "Questions about doping tests and procedures",
    description_hi: "डोपिंग परीक्षण और प्रक्रियाओं के बारे में प्रश्न",
    topics: 28,
    posts: 98
  },
  {
    id: 4,
    name_en: "Athletes' Stories",
    name_hi: "एथलीटों की कहानियां",
    description_en: "Share experiences and inspire others",
    description_hi: "अनुभव साझा करें और दूसरों को प्रेरित करें",
    topics: 67,
    posts: 289
  }
];

const recentTopics = [
  {
    id: 1,
    title_en: "How to verify supplement safety?",
    title_hi: "पूरक सुरक्षा को कैसे सत्यापित करें?",
    author: "Priya Sharma",
    category: "Nutrition & Supplements",
    replies: 12,
    views: 156,
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    title_en: "First time doping test - what to expect?",
    title_hi: "पहली बार डोपिंग परीक्षण - क्या उम्मीद करें?",
    author: "Rahul Kumar",
    category: "Testing & Procedures",
    replies: 8,
    views: 89,
    lastActive: "5 hours ago"
  },
  {
    id: 3,
    title_en: "My journey to clean sport certification",
    title_hi: "स्वच्छ खेल प्रमाणन की मेरी यात्रा",
    author: "Anjali Singh",
    category: "Athletes' Stories",
    replies: 23,
    views: 234,
    lastActive: "1 day ago"
  }
];

const Forums = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {t({ en: "Community Forums", hi: "समुदाय मंच" })}
              </h1>
              <p className="text-muted-foreground">
                {t({ 
                  en: "Connect with athletes, share experiences, and learn together", 
                  hi: "एथलीटों से जुड़ें, अनुभव साझा करें, और एक साथ सीखें" 
                })}
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t({ en: "New Topic", hi: "नया विषय" })}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t({ en: "Create New Topic", hi: "नया विषय बनाएं" })}</DialogTitle>
                  <DialogDescription>
                    {t({ 
                      en: "Start a new discussion in the community", 
                      hi: "समुदाय में नई चर्चा शुरू करें" 
                    })}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t({ en: "Topic Title", hi: "विषय शीर्षक" })}
                    </label>
                    <Input placeholder={t({ 
                      en: "Enter topic title...", 
                      hi: "विषय शीर्षक दर्ज करें..." 
                    })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t({ en: "Category", hi: "श्रेणी" })}
                    </label>
                    <select className="w-full p-2 rounded-md border bg-background">
                      {forumCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {language === 'en' ? cat.name_en : cat.name_hi}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t({ en: "Description", hi: "विवरण" })}
                    </label>
                    <Textarea 
                      placeholder={t({ 
                        en: "Describe your topic...", 
                        hi: "अपने विषय का वर्णन करें..." 
                      })} 
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">
                    {t({ en: "Create Topic", hi: "विषय बनाएं" })}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t({ 
                  en: "Search forums...", 
                  hi: "मंचों में खोजें..." 
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Forum Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">172</p>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "Total Topics", hi: "कुल विषय" })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">777</p>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "Total Posts", hi: "कुल पोस्ट" })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "Active Members", hi: "सक्रिय सदस्य" })}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Forum Categories */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {t({ en: "Categories", hi: "श्रेणियां" })}
            </h2>
            <div className="space-y-3">
              {forumCategories.map((category) => (
                <Card key={category.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">
                        {language === 'en' ? category.name_en : category.name_hi}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {language === 'en' ? category.description_en : category.description_hi}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-bold text-primary">{category.topics}</p>
                      <p className="text-xs text-muted-foreground">
                        {t({ en: "topics", hi: "विषय" })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {category.posts} {t({ en: "posts", hi: "पोस्ट" })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Topics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {t({ en: "Recent Discussions", hi: "हाल की चर्चाएं" })}
            </h2>
            <div className="space-y-3">
              {recentTopics.map((topic) => (
                <Card key={topic.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold">
                        {language === 'en' ? topic.title_en : topic.title_hi}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{topic.author}</span>
                        <span>•</span>
                        <span>{topic.category}</span>
                        <span>•</span>
                        <span>{topic.lastActive}</span>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="text-center">
                        <p className="font-bold text-foreground">{topic.replies}</p>
                        <p>{t({ en: "replies", hi: "उत्तर" })}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-foreground">{topic.views}</p>
                        <p>{t({ en: "views", hi: "दृश्य" })}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Forums;
