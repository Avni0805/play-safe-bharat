import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Languages, Shield } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !fullName)) {
      toast.error(t({ en: "Please fill in all fields", hi: "कृपया सभी फ़ील्ड भरें" }));
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t({ en: "Welcome back!", hi: "वापसी पर स्वागत है!" }));
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t({ 
            en: "Account created successfully! Please log in.", 
            hi: "खाता सफलतापूर्वक बनाया गया! कृपया लॉगिन करें।" 
          }));
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t({ en: "Play Safe India", hi: "प्ले सेफ इंडिया" })}
          </h1>
          <p className="text-muted-foreground">
            {t({ 
              en: "Join India's anti-doping community", 
              hi: "भारत के डोपिंग विरोधी समुदाय में शामिल हों" 
            })}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'हिंदी' : 'English'}
          </Button>
        </div>

        {/* Auth Card */}
        <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {t({ en: "Email", hi: "ईमेल" })}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t({ en: "your@email.com", hi: "आपका@ईमेल.com" })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  {t({ en: "Full Name", hi: "पूरा नाम" })}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t({ en: "Your full name", hi: "आपका पूरा नाम" })}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">
                {t({ en: "Password", hi: "पासवर्ड" })}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={loading}
            >
              {loading ? t({ en: "Loading...", hi: "लोड हो रहा है..." }) : isLogin ? t({ en: "Sign In", hi: "साइन इन करें" }) : t({ en: "Sign Up", hi: "साइन अप करें" })}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin
                ? t({ en: "Don't have an account? Sign up", hi: "खाता नहीं है? साइन अप करें" })
                : t({ en: "Already have an account? Sign in", hi: "पहले से खाता है? साइन इन करें" })}
            </button>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          {t({ 
            en: "By continuing, you agree to our Terms of Service and Privacy Policy", 
            hi: "जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं" 
          })}
        </p>
      </div>
    </div>
  );
};

export default Auth;
