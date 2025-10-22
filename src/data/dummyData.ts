export const modules = [
  {
    id: 1,
    title: { en: "Introduction to Anti-Doping", hi: "डोपिंग विरोधी का परिचय" },
    description: { en: "Learn the basics of anti-doping in sports", hi: "खेल में डोपिंग विरोधी की मूल बातें जानें" },
    completed: true,
    progress: 100
  },
  {
    id: 2,
    title: { en: "Prohibited Substances", hi: "निषिद्ध पदार्थ" },
    description: { en: "Understanding banned substances and methods", hi: "प्रतिबंधित पदार्थों और विधियों को समझना" },
    completed: true,
    progress: 100
  },
  {
    id: 3,
    title: { en: "Testing Procedures", hi: "परीक्षण प्रक्रियाएं" },
    description: { en: "What to expect during doping tests", hi: "डोपिंग परीक्षण के दौरान क्या उम्मीद करें" },
    completed: false,
    progress: 60
  },
  {
    id: 4,
    title: { en: "Athletes' Rights", hi: "एथलीटों के अधिकार" },
    description: { en: "Know your rights as an athlete", hi: "एक एथलीट के रूप में अपने अधिकारों को जानें" },
    completed: false,
    progress: 0
  }
];

export const stories = [
  {
    id: 1,
    author: { name: "Priya Sharma", avatar: "PS" },
    content: { 
      en: "Just completed my first anti-doping certification! Feeling proud to be a clean athlete. 🏃‍♀️ #PlaySafeIndia", 
      hi: "अभी-अभी मेरा पहला डोपिंग विरोधी प्रमाणन पूरा किया! स्वच्छ एथलीट होने पर गर्व महसूस कर रही हूं। 🏃‍♀️ #PlaySafeIndia"
    },
    timestamp: "2 hours ago",
    likes: 45,
    comments: 8,
    shares: 3,
    liked: false
  },
  {
    id: 2,
    author: { name: "Rahul Verma", avatar: "RV" },
    content: { 
      en: "Today's webinar on nutrition and supplements was incredibly informative. Thanks to the community for organizing!", 
      hi: "पोषण और सप्लीमेंट्स पर आज की वेबिनार बेहद जानकारीपूर्ण थी। आयोजन के लिए समुदाय का धन्यवाद!"
    },
    timestamp: "5 hours ago",
    likes: 67,
    comments: 12,
    shares: 5,
    liked: true
  },
  {
    id: 3,
    author: { name: "Anjali Patel", avatar: "AP" },
    content: { 
      en: "Competed in my first national event as a certified clean athlete. The pride is unmatched! 🏅", 
      hi: "प्रमाणित स्वच्छ एथलीट के रूप में अपने पहले राष्ट्रीय कार्यक्रम में भाग लिया। गर्व बेमिसाल है! 🏅"
    },
    timestamp: "1 day ago",
    likes: 123,
    comments: 24,
    shares: 15,
    liked: true
  }
];

export const events = [
  {
    id: 1,
    title: { en: "Clean Sport Webinar", hi: "स्वच्छ खेल वेबिनार" },
    date: "Dec 25, 2025",
    time: "3:00 PM IST",
    type: "Online",
    description: { en: "Expert panel discussion on maintaining clean sport practices", hi: "स्वच्छ खेल प्रथाओं को बनाए रखने पर विशेषज्ञ पैनल चर्चा" }
  },
  {
    id: 2,
    title: { en: "Anti-Doping Workshop", hi: "डोपिंग विरोधी कार्यशाला" },
    date: "Jan 5, 2026",
    time: "10:00 AM IST",
    type: "In-person",
    location: "New Delhi",
    description: { en: "Hands-on training for athletes and coaches", hi: "एथलीटों और कोचों के लिए व्यावहारिक प्रशिक्षण" }
  },
  {
    id: 3,
    title: { en: "National Track Meet", hi: "राष्ट्रीय ट्रैक मीट" },
    date: "Jan 15, 2026",
    time: "8:00 AM IST",
    type: "Competition",
    location: "Mumbai",
    description: { en: "Annual track and field championship", hi: "वार्षिक ट्रैक और फील्ड चैंपियनशिप" }
  }
];

export const news = [
  {
    id: 1,
    title: { en: "New Guidelines Released by NADA", hi: "नाडा द्वारा नई दिशानिर्देश जारी" },
    excerpt: { en: "National Anti-Doping Agency announces updated testing protocols for 2026", hi: "राष्ट्रीय डोपिंग विरोधी एजेंसी ने 2026 के लिए अद्यतन परीक्षण प्रोटोकॉल की घोषणा की" },
    date: "Dec 20, 2025",
    category: "Policy"
  },
  {
    id: 2,
    title: { en: "India's Clean Sport Initiative", hi: "भारत की स्वच्छ खेल पहल" },
    excerpt: { en: "Government launches nationwide campaign to promote clean athletics", hi: "सरकार ने स्वच्छ एथलेटिक्स को बढ़ावा देने के लिए राष्ट्रव्यापी अभियान शुरू किया" },
    date: "Dec 18, 2025",
    category: "News"
  },
  {
    id: 3,
    title: { en: "Athlete Rights Workshop Success", hi: "एथलीट अधिकार कार्यशाला सफल" },
    excerpt: { en: "Over 500 athletes participate in recent rights awareness program", hi: "हाल के अधिकार जागरूकता कार्यक्रम में 500 से अधिक एथलीटों ने भाग लिया" },
    date: "Dec 15, 2025",
    category: "Education"
  }
];

export const badges = [
  { id: 1, name: { en: "First Module", hi: "पहला मॉड्यूल" }, icon: "🎓", earned: true },
  { id: 2, name: { en: "Quiz Master", hi: "क्विज मास्टर" }, icon: "🏆", earned: true },
  { id: 3, name: { en: "Community Star", hi: "समुदाय सितारा" }, icon: "⭐", earned: true },
  { id: 4, name: { en: "Clean Athlete", hi: "स्वच्छ एथलीट" }, icon: "✨", earned: false }
];
