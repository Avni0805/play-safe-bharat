-- Create module_chapters table for storing chapter content
CREATE TABLE public.module_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_hi TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'video', 'pdf', 'image', 'link'
  media_url TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_chapter_progress table for tracking chapter completion
CREATE TABLE public.user_chapter_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.module_chapters(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- Enable Row Level Security
ALTER TABLE public.module_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chapter_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for module_chapters
CREATE POLICY "Chapters are viewable by everyone"
  ON public.module_chapters
  FOR SELECT
  USING (true);

-- RLS Policies for user_chapter_progress
CREATE POLICY "Users can view own chapter progress"
  ON public.user_chapter_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chapter progress"
  ON public.user_chapter_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chapter progress"
  ON public.user_chapter_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_module_chapters_updated_at
  BEFORE UPDATE ON public.module_chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_chapter_progress_updated_at
  BEFORE UPDATE ON public.user_chapter_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample chapters for the first module (Basic Understanding)
INSERT INTO public.module_chapters (module_id, title_en, title_hi, content_en, content_hi, content_type, order_index, duration_minutes)
SELECT 
  id,
  'Introduction to Anti-Doping',
  'डोपिंग रोधी का परिचय',
  '# Welcome to Anti-Doping Education

Anti-doping is about protecting the integrity of sport and the health of athletes. In this chapter, you will learn:

- What is doping and why it matters
- The spirit of sport and fair play
- Your rights and responsibilities as an athlete
- How anti-doping protects your health

**Key Points:**
- Doping undermines fair competition
- Clean sport protects athlete health
- Knowledge is your best defense
- Every athlete has rights

Let''s begin your journey to becoming an informed, clean athlete!',
  '# डोपिंग रोधी शिक्षा में आपका स्वागत है

डोपिंग रोधी खेल की अखंडता और एथलीटों के स्वास्थ्य की रक्षा के बारे में है। इस अध्याय में, आप सीखेंगे:

- डोपिंग क्या है और यह क्यों महत्वपूर्ण है
- खेल की भावना और निष्पक्ष खेल
- एक एथलीट के रूप में आपके अधिकार और जिम्मेदारियां
- डोपिंग रोधी आपके स्वास्थ्य की रक्षा कैसे करता है

**मुख्य बिंदु:**
- डोपिंग निष्पक्ष प्रतिस्पर्धा को कमजोर करती है
- स्वच्छ खेल एथलीट स्वास्थ्य की रक्षा करता है
- ज्ञान आपकी सबसे अच्छी रक्षा है
- हर एथलीट के अधिकार हैं

एक सूचित, स्वच्छ एथलीट बनने की अपनी यात्रा शुरू करें!',
  'text',
  1,
  10
FROM public.modules
WHERE order_index = 1
LIMIT 1;

INSERT INTO public.module_chapters (module_id, title_en, title_hi, content_en, content_hi, content_type, order_index, duration_minutes)
SELECT 
  id,
  'Prohibited Substances',
  'निषिद्ध पदार्थ',
  '# Understanding Prohibited Substances

The World Anti-Doping Agency (WADA) maintains a list of prohibited substances and methods. This chapter covers:

## Categories of Prohibited Substances:

1. **Anabolic Agents** - Build muscle artificially
2. **Peptide Hormones** - Stimulate growth and recovery
3. **Beta-2 Agonists** - Improve breathing and endurance
4. **Hormone Modulators** - Alter hormone levels
5. **Diuretics** - Used to mask other substances

## Why These Are Prohibited:

- **Health Risks**: Can cause serious medical problems
- **Unfair Advantage**: Create unnatural performance enhancement
- **Spirit of Sport**: Violate principles of fair play

**Remember:** Always check medications and supplements before use!',
  '# निषिद्ध पदार्थों को समझना

विश्व डोपिंग रोधी एजेंसी (WADA) निषिद्ध पदार्थों और विधियों की एक सूची रखती है। इस अध्याय में शामिल हैं:

## निषिद्ध पदार्थों की श्रेणियां:

1. **एनाबॉलिक एजेंट** - कृत्रिम रूप से मांसपेशियों का निर्माण
2. **पेप्टाइड हार्मोन** - विकास और रिकवरी को उत्तेजित करें
3. **बीटा-2 एगोनिस्ट** - श्वास और सहनशक्ति में सुधार
4. **हार्मोन मॉड्यूलेटर** - हार्मोन स्तर बदलें
5. **मूत्रवर्धक** - अन्य पदार्थों को छिपाने के लिए उपयोग किया जाता है

## ये क्यों निषिद्ध हैं:

- **स्वास्थ्य जोखिम**: गंभीर चिकित्सा समस्याएं पैदा कर सकते हैं
- **अनुचित लाभ**: अप्राकृतिक प्रदर्शन वृद्धि बनाते हैं
- **खेल की भावना**: निष्पक्ष खेल के सिद्धांतों का उल्लंघन

**याद रखें:** उपयोग से पहले हमेशा दवाओं और पूरकों की जांच करें!',
  'text',
  2,
  15
FROM public.modules
WHERE order_index = 1
LIMIT 1;

INSERT INTO public.module_chapters (module_id, title_en, title_hi, content_en, content_hi, content_type, order_index, duration_minutes)
SELECT 
  id,
  'Testing Procedures',
  'परीक्षण प्रक्रियाएं',
  '# Anti-Doping Testing Procedures

Understanding the testing process helps you stay prepared and confident.

## Types of Testing:

### In-Competition Testing
- Conducted during or around competitions
- Random selection of athletes
- Immediate notification required

### Out-of-Competition Testing
- Can happen anytime, anywhere
- No advance notice given
- Tests for substances used in training

## Your Rights During Testing:

✓ Be accompanied by a representative
✓ Request delay for valid reasons (max 60 minutes)
✓ Receive proper notification
✓ Provide feedback on the process
✓ Request copies of documentation

## The Testing Process:

1. **Notification** - DCO identifies and notifies you
2. **Reporting** - Report to testing station promptly
3. **Selection** - Choose your sealed sample collection kit
4. **Provision** - Provide urine/blood sample under observation
5. **Sealing** - Seal samples and complete paperwork
6. **Documentation** - Receive copies of all forms

**Stay calm and cooperative throughout the process!**',
  '# डोपिंग रोधी परीक्षण प्रक्रियाएं

परीक्षण प्रक्रिया को समझने से आपको तैयार और आत्मविश्वासी रहने में मदद मिलती है।

## परीक्षण के प्रकार:

### प्रतियोगिता में परीक्षण
- प्रतियोगिताओं के दौरान या उसके आसपास आयोजित
- एथलीटों का यादृच्छिक चयन
- तत्काल अधिसूचना आवश्यक

### प्रतियोगिता से बाहर परीक्षण
- कभी भी, कहीं भी हो सकता है
- कोई अग्रिम सूचना नहीं
- प्रशिक्षण में उपयोग किए जाने वाले पदार्थों के लिए परीक्षण

## परीक्षण के दौरान आपके अधिकार:

✓ प्रतिनिधि के साथ रहें
✓ वैध कारणों से देरी का अनुरोध (अधिकतम 60 मिनट)
✓ उचित अधिसूचना प्राप्त करें
✓ प्रक्रिया पर प्रतिक्रिया प्रदान करें
✓ दस्तावेज़ की प्रतियों का अनुरोध करें

## परीक्षण प्रक्रिया:

1. **अधिसूचना** - DCO आपकी पहचान और सूचना देता है
2. **रिपोर्टिंग** - तुरंत परीक्षण स्टेशन पर रिपोर्ट करें
3. **चयन** - अपनी सीलबंद नमूना संग्रह किट चुनें
4. **प्रावधान** - अवलोकन के तहत मूत्र/रक्त नमूना प्रदान करें
5. **सीलिंग** - नमूनों को सील करें और कागजी कार्रवाई पूरी करें
6. **दस्तावेज़ीकरण** - सभी फॉर्मों की प्रतियां प्राप्त करें

**पूरी प्रक्रिया के दौरान शांत और सहयोगी रहें!**',
  'text',
  3,
  12
FROM public.modules
WHERE order_index = 1
LIMIT 1;