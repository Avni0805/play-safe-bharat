import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Award, BookOpen, Target } from "lucide-react";

const ProgressOverview = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
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

  if (loading) {
    return <div className="space-y-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded" />)}
      </div>
    </div>;
  }

  const completedModules = progress.filter(p => p.completed).length;
  const totalModules = modules.length;
  const earnedBadgesCount = userBadges.length;
  const overallProgress = progress.length > 0 
    ? Math.round(progress.reduce((acc, p) => acc + (p.progress || 0), 0) / modules.length) 
    : 0;
  const currentModule = modules.find(m => {
    const moduleProgress = progress.find(p => p.module_id === m.id);
    return moduleProgress && !moduleProgress.completed;
  });
  const currentProgress = currentModule 
    ? progress.find(p => p.module_id === currentModule.id)?.progress || 0
    : 0;

  const stats = [
    {
      icon: BookOpen,
      label: { en: "Modules Completed", hi: "पूर्ण मॉड्यूल" },
      value: `${completedModules}/${totalModules}`,
      color: "text-primary"
    },
    {
      icon: Award,
      label: { en: "Badges Earned", hi: "अर्जित बैज" },
      value: `${earnedBadgesCount}/${badges.length}`,
      color: "text-secondary"
    },
    {
      icon: Target,
      label: { en: "Overall Progress", hi: "कुल प्रगति" },
      value: `${overallProgress}%`,
      color: "text-accent"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          {t({ en: "Your Progress", hi: "आपकी प्रगति" })}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={t(stat.label)} className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-background/80 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t(stat.label)}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t({ en: "Current Module Progress", hi: "वर्तमान मॉड्यूल प्रगति" })}</h3>
            <span className="text-sm text-muted-foreground">{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
          {currentModule && (
            <p className="text-sm text-muted-foreground">
              {t({ en: currentModule.title_en, hi: currentModule.title_hi })}
            </p>
          )}
          {!currentModule && completedModules === totalModules && (
            <p className="text-sm text-success">
              {t({ en: "All modules completed! 🎉", hi: "सभी मॉड्यूल पूरे हो गए! 🎉" })}
            </p>
          )}
        </div>
      </Card>

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
                {t({ en: badge.name_en, hi: badge.name_hi })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressOverview;
