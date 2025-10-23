import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Trophy, Award, CheckCircle, PlayCircle } from "lucide-react";

interface Module {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  order_index: number;
}

interface UserProgress {
  module_id: string;
  progress: number;
  completed: boolean;
}

const Modules = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch modules
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .order('order_index');

        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_module_progress')
          .select('*')
          .eq('user_id', user.id);

        // Fetch badges
        const { data: badgesData } = await supabase
          .from('badges')
          .select('*');

        // Fetch user badges
        const { data: userBadgesData } = await supabase
          .from('user_badges')
          .select('badge_id')
          .eq('user_id', user.id);

        setModules(modulesData || []);
        setProgress(progressData || []);
        setBadges(badgesData || []);
        setUserBadges(userBadgesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getModuleProgress = (moduleId: string) => {
    const moduleProgress = progress.find(p => p.module_id === moduleId);
    return moduleProgress || { progress: 0, completed: false };
  };

  const handleStartModule = (moduleId: string) => {
    navigate(`/quiz/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-12 w-64 bg-muted animate-pulse rounded" />
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded" />)}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const completedModules = progress.filter(p => p.completed).length;
  const totalModules = modules.length;
  const earnedBadgesCount = userBadges.length;
  const overallProgress = progress.length > 0 
    ? Math.round(progress.reduce((acc, p) => acc + (p.progress || 0), 0) / modules.length) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {t({ en: "Learning Modules", hi: "शिक्षण मॉड्यूल" })}
            </h1>
            <p className="text-muted-foreground">
              {t({ 
                en: "Master anti-doping knowledge through interactive modules and quizzes", 
                hi: "इंटरैक्टिव मॉड्यूल और प्रश्नोत्तरी के माध्यम से डोपिंग रोधी ज्ञान में महारत हासिल करें" 
              })}
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-background/80 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "Modules Completed", hi: "पूर्ण मॉड्यूल" })}
                  </p>
                  <p className="text-2xl font-bold">{completedModules}/{totalModules}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-background/80 text-secondary">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "Badges Earned", hi: "अर्जित बैज" })}
                  </p>
                  <p className="text-2xl font-bold">{earnedBadgesCount}/{badges.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-background/80 text-accent">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "Overall Progress", hi: "कुल प्रगति" })}
                  </p>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {t({ en: "Available Modules", hi: "उपलब्ध मॉड्यूल" })}
            </h2>
            
            <div className="space-y-4">
              {modules.map((module, index) => {
                const moduleProgress = getModuleProgress(module.id);
                const isLocked = index > 0 && !progress.find(p => p.module_id === modules[index - 1].id)?.completed;

                return (
                  <Card 
                    key={module.id} 
                    className={`p-6 transition-all ${
                      isLocked 
                        ? 'opacity-60 bg-muted/20' 
                        : 'hover:shadow-lg bg-gradient-to-br from-card to-muted/20'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                              {index + 1}
                            </span>
                            <h3 className="text-xl font-bold">
                              {language === 'en' ? module.title_en : module.title_hi}
                            </h3>
                            {moduleProgress.completed && (
                              <CheckCircle className="h-5 w-5 text-success" />
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {language === 'en' ? module.description_en : module.description_hi}
                          </p>
                        </div>

                        <Button
                          onClick={() => handleStartModule(module.id)}
                          disabled={isLocked}
                          className="gap-2"
                        >
                          {moduleProgress.completed ? (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              {t({ en: "Retake", hi: "दोबारा लें" })}
                            </>
                          ) : moduleProgress.progress > 0 ? (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              {t({ en: "Continue", hi: "जारी रखें" })}
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              {t({ en: "Start", hi: "शुरू करें" })}
                            </>
                          )}
                        </Button>
                      </div>

                      {!isLocked && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t({ en: "Progress", hi: "प्रगति" })}
                            </span>
                            <span className="font-medium">{moduleProgress.progress}%</span>
                          </div>
                          <Progress value={moduleProgress.progress} className="h-2" />
                        </div>
                      )}

                      {isLocked && (
                        <div className="text-sm text-muted-foreground">
                          {t({ 
                            en: "Complete the previous module to unlock", 
                            hi: "अनलॉक करने के लिए पिछला मॉड्यूल पूरा करें" 
                          })}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Badges Section */}
          {badges.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                {t({ en: "Your Badges", hi: "आपके बैज" })}
              </h2>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => {
                  const isEarned = userBadges.some(ub => ub.badge_id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                        isEarned
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-muted/50 border-border text-muted-foreground"
                      }`}
                    >
                      <span className="text-xl">{badge.icon}</span>
                      <span className="text-sm font-medium">
                        {language === 'en' ? badge.name_en : badge.name_hi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Modules;
