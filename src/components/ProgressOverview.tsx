import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { modules, badges } from "@/data/dummyData";
import { Trophy, Award, BookOpen, Target } from "lucide-react";

const ProgressOverview = () => {
  const { t } = useLanguage();
  
  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const earnedBadges = badges.filter(b => b.earned).length;
  const overallProgress = (modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);

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
      value: `${earnedBadges}/${badges.length}`,
      color: "text-secondary"
    },
    {
      icon: Target,
      label: { en: "Overall Progress", hi: "कुल प्रगति" },
      value: `${Math.round(overallProgress)}%`,
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
            <span className="text-sm text-muted-foreground">{modules[2].progress}%</span>
          </div>
          <Progress value={modules[2].progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{t(modules[2].title)}</p>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              badge.earned
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-muted/50 border-border text-muted-foreground"
            }`}
          >
            <span className="text-xl">{badge.icon}</span>
            <span className="text-sm font-medium">{t(badge.name)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;
