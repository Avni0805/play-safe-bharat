import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { events } from "@/data/dummyData";
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";

const UpcomingEvents = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-accent" />
          {t({ en: "Upcoming Events", hi: "आगामी कार्यक्रम" })}
        </h2>
        <Button variant="ghost" size="sm" className="gap-2">
          {t({ en: "View All", hi: "सभी देखें" })}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id} className="p-5 bg-card border-border/50 hover:shadow-md transition-all hover:border-primary/30">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg">{t(event.title)}</h3>
                    <Badge variant={event.type === "Online" ? "secondary" : event.type === "Competition" ? "default" : "outline"}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t(event.description)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </div>
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </div>

              <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                {t({ en: "Register", hi: "पंजीकरण करें" })}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
