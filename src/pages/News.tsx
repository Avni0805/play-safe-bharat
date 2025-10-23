import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Search, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

interface NewsArticle {
  id: string;
  title_en: string;
  title_hi: string;
  excerpt_en: string;
  excerpt_hi: string;
  content_en: string;
  content_hi: string;
  category: string;
  published_at: string;
}

const News = () => {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(articles.map(a => a.category))];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      (language === 'en' ? article.title_en : article.title_hi)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-12 w-48 bg-muted animate-pulse rounded" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted animate-pulse rounded" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent flex items-center gap-3">
              <Newspaper className="h-10 w-10 text-primary" />
              {t({ en: "Latest News", hi: "ताज़ा खबर" })}
            </h1>
            <p className="text-muted-foreground">
              {t({ 
                en: "Stay updated with the latest anti-doping news and updates", 
                hi: "नवीनतम डोपिंग रोधी समाचार और अपडेट के साथ अपडेट रहें" 
              })}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t({ 
                    en: "Search news...", 
                    hi: "समाचार खोजें..." 
                  })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                {t({ en: "All", hi: "सभी" })}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          {filteredArticles.length === 0 ? (
            <Card className="p-12 text-center">
              <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t({ en: "No news articles found", hi: "कोई समाचार लेख नहीं मिला" })}
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Newspaper className="h-16 w-16 text-primary/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      <span>{article.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {language === 'en' ? article.title_en : article.title_hi}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {language === 'en' ? article.excerpt_en : article.excerpt_hi}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(new Date(article.published_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        {t({ en: "Read More", hi: "और पढ़ें" })}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default News;
