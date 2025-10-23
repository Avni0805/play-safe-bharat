import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Clock, Users, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  event_date: string;
  event_time: string;
  event_type: string;
  location: string;
  max_participants: number | null;
}

const Events = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setRegistrations(data?.map(r => r.event_id) || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: t({ en: "Error", hi: "त्रुटि" }),
        description: t({ 
          en: "Please login to register", 
          hi: "पंजीकरण के लिए कृपया लॉगिन करें" 
        }),
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          user_id: user.id,
          event_id: eventId
        });

      if (error) throw error;

      setRegistrations([...registrations, eventId]);
      toast({
        title: t({ en: "Success!", hi: "सफलता!" }),
        description: t({ 
          en: "You have been registered for the event", 
          hi: "आप इवेंट के लिए पंजीकृत हो गए हैं" 
        })
      });
    } catch (error) {
      console.error('Error registering:', error);
      toast({
        title: t({ en: "Error", hi: "त्रुटि" }),
        description: t({ 
          en: "Failed to register for event", 
          hi: "इवेंट के लिए पंजीकरण विफल रहा" 
        }),
        variant: "destructive"
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;

      setRegistrations(registrations.filter(id => id !== eventId));
      toast({
        title: t({ en: "Unregistered", hi: "पंजीकरण रद्द" }),
        description: t({ 
          en: "You have been unregistered from the event", 
          hi: "आपका इवेंट पंजीकरण रद्द कर दिया गया है" 
        })
      });
    } catch (error) {
      console.error('Error unregistering:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-12 w-48 bg-muted animate-pulse rounded" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.event_date) < new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent flex items-center gap-3">
              <Calendar className="h-10 w-10 text-primary" />
              {t({ en: "Events", hi: "कार्यक्रम" })}
            </h1>
            <p className="text-muted-foreground">
              {t({ 
                en: "Join workshops, webinars, and training sessions on anti-doping", 
                hi: "डोपिंग रोधी पर कार्यशालाओं, वेबिनार और प्रशिक्षण सत्रों में शामिल हों" 
              })}
            </p>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {t({ en: "Upcoming Events", hi: "आगामी कार्यक्रम" })}
            </h2>
            
            {upcomingEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t({ en: "No upcoming events", hi: "कोई आगामी कार्यक्रम नहीं" })}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => {
                  const isRegistered = registrations.includes(event.id);
                  return (
                    <Card 
                      key={event.id} 
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Date Box */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-lg flex flex-col items-center justify-center text-white">
                          <p className="text-3xl font-bold">
                            {format(new Date(event.event_date), 'd')}
                          </p>
                          <p className="text-sm">
                            {format(new Date(event.event_date), 'MMM')}
                          </p>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-bold mb-2">
                                {language === 'en' ? event.title_en : event.title_hi}
                              </h3>
                              <p className="text-muted-foreground">
                                {language === 'en' ? event.description_en : event.description_hi}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium whitespace-nowrap">
                              {event.event_type}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{event.event_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            {event.max_participants && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>
                                  {t({ en: "Max", hi: "अधिकतम" })}: {event.max_participants}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="pt-2">
                            {isRegistered ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleUnregister(event.id)}
                                >
                                  {t({ en: "Cancel Registration", hi: "पंजीकरण रद्द करें" })}
                                </Button>
                                <div className="flex items-center gap-2 text-success">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    {t({ en: "Registered", hi: "पंजीकृत" })}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <Button onClick={() => handleRegister(event.id)}>
                                {t({ en: "Register Now", hi: "अभी पंजीकरण करें" })}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                {t({ en: "Past Events", hi: "पिछले कार्यक्रम" })}
              </h2>
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="p-6 opacity-75">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex flex-col items-center justify-center">
                        <p className="text-xl font-bold">
                          {format(new Date(event.event_date), 'd')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.event_date), 'MMM')}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">
                          {language === 'en' ? event.title_en : event.title_hi}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {event.event_type} • {event.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Events;
