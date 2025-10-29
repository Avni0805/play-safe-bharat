import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  BookOpen,
  PlayCircle,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Trophy
} from "lucide-react";

interface Module {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface Chapter {
  id: string;
  module_id: string;
  title_en: string;
  title_hi: string;
  content_en: string;
  content_hi: string;
  content_type: string;
  media_url: string | null;
  order_index: number;
  duration_minutes: number;
}

interface ChapterProgress {
  chapter_id: string;
  completed: boolean;
}

const ModuleContent = () => {
  const { moduleId } = useParams();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [module, setModule] = useState<Module | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !moduleId) return;

      try {
        // Fetch module details
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (moduleError) throw moduleError;

        // Fetch chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('module_chapters')
          .select('*')
          .eq('module_id', moduleId)
          .order('order_index');

        if (chaptersError) throw chaptersError;

        // Fetch user's chapter progress
        const { data: progressData } = await supabase
          .from('user_chapter_progress')
          .select('chapter_id, completed')
          .eq('user_id', user.id)
          .in('chapter_id', chaptersData?.map(c => c.id) || []);

        setModule(moduleData);
        setChapters(chaptersData || []);
        setChapterProgress(progressData || []);

        // Find first incomplete chapter or start from beginning
        const firstIncompleteIndex = chaptersData?.findIndex(
          chapter => !progressData?.some(p => p.chapter_id === chapter.id && p.completed)
        ) ?? 0;
        setCurrentChapterIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: t({ en: "Error", hi: "त्रुटि" }),
          description: t({ 
            en: "Failed to load module content", 
            hi: "मॉड्यूल सामग्री लोड करने में विफल" 
          }),
          variant: "destructive",
        });
        navigate('/modules');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, user, navigate, toast, t]);

  const markChapterComplete = async (chapterId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_chapter_progress')
        .upsert({
          user_id: user.id,
          chapter_id: chapterId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,chapter_id'
        });

      if (error) throw error;

      setChapterProgress(prev => {
        const existing = prev.find(p => p.chapter_id === chapterId);
        if (existing) {
          return prev.map(p => 
            p.chapter_id === chapterId ? { ...p, completed: true } : p
          );
        }
        return [...prev, { chapter_id: chapterId, completed: true }];
      });

      toast({
        title: t({ en: "Progress Saved", hi: "प्रगति सहेजी गई" }),
        description: t({ 
          en: "Chapter marked as complete", 
          hi: "अध्याय पूर्ण के रूप में चिह्नित" 
        }),
      });

    } catch (error) {
      console.error('Error marking chapter complete:', error);
      toast({
        title: t({ en: "Error", hi: "त्रुटि" }),
        description: t({ 
          en: "Failed to save progress", 
          hi: "प्रगति सहेजने में विफल" 
        }),
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedToQuiz = () => {
    navigate(`/quiz/${moduleId}`);
  };

  const isChapterCompleted = (chapterId: string) => {
    return chapterProgress.some(p => p.chapter_id === chapterId && p.completed);
  };

  const allChaptersCompleted = chapters.every(chapter => isChapterCompleted(chapter.id));
  const completedCount = chapters.filter(chapter => isChapterCompleted(chapter.id)).length;
  const progressPercentage = chapters.length > 0 ? (completedCount / chapters.length) * 100 : 0;

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-5 w-5" />;
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'link': return <LinkIcon className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-12 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-96 bg-muted animate-pulse rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!module || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">
              {t({ en: "No Content Available", hi: "कोई सामग्री उपलब्ध नहीं" })}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t({ 
                en: "This module doesn't have any chapters yet.", 
                hi: "इस मॉड्यूल में अभी तक कोई अध्याय नहीं है।" 
              })}
            </p>
            <Button onClick={() => navigate('/modules')}>
              {t({ en: "Back to Modules", hi: "मॉड्यूल पर वापस जाएं" })}
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const currentChapter = chapters[currentChapterIndex];
  const isCurrentCompleted = isChapterCompleted(currentChapter.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Module Header */}
          <div className="space-y-4 animate-fade-in">
            <Button
              variant="ghost"
              onClick={() => navigate('/modules')}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t({ en: "Back to Modules", hi: "मॉड्यूल पर वापस जाएं" })}
            </Button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {language === 'en' ? module.title_en : module.title_hi}
              </h1>
              <p className="text-muted-foreground mt-2">
                {language === 'en' ? module.description_en : module.description_hi}
              </p>
            </div>

            {/* Progress Bar */}
            <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t({ en: "Course Progress", hi: "पाठ्यक्रम प्रगति" })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {completedCount}/{chapters.length} {t({ en: "chapters completed", hi: "अध्याय पूर्ण" })}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </Card>
          </div>

          {/* Chapter Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-scale-in">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => {
                  setCurrentChapterIndex(index);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                  index === currentChapterIndex
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : isChapterCompleted(chapter.id)
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-xs font-medium">
                    {t({ en: "Chapter", hi: "अध्याय" })} {index + 1}
                  </span>
                  {isChapterCompleted(chapter.id) && (
                    <CheckCircle className="h-3 w-3" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Chapter Content */}
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card to-muted/20 animate-fade-in">
            <div className="space-y-6">
              {/* Chapter Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getContentTypeIcon(currentChapter.content_type)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {t({ en: "Chapter", hi: "अध्याय" })} {currentChapterIndex + 1} {t({ en: "of", hi: "का" })} {chapters.length}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {language === 'en' ? currentChapter.title_en : currentChapter.title_hi}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    ⏱ {currentChapter.duration_minutes} {t({ en: "minutes", hi: "मिनट" })}
                  </p>
                </div>

                {isCurrentCompleted && (
                  <div className="flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {t({ en: "Completed", hi: "पूर्ण" })}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {currentChapter.media_url && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    {currentChapter.content_type === 'video' && (
                      <video controls className="w-full">
                        <source src={currentChapter.media_url} />
                      </video>
                    )}
                    {currentChapter.content_type === 'image' && (
                      <img 
                        src={currentChapter.media_url} 
                        alt={language === 'en' ? currentChapter.title_en : currentChapter.title_hi}
                        className="w-full"
                      />
                    )}
                    {currentChapter.content_type === 'link' && (
                      <a 
                        href={currentChapter.media_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {t({ en: "Open Resource", hi: "संसाधन खोलें" })}
                      </a>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed">
                  {language === 'en' ? currentChapter.content_en : currentChapter.content_hi}
                </div>
              </div>

              {/* Mark Complete Button */}
              {!isCurrentCompleted && (
                <Button
                  onClick={() => markChapterComplete(currentChapter.id)}
                  className="w-full md:w-auto gap-2"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5" />
                  {t({ en: "Mark as Complete", hi: "पूर्ण के रूप में चिह्नित करें" })}
                </Button>
              )}
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 animate-fade-in">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentChapterIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t({ en: "Previous", hi: "पिछला" })}
            </Button>

            {currentChapterIndex < chapters.length - 1 ? (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                {t({ en: "Next Chapter", hi: "अगला अध्याय" })}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : allChaptersCompleted ? (
              <Button
                onClick={handleProceedToQuiz}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                size="lg"
              >
                <Trophy className="h-5 w-5" />
                {t({ en: "Proceed to Quiz", hi: "प्रश्नोत्तरी के लिए आगे बढ़ें" })}
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">
                {t({ 
                  en: "Complete all chapters to unlock the quiz", 
                  hi: "प्रश्नोत्तरी अनलॉक करने के लिए सभी अध्याय पूरे करें" 
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleContent;
