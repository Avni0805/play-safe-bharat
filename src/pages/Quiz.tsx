import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface Module {
  id: string;
  title_en: string;
  title_hi: string;
  content_en: string;
  content_hi: string;
}

// Dummy quiz questions - In production, these would come from the database
const generateQuizQuestions = (moduleId: string) => [
  {
    id: 1,
    question_en: "What is the primary purpose of anti-doping regulations?",
    question_hi: "डोपिंग रोधी नियमों का प्राथमिक उद्देश्य क्या है?",
    options_en: [
      "To protect athlete health and fair competition",
      "To increase competition difficulty",
      "To reduce training costs",
      "To limit participation"
    ],
    options_hi: [
      "एथलीट स्वास्थ्य और निष्पक्ष प्रतिस्पर्धा की रक्षा करना",
      "प्रतिस्पर्धा कठिनाई बढ़ाना",
      "प्रशिक्षण लागत कम करना",
      "भागीदारी सीमित करना"
    ],
    correct_answer: 0
  },
  {
    id: 2,
    question_en: "When should you check if a substance is prohibited?",
    question_hi: "आपको कब जांचना चाहिए कि कोई पदार्थ प्रतिबंधित है या नहीं?",
    options_en: [
      "Before taking any medication or supplement",
      "After testing positive",
      "Only during competitions",
      "Never needed"
    ],
    options_hi: [
      "कोई भी दवा या पूरक लेने से पहले",
      "पॉजिटिव परीक्षण के बाद",
      "केवल प्रतियोगिताओं के दौरान",
      "कभी आवश्यकता नहीं"
    ],
    correct_answer: 0
  },
  {
    id: 3,
    question_en: "What is a Therapeutic Use Exemption (TUE)?",
    question_hi: "चिकित्सीय उपयोग छूट (TUE) क्या है?",
    options_en: [
      "Permission to use a prohibited substance for medical treatment",
      "A type of performance enhancer",
      "A training exemption",
      "A competition waiver"
    ],
    options_hi: [
      "चिकित्सा उपचार के लिए प्रतिबंधित पदार्थ का उपयोग करने की अनुमति",
      "प्रदर्शन बढ़ाने वाला एक प्रकार",
      "प्रशिक्षण छूट",
      "प्रतियोगिता माफी"
    ],
    correct_answer: 0
  }
];

const Quiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [module, setModule] = useState<Module | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      if (!moduleId || !user) return;

      try {
        const { data } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (data) {
          setModule(data);
          setQuestions(generateQuizQuestions(moduleId));
        }
      } catch (error) {
        console.error('Error fetching module:', error);
        toast({
          title: t({ en: "Error", hi: "त्रुटि" }),
          description: t({ 
            en: "Failed to load quiz", 
            hi: "क्विज़ लोड करने में विफल" 
          }),
          variant: "destructive"
        });
        navigate('/modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId, user]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed - calculate score
      const correctAnswers = newAnswers.filter((answer, index) => 
        answer === questions[index].correct_answer
      ).length;
      setScore(correctAnswers);
      setShowResult(true);
      
      // Update progress in database
      updateProgress(correctAnswers);
    }
  };

  const updateProgress = async (correctAnswers: number) => {
    if (!user || !moduleId) return;

    const progressPercent = Math.round((correctAnswers / questions.length) * 100);
    const isCompleted = progressPercent >= 70; // 70% passing grade

    try {
      // Check if progress exists
      const { data: existingProgress } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single();

      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('user_module_progress')
          .update({
            progress: progressPercent,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress
        await supabase
          .from('user_module_progress')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            progress: progressPercent,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
          });
      }

      toast({
        title: isCompleted 
          ? t({ en: "Congratulations! 🎉", hi: "बधाई हो! 🎉" })
          : t({ en: "Quiz Completed", hi: "क्विज़ पूरा हुआ" }),
        description: isCompleted
          ? t({ 
              en: "You've successfully completed this module!", 
              hi: "आपने इस मॉड्यूल को सफलतापूर्वक पूरा किया है!" 
            })
          : t({ 
              en: "Keep practicing to improve your score!", 
              hi: "अपने स्कोर को बेहतर बनाने के लिए अभ्यास करते रहें!" 
            })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  const handleBackToModules = () => {
    navigate('/modules');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="h-12 w-48 bg-muted animate-pulse rounded mb-4" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!module || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto p-8 text-center">
            <p className="text-muted-foreground">
              {t({ en: "Quiz not found", hi: "क्विज़ नहीं मिली" })}
            </p>
            <Button onClick={handleBackToModules} className="mt-4">
              {t({ en: "Back to Modules", hi: "मॉड्यूल पर वापस जाएं" })}
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Module Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {language === 'en' ? module.title_en : module.title_hi}
            </h1>
            <p className="text-muted-foreground">
              {t({ en: "Complete the quiz to finish this module", hi: "इस मॉड्यूल को समाप्त करने के लिए क्विज़ पूरा करें" })}
            </p>
          </div>

          {!showResult ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t({ en: "Question", hi: "प्रश्न" })} {currentQuestion + 1} {t({ en: "of", hi: "का" })} {questions.length}
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <Card className="p-8 bg-gradient-to-br from-card to-muted/20">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">
                    {language === 'en' 
                      ? questions[currentQuestion].question_en 
                      : questions[currentQuestion].question_hi
                    }
                  </h2>

                  <div className="space-y-3">
                    {(language === 'en' 
                      ? questions[currentQuestion].options_en 
                      : questions[currentQuestion].options_hi
                    ).map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index
                              ? 'border-primary bg-primary'
                              : 'border-border'
                          }`}>
                            {selectedAnswer === index && (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleNext}
                      disabled={selectedAnswer === null}
                      size="lg"
                    >
                      {currentQuestion < questions.length - 1
                        ? t({ en: "Next Question", hi: "अगला प्रश्न" })
                        : t({ en: "Finish Quiz", hi: "क्विज़ समाप्त करें" })
                      }
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            // Results Card
            <Card className="p-8 bg-gradient-to-br from-card to-muted/20">
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Trophy className="h-16 w-16 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">
                    {t({ en: "Quiz Completed!", hi: "क्विज़ पूरी हुई!" })}
                  </h2>
                  <p className="text-5xl font-bold text-primary">
                    {score}/{questions.length}
                  </p>
                  <p className="text-muted-foreground">
                    {Math.round((score / questions.length) * 100)}% {t({ en: "Correct", hi: "सही" })}
                  </p>
                </div>

                {score / questions.length >= 0.7 ? (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {t({ en: "Passed! Great job!", hi: "पास! बहुत बढ़िया काम!" })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-destructive">
                      <XCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {t({ 
                          en: "Need 70% to pass. Try again!", 
                          hi: "पास करने के लिए 70% चाहिए। फिर से प्रयास करें!" 
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    {t({ en: "Retry Quiz", hi: "फिर से प्रयास करें" })}
                  </Button>
                  <Button onClick={handleBackToModules}>
                    {t({ en: "Back to Modules", hi: "मॉड्यूल पर वापस जाएं" })}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
