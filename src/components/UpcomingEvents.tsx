import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const UpcomingEvents = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(5);

      // Fetch user registrations
      const { data: regsData } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id);

      setEvents(eventsData || []);
      setRegistrations(new Set(regsData?.map(r => r.event_id) || []));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) return;

    const isRegistered = registrations.has(eventId);

    try {
      if (isRegistered) {
        await supabase
          .from('event_registrations')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        setRegistrations(prev => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
        toast.success(t({ en: "Registration cancelled", hi: "पंजीकरण रद्द किया गया" }));
      } else {
        await supabase
          .from('event_registrations')
          .insert({ event_id: eventId, user_id: user.id });

        setRegistrations(prev => new Set([...prev, eventId]));
        toast.success(t({ en: "Registered successfully!", hi: "सफलतापूर्वक पंजीकृत!" }));
      }
    } catch (error) {
      console.error('Error toggling registration:', error);
      toast.error(t({ en: "An error occurred", hi: "एक त्रुटि हुई" }));
    }
  };

  if (loading) {
    return <div className="space-y-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      {[1, 2].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded" />)}
    </div>;
  }

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
        {events.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              {t({ en: "No upcoming events", hi: "कोई आगामी कार्यक्रम नहीं" })}
            </p>
          </Card>
        ) : (
          events.map((event) => {
            const isRegistered = registrations.has(event.id);
            
            return (
              <Card key={event.id} className="p-5 bg-card border-border/50 hover:shadow-md transition-all hover:border-primary/30">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          {t({ en: event.title_en, hi: event.title_hi })}
                        </h3>
                        <Badge variant={event.event_type === "Online" ? "secondary" : event.event_type === "Competition" ? "default" : "outline"}>
                          {event.event_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t({ en: event.description_en, hi: event.description_hi })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.event_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.event_time}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  <Button 
                    className={`w-full sm:w-auto ${isRegistered ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'}`}
                    onClick={() => handleRegister(event.id)}
                  >
                    {isRegistered 
                      ? t({ en: "Cancel Registration", hi: "पंजीकरण रद्द करें" })
                      : t({ en: "Register", hi: "पंजीकरण करें" })
                    }
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
