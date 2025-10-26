import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, BookOpen, Edit2, Save, X } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ modulesCompleted: 0, badgesEarned: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    state: "",
    sport_discipline: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
      setFormData({
        full_name: profileData?.full_name || "",
        bio: profileData?.bio || "",
        state: profileData?.state || "",
        sport_discipline: profileData?.sport_discipline || "",
      });

      // Fetch completed modules count
      const { data: progressData, error: progressError } = await supabase
        .from("user_module_progress")
        .select("*")
        .eq("user_id", user?.id)
        .eq("completed", true);

      if (progressError) throw progressError;

      // Fetch earned badges count
      const { data: badgesData, error: badgesError } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user?.id);

      if (badgesError) throw badgesError;

      setStats({
        modulesCompleted: progressData?.length || 0,
        badgesEarned: badgesData?.length || 0,
      });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en" ? "Failed to load profile" : "प्रोफ़ाइल लोड करने में विफल",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user?.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      setIsEditing(false);

      toast({
        title: language === "en" ? "Success" : "सफलता",
        description: language === "en" ? "Profile updated successfully" : "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en" ? "Failed to update profile" : "प्रोफ़ाइल अपडेट करने में विफल",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      state: profile?.state || "",
      sport_discipline: profile?.sport_discipline || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-2xl">
                    {profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {profile?.full_name || (language === "en" ? "User" : "उपयोगकर्ता")}
                  </CardTitle>
                  <CardDescription>{profile?.email}</CardDescription>
                </div>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  {language === "en" ? "Edit Profile" : "प्रोफ़ाइल संपादित करें"}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {language === "en" ? "Save" : "सहेजें"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" disabled={saving}>
                    <X className="h-4 w-4 mr-2" />
                    {language === "en" ? "Cancel" : "रद्द करें"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Modules Completed" : "पूर्ण मॉड्यूल"}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.modulesCompleted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Badges Earned" : "अर्जित बैज"}
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.badgesEarned}</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Profile Information" : "प्रोफ़ाइल जानकारी"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                {language === "en" ? "Full Name" : "पूरा नाम"}
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                {language === "en" ? "Bio" : "जीवनी"}
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                placeholder={language === "en" ? "Tell us about yourself..." : "अपने बारे में बताएं..."}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                {language === "en" ? "State" : "राज्य"}
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                disabled={!isEditing}
                placeholder={language === "en" ? "Your state" : "आपका राज्य"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sport_discipline">
                {language === "en" ? "Sport Discipline" : "खेल अनुशासन"}
              </Label>
              <Input
                id="sport_discipline"
                value={formData.sport_discipline}
                onChange={(e) => setFormData({ ...formData, sport_discipline: e.target.value })}
                disabled={!isEditing}
                placeholder={language === "en" ? "Your sport" : "आपका खेल"}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
