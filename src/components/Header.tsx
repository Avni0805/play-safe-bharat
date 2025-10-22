import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, BookOpen, MessageSquare, Newspaper, Calendar, User, LogOut, Languages } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { icon: Home, label: { en: "Home", hi: "होम" }, path: "/" },
    { icon: BookOpen, label: { en: "Modules", hi: "मॉड्यूल" }, path: "/modules" },
    { icon: MessageSquare, label: { en: "Forums", hi: "मंच" }, path: "/forums" },
    { icon: Newspaper, label: { en: "News", hi: "समाचार" }, path: "/news" },
    { icon: Calendar, label: { en: "Events", hi: "कार्यक्रम" }, path: "/events" },
    { icon: User, label: { en: "Profile", hi: "प्रोफ़ाइल" }, path: "/profile" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold">
            PS
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t({ en: "Play Safe India", hi: "प्ले सेफ इंडिया" })}
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button variant="ghost" size="sm" className="gap-2">
                <item.icon className="h-4 w-4" />
                {t(item.label)}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'हिं' : 'EN'}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">{t({ en: "Logout", hi: "लॉगआउट" })}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
