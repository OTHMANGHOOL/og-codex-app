import React, { useState, useEffect, createContext, useContext, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Sparkles,
  Brain,
  Wand2,
  Camera,
  BookOpen,
  Users,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Search,
  Filter,
  Heart,
  Share2,
  Download,
  Zap,
  Star,
  TrendingUp,
  Eye,
  Layers,
  Lightbulb,
  Compass,
  Target,
  Award,
  Rocket,
  ExternalLink,
  CheckCircle,
  Plus,
  Minus,
  PlayCircle,
  ArrowRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import './App.css';

// Lazy load components for better performance
const ToolDirectory = lazy(() => import('./components/ToolDirectory'));
const AIStudio = lazy(() => import('./components/AIStudio'));
const ProjectManager = lazy(() => import('./components/ProjectManager'));
const LearningHub = lazy(() => import('./components/LearningHub'));
const Community = lazy(() => import('./components/Community'));

// Theme Context
const ThemeContext = createContext();

// User Context
const UserContext = createContext();

// AI Tools Data - Enhanced with more comprehensive information
const aiToolsData = [
  {
    id: "midjourney",
    name: "Midjourney",
    nameAr: "ميدجورني",
    description: "أداة توليد الصور الأكثر تطوراً في العالم، متخصصة في إنشاء تصاميم داخلية فنية وواقعية من الأوصاف النصية. تستخدم تقنيات الذكاء الاصطناعي المتقدمة لإنتاج صور عالية الجودة بأنماط فنية متنوعة.",
    category: "Generative AI",
    categoryAr: "الذكاء الاصطناعي التوليدي",
    subcategory: "Image Generation",
    subcategoryAr: "توليد الصور",
    rating: 4.9,
    popularity: 95,
    difficulty: "متوسط",
    pricing: "مدفوع",
    pricingDetails: "$10-60/شهر",
    features: [
      "توليد صور عالية الجودة بدقة 4K",
      "أنماط فنية متنوعة ومتطورة",
      "تحكم متقدم في التفاصيل والإضاءة",
      "دعم الأوامر المعقدة والمتخصصة",
      "مجتمع نشط ومكتبة إلهام ضخمة",
      "تحديثات مستمرة وميزات جديدة",
      "واجهة سهلة الاستخدام عبر Discord"
    ],
    useCases: [
      "التصميم المفاهيمي للمساحات الداخلية",
      "العروض التقديمية للعملاء",
      "الإلهام الإبداعي والعصف الذهني",
      "النماذج الأولية للمشاريع",
      "التسويق البصري والمحتوى الرقمي",
      "تصميم الأثاث والديكورات",
      "محاكاة الإضاءة والألوان"
    ],
    pros: [
      "جودة صور استثنائية ومذهلة",
      "سهولة الاستخدام للمبتدئين",
      "تحديثات مستمرة وتطوير دائم",
      "مجتمع داعم ومفيد",
      "سرعة في التوليد",
      "تنوع في الأنماط الفنية"
    ],
    cons: [
      "تكلفة مرتفعة نسبياً",
      "قائمة انتظار في أوقات الذروة",
      "تحكم محدود في التفاصيل الدقيقة",
      "يتطلب اشتراك Discord",
      "قيود على الاستخدام التجاري"
    ],
    link: "https://www.midjourney.com/",
    logo: "/src/assets/midjourney-logo.png",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "البدء مع Midjourney", url: "https://docs.midjourney.com/docs/quick-start", duration: "15 دقيقة" },
      { title: "تقنيات الأوامر المتقدمة", url: "https://docs.midjourney.com/docs/prompts", duration: "30 دقيقة" },
      { title: "معاملات التحكم المتقدمة", url: "https://docs.midjourney.com/docs/parameter-list", duration: "25 دقيقة" }
    ],
    integrations: ["Discord", "Web Interface", "API (قريباً)"],
    lastUpdated: "2025-01-15",
    tags: ["AI", "Image Generation", "Creative", "Professional", "Discord"]
  },
  {
    id: "dalle3",
    name: "DALL·E 3",
    nameAr: "دالي 3",
    description: "نموذج OpenAI المتطور لتوليد الصور، يتميز بفهم عميق للسياق وإنتاج صور واقعية ومفصلة. يعتبر الأفضل في فهم النصوص المعقدة وتحويلها إلى صور دقيقة ومعبرة.",
    category: "Generative AI",
    categoryAr: "الذكاء الاصطناعي التوليدي",
    subcategory: "Image Generation",
    subcategoryAr: "توليد الصور",
    rating: 4.8,
    popularity: 88,
    difficulty: "سهل",
    pricing: "مدفوع",
    pricingDetails: "$20/شهر (ChatGPT Plus)",
    features: [
      "فهم متقدم للنصوص والسياق",
      "صور واقعية عالية الجودة",
      "تكامل مباشر مع ChatGPT",
      "أمان محسن وفلترة المحتوى",
      "سرعة عالية في التوليد",
      "دعم للنصوص داخل الصور",
      "واجهة بسيطة وسهلة الاستخدام"
    ],
    useCases: [
      "التصور السريع للأفكار",
      "النماذج الأولية للتصاميم",
      "المحتوى التسويقي والإعلاني",
      "التوضيحات والرسوم البيانية",
      "الأفكار الإبداعية والعصف الذهني",
      "تصميم الشعارات والهويات",
      "المحتوى التعليمي والتوضيحي"
    ],
    pros: [
      "سهولة الوصول والاستخدام",
      "جودة عالية ونتائج متسقة",
      "فهم ممتاز للسياق والتفاصيل",
      "تكامل مع أدوات OpenAI الأخرى",
      "أمان عالي وفلترة محتوى",
      "دعم فني ممتاز"
    ],
    cons: [
      "قيود صارمة على المحتوى",
      "تكلفة الاشتراك الشهري",
      "عدد محدود من الصور يومياً",
      "أقل مرونة في التحكم",
      "لا يدعم التعديل على الصور"
    ],
    link: "https://openai.com/dall-e-3",
    logo: "/src/assets/dalle-logo.jpg",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "استخدام DALL-E 3 في التصميم", url: "https://help.openai.com/en/articles/7000030-dall-e-3-guide", duration: "20 دقيقة" },
      { title: "كتابة الأوامر الفعالة", url: "https://help.openai.com/en/articles/6757141-dall-e-prompting-guide", duration: "15 دقيقة" }
    ],
    integrations: ["ChatGPT", "OpenAI API", "Microsoft Copilot"],
    lastUpdated: "2025-01-10",
    tags: ["AI", "OpenAI", "Realistic", "Fast", "Easy"]
  },
  {
    id: "stablediffusion",
    name: "Stable Diffusion",
    nameAr: "ستيبل ديفيوجن",
    description: "نموذج مفتوح المصدر قوي لتوليد الصور، يوفر تحكماً كاملاً وإمكانيات تخصيص لا محدودة. يمكن تشغيله محلياً أو عبر الخدمات السحابية مع إمكانيات تدريب مخصصة.",
    category: "Generative AI",
    categoryAr: "الذكاء الاصطناعي التوليدي",
    subcategory: "Image Generation",
    subcategoryAr: "توليد الصور",
    rating: 4.7,
    popularity: 82,
    difficulty: "متقدم",
    pricing: "مجاني",
    pricingDetails: "مجاني (مفتوح المصدر)",
    features: [
      "مفتوح المصدر بالكامل",
      "تحكم كامل في جميع المعاملات",
      "نماذج مخصصة وقابلة للتدريب",
      "تشغيل محلي أو سحابي",
      "مجتمع نشط ومطورين متفانين",
      "دعم للإضافات والتوسعات",
      "واجهات متعددة ومتنوعة"
    ],
    useCases: [
      "التطوير المخصص للمشاريع",
      "البحث والتطوير الأكاديمي",
      "النماذج المتخصصة للتصميم الداخلي",
      "التدريب المخصص على بيانات محددة",
      "التطبيقات التجارية المتقدمة",
      "التجريب والابتكار",
      "المشاريع مفتوحة المصدر"
    ],
    pros: [
      "مجاني تماماً ومفتوح المصدر",
      "تحكم كامل ومرونة عالية",
      "قابلية التخصيص اللامحدودة",
      "مجتمع قوي ومساعد",
      "لا توجد قيود على الاستخدام",
      "تحديثات مستمرة من المجتمع"
    ],
    cons: [
      "يتطلب خبرة تقنية متقدمة",
      "استهلاك موارد حاسوبية عالي",
      "منحنى تعلم حاد وصعب",
      "يحتاج إعداد معقد",
      "قد يحتاج أجهزة قوية"
    ],
    link: "https://stability.ai/stable-diffusion",
    logo: "/src/assets/stable-diffusion-logo.jpeg",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "تثبيت Stable Diffusion", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui", duration: "45 دقيقة" },
      { title: "إنشاء نماذج مخصصة", url: "https://stable-diffusion-art.com/training/", duration: "60 دقيقة" },
      { title: "استخدام ControlNet", url: "https://stable-diffusion-art.com/controlnet/", duration: "35 دقيقة" }
    ],
    integrations: ["Python", "Hugging Face", "ComfyUI", "AUTOMATIC1111", "InvokeAI"],
    lastUpdated: "2025-01-12",
    tags: ["Open Source", "Customizable", "Advanced", "Free", "Local"]
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    nameAr: "ليوناردو الذكي",
    description: "منصة ذكاء اصطناعي متخصصة في توليد الصور والفنون الرقمية، تركز على الجودة العالية والتحكم الدقيق. تقدم أدوات متقدمة للمصممين والفنانين المحترفين.",
    category: "Generative AI",
    categoryAr: "الذكاء الاصطناعي التوليدي",
    subcategory: "Image Generation",
    subcategoryAr: "توليد الصور",
    rating: 4.6,
    popularity: 75,
    difficulty: "متوسط",
    pricing: "مجاني/مدفوع",
    pricingDetails: "مجاني مع حدود، $10-48/شهر",
    features: [
      "نماذج متخصصة للتصميم",
      "تحكم دقيق في الأنماط",
      "أدوات تحرير متقدمة",
      "مكتبة نماذج ضخمة",
      "واجهة سهلة الاستخدام",
      "دعم للرسم الرقمي",
      "تصدير بجودات متعددة"
    ],
    useCases: [
      "تصميم الشخصيات والمفاهيم",
      "الفنون الرقمية والتوضيحات",
      "تصميم المنتجات والأثاث",
      "المحتوى التسويقي الإبداعي",
      "النماذج الأولية البصرية",
      "تصميم الألعاب والرسوم المتحركة"
    ],
    pros: [
      "جودة عالية ونتائج احترافية",
      "تنوع في النماذج والأنماط",
      "واجهة بديهية وسهلة",
      "خطة مجانية سخية",
      "مجتمع نشط ومفيد",
      "تحديثات منتظمة"
    ],
    cons: [
      "أبطأ من بعض المنافسين",
      "خيارات محدودة في الخطة المجانية",
      "يحتاج تعلم للاستفادة الكاملة",
      "دعم فني محدود"
    ],
    link: "https://leonardo.ai/",
    logo: "/src/assets/leonardo-logo.jpg",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "البدء مع Leonardo AI", url: "https://docs.leonardo.ai/", duration: "20 دقيقة" },
      { title: "استخدام النماذج المتخصصة", url: "https://docs.leonardo.ai/docs/using-models", duration: "25 دقيقة" }
    ],
    integrations: ["Web Interface", "API", "Photoshop Plugin"],
    lastUpdated: "2025-01-08",
    tags: ["AI", "Professional", "Design", "Art", "Creative"]
  },
  {
    id: "runway",
    name: "Runway ML",
    nameAr: "رانواي إم إل",
    description: "منصة شاملة للذكاء الاصطناعي الإبداعي، تركز على توليد الفيديو والصور والمحتوى التفاعلي. تقدم أدوات متقدمة للمبدعين والمصممين لإنتاج محتوى بصري مذهل.",
    category: "Generative AI",
    categoryAr: "الذكاء الاصطناعي التوليدي",
    subcategory: "Video & Image Generation",
    subcategoryAr: "توليد الفيديو والصور",
    rating: 4.5,
    popularity: 70,
    difficulty: "متوسط إلى متقدم",
    pricing: "مدفوع",
    pricingDetails: "$12-76/شهر",
    features: [
      "توليد الفيديو من النص",
      "تحرير الفيديو بالذكاء الاصطناعي",
      "إزالة الخلفيات تلقائياً",
      "تحويل الصور إلى فيديو",
      "أدوات الرسوم المتحركة",
      "تأثيرات بصرية متقدمة",
      "تكامل مع أدوات الإنتاج"
    ],
    useCases: [
      "إنتاج الفيديوهات التسويقية",
      "الرسوم المتحركة والموشن جرافيك",
      "المحتوى التفاعلي والتجارب الرقمية",
      "النماذج الأولية للمشاريع",
      "المحتوى التعليمي والتوضيحي",
      "الفنون الرقمية والتجريبية"
    ],
    pros: [
      "رائد في توليد الفيديو",
      "أدوات متنوعة ومتقدمة",
      "جودة عالية في النتائج",
      "واجهة احترافية ومتطورة",
      "تحديثات مستمرة وميزات جديدة"
    ],
    cons: [
      "تكلفة عالية نسبياً",
      "يتطلب اتصال إنترنت قوي",
      "منحنى تعلم متوسط",
      "استهلاك عالي للموارد"
    ],
    link: "https://runwayml.com/",
    logo: "/src/assets/runway-logo.png",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "مقدمة في Runway ML", url: "https://docs.runwayml.com/", duration: "30 دقيقة" },
      { title: "توليد الفيديو من النص", url: "https://help.runwayml.com/hc/en-us/articles/360058767174", duration: "25 دقيقة" }
    ],
    integrations: ["Adobe Creative Suite", "Final Cut Pro", "DaVinci Resolve", "API"],
    lastUpdated: "2025-01-05",
    tags: ["AI", "Video", "Animation", "Creative", "Professional"]
  },
  {
    id: "adobe-firefly",
    name: "Adobe Firefly",
    nameAr: "أدوبي فايرفلاي",
    description: "مجموعة أدوات الذكاء الاصطناعي من Adobe، مدمجة في Creative Cloud. تركز على التوليد الآمن والقانوني للمحتوى مع تكامل سلس مع أدوات Adobe التقليدية.",
    category: "Generative AI",
    categoryAr: "الذكاء الاصطناعي التوليدي",
    subcategory: "Image & Text Generation",
    subcategoryAr: "توليد الصور والنصوص",
    rating: 4.4,
    popularity: 85,
    difficulty: "سهل إلى متوسط",
    pricing: "مدفوع",
    pricingDetails: "مدمج مع Creative Cloud $20.99+/شهر",
    features: [
      "توليد آمن وقانوني للمحتوى",
      "تكامل مع Adobe Creative Suite",
      "تحرير الصور بالذكاء الاصطناعي",
      "توليد النصوص والخطوط",
      "إزالة وإضافة العناصر",
      "تغيير الألوان والأنماط",
      "مكتبة ضخمة من الأصول"
    ],
    useCases: [
      "التصميم الجرافيكي المتقدم",
      "تحرير الصور الاحترافي",
      "إنتاج المحتوى التسويقي",
      "تصميم المطبوعات والإعلانات",
      "المحتوى الرقمي والويب",
      "العروض التقديمية المتطورة"
    ],
    pros: [
      "تكامل ممتاز مع أدوات Adobe",
      "محتوى آمن وقانونياً",
      "جودة احترافية عالية",
      "سهولة الاستخدام",
      "دعم فني ممتاز",
      "تحديثات منتظمة"
    ],
    cons: [
      "يتطلب اشتراك Creative Cloud",
      "تكلفة عالية",
      "أقل مرونة من البدائل",
      "يحتاج تعلم أدوات Adobe"
    ],
    link: "https://www.adobe.com/products/firefly.html",
    logo: "/src/assets/adobe-firefly-logo.png",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "البدء مع Adobe Firefly", url: "https://helpx.adobe.com/firefly/get-started.html", duration: "20 دقيقة" },
      { title: "التكامل مع Photoshop", url: "https://helpx.adobe.com/photoshop/using/generative-ai.html", duration: "30 دقيقة" }
    ],
    integrations: ["Photoshop", "Illustrator", "InDesign", "Express", "Creative Cloud"],
    lastUpdated: "2025-01-03",
    tags: ["Adobe", "Professional", "Safe", "Integrated", "Creative"]
  },
  {
    id: "canva-ai",
    name: "Canva AI",
    nameAr: "كانفا الذكي",
    description: "أدوات الذكاء الاصطناعي المدمجة في منصة Canva، تجعل التصميم أسهل وأسرع للجميع. تركز على البساطة والسرعة مع نتائج احترافية.",
    category: "Design Tools",
    categoryAr: "أدوات التصميم",
    subcategory: "AI-Powered Design",
    subcategoryAr: "التصميم بالذكاء الاصطناعي",
    rating: 4.3,
    popularity: 90,
    difficulty: "سهل",
    pricing: "مجاني/مدفوع",
    pricingDetails: "مجاني مع حدود، $12.99/شهر للمحترفين",
    features: [
      "توليد الصور والرسوم التوضيحية",
      "كتابة المحتوى بالذكاء الاصطناعي",
      "تصميم العروض التقديمية تلقائياً",
      "إزالة الخلفيات بنقرة واحدة",
      "تحسين الصور تلقائياً",
      "قوالب ذكية ومتكيفة",
      "ترجمة التصاميم"
    ],
    useCases: [
      "وسائل التواصل الاجتماعي",
      "العروض التقديمية السريعة",
      "المحتوى التسويقي البسيط",
      "التصاميم التعليمية",
      "المطبوعات الأساسية",
      "المحتوى الشخصي والهوايات"
    ],
    pros: [
      "سهولة استخدام فائقة",
      "سرعة في الإنتاج",
      "قوالب جاهزة ومتنوعة",
      "تكامل مع منصات التواصل",
      "خطة مجانية سخية",
      "مناسب للمبتدئين"
    ],
    cons: [
      "خيارات تخصيص محدودة",
      "جودة أقل من الأدوات المتخصصة",
      "قيود في الخطة المجانية",
      "أقل مرونة للمحترفين"
    ],
    link: "https://www.canva.com/ai-image-generator/",
    logo: "/src/assets/canva-logo.png",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "استخدام Canva AI", url: "https://www.canva.com/help/ai-features/", duration: "15 دقيقة" },
      { title: "توليد الصور في Canva", url: "https://www.canva.com/help/text-to-image/", duration: "10 دقيقة" }
    ],
    integrations: ["Social Media Platforms", "Google Drive", "Dropbox", "Slack"],
    lastUpdated: "2025-01-01",
    tags: ["Easy", "Fast", "Templates", "Social Media", "Beginner-Friendly"]
  },
  {
    id: "figma-ai",
    name: "Figma AI",
    nameAr: "فيجما الذكي",
    description: "أدوات الذكاء الاصطناعي المدمجة في Figma لتسريع عملية التصميم وتحسين تجربة المستخدم. تركز على التصميم التعاوني والنماذج الأولية الذكية.",
    category: "Design Tools",
    categoryAr: "أدوات التصميم",
    subcategory: "UI/UX Design",
    subcategoryAr: "تصميم واجهات المستخدم",
    rating: 4.2,
    popularity: 80,
    difficulty: "متوسط",
    pricing: "مجاني/مدفوع",
    pricingDetails: "مجاني للاستخدام الشخصي، $12-45/شهر للفرق",
    features: [
      "توليد النماذج الأولية تلقائياً",
      "اقتراحات التصميم الذكية",
      "تحسين تجربة المستخدم",
      "توليد المحتوى النصي",
      "تحليل إمكانية الوصول",
      "التصميم التعاوني المحسن",
      "أتمتة المهام المتكررة"
    ],
    useCases: [
      "تصميم واجهات المستخدم",
      "النماذج الأولية التفاعلية",
      "تصميم تجربة المستخدم",
      "التصميم التعاوني للفرق",
      "تطوير أنظمة التصميم",
      "اختبار قابلية الاستخدام"
    ],
    pros: [
      "تكامل سلس مع Figma",
      "تحسين الإنتاجية",
      "تعاون فريق محسن",
      "أدوات تحليل متقدمة",
      "مجتمع نشط ومفيد"
    ],
    cons: [
      "لا يزال في مراحل التطوير",
      "يتطلب معرفة بـ Figma",
      "ميزات محدودة حالياً",
      "يحتاج اتصال إنترنت دائم"
    ],
    link: "https://www.figma.com/ai/",
    logo: "/src/assets/figma-logo.png",
    screenshots: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    tutorials: [
      { title: "مقدمة في Figma AI", url: "https://help.figma.com/hc/en-us/articles/360040450213", duration: "25 دقيقة" },
      { title: "استخدام الأدوات الذكية", url: "https://help.figma.com/hc/en-us/sections/360006059373", duration: "20 دقيقة" }
    ],
    integrations: ["Figma", "FigJam", "Slack", "Notion", "Jira"],
    lastUpdated: "2024-12-28",
    tags: ["UI/UX", "Collaborative", "Prototyping", "Design Systems", "Teams"]
  }
];

// Enhanced Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary rounded-full animate-spin animation-delay-150"></div>
    </div>
  </div>
);

// Enhanced Navigation Component
const Navigation = ({ currentPage, setCurrentPage, theme, toggleTheme, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Compass, gradient: 'from-blue-500 to-purple-600' },
    { id: 'studio', label: 'استوديو الذكاء الاصطناعي', icon: Sparkles, gradient: 'from-purple-500 to-pink-600' },
    { id: 'projects', label: 'إدارة المشاريع', icon: Layers, gradient: 'from-green-500 to-blue-600' },
    { id: 'learning', label: 'مركز التعلم', icon: BookOpen, gradient: 'from-orange-500 to-red-600' },
    { id: 'community', label: 'المجتمع', icon: Users, gradient: 'from-pink-500 to-rose-600' }
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-50 glass-effect border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 space-x-reverse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                المصمم الذكي
              </h1>
              <p className="text-xs text-muted-foreground">منصة الذكاء الاصطناعي للتصميم</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 space-x-reverse">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPage === item.id && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-lg`}
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative flex items-center space-x-2 space-x-reverse">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-9 h-9 rounded-full"
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden w-9 h-9 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border/50 py-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// Enhanced Home Component
const Home = ({ onToolClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    { value: 'all', label: 'جميع الفئات', count: aiToolsData.length },
    { value: 'Generative AI', label: 'الذكاء الاصطناعي التوليدي', count: 15 },
    { value: '3D & Spatial', label: 'التصميم ثلاثي الأبعاد', count: 8 },
    { value: 'Color & Lighting', label: 'الألوان والإضاءة', count: 6 },
    { value: 'Project Management', label: 'إدارة المشاريع', count: 4 }
  ];

  const filteredTools = aiToolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.nameAr.includes(searchTerm) ||
                         tool.description.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tool.difficulty === selectedDifficulty;
    const matchesPricing = selectedPricing === 'all' || tool.pricing === selectedPricing;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesPricing;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return b.popularity - a.popularity;
      case 'name':
        return a.nameAr.localeCompare(b.nameAr);
      default:
        return 0;
    }
  });

  const toggleFavorite = (toolId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(toolId)) {
      newFavorites.delete(toolId);
    } else {
      newFavorites.add(toolId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              className="inline-flex items-center space-x-2 space-x-reverse bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Rocket className="w-4 h-4" />
              <span>المنصة الأكثر تطوراً في العالم</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">المصمم</span>
              <span className="text-foreground"> الذكي</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              اكتشف، قارن، واستخدم أقوى أدوات الذكاء الاصطناعي في التصميم الداخلي
              <br />
              <span className="text-primary font-semibold">لتحويل مساحاتك إلى تحف فنية</span>
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button size="lg" className="gradient-primary text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-5 h-5 ml-2" />
                ابدأ الاستكشاف
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-accent/50 transition-all duration-300">
                <Eye className="w-5 h-5 ml-2" />
                شاهد العرض التوضيحي
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '150+', label: 'أداة ذكية', icon: Zap },
              { number: '50K+', label: 'مصمم نشط', icon: Users },
              { number: '1M+', label: 'مشروع منجز', icon: Award },
              { number: '99%', label: 'رضا العملاء', icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              اكتشف أدوات الذكاء الاصطناعي
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              مجموعة شاملة من أقوى الأدوات المتخصصة في التصميم الداخلي، مع تقييمات مفصلة ومقارنات شاملة
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="ابحث عن أداة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Difficulty Filter */}
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="مستوى الصعوبة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستويات</SelectItem>
                    <SelectItem value="سهل">سهل</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="متقدم">متقدم</SelectItem>
                  </SelectContent>
                </Select>

                {/* Pricing Filter */}
                <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                  <SelectTrigger>
                    <SelectValue placeholder="التسعير" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأسعار</SelectItem>
                    <SelectItem value="مجاني">مجاني</SelectItem>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">الشعبية</SelectItem>
                    <SelectItem value="rating">التقييم</SelectItem>
                    <SelectItem value="name">الاسم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-card to-card/50">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <img
                        src={tool.logo}
                        alt={tool.nameAr}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2 space-x-reverse">
                      <Badge variant={tool.pricing === 'مجاني' ? 'secondary' : 'default'}>
                        {tool.pricing}
                      </Badge>
                      <Badge variant="outline" className="bg-background/80">
                        {tool.difficulty}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 left-4 w-8 h-8 rounded-full bg-background/80 hover:bg-background"
                      onClick={() => toggleFavorite(tool.id)}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(tool.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {tool.nameAr}
                        </CardTitle>
                        <div className="flex items-center space-x-2 space-x-reverse mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(tool.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{tool.rating}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center text-sm text-muted-foreground">
                            <TrendingUp className="w-3 h-3 ml-1" />
                            {tool.popularity}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed line-clamp-3">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">الميزات الرئيسية:</h4>
                        <div className="flex flex-wrap gap-1">
                          {tool.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {tool.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tool.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button 
                            size="sm" 
                            className="gradient-primary text-white"
                            onClick={() => onToolClick && onToolClick(tool)}
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            استكشف
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: tool.nameAr,
                                  text: tool.description,
                                  url: tool.link
                                });
                              } else {
                                navigator.clipboard.writeText(tool.link);
                              }
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tool.pricingDetails}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          {filteredTools.length > 9 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg" className="px-8">
                عرض المزيد من الأدوات
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

// Tool Details Component
const ToolDetails = ({ tool, onClose }) => {
  if (!tool) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة</span>
          </Button>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              onClick={() => window.open(tool.link, '_blank')}
              className="gradient-primary text-white"
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              زيارة الموقع
            </Button>
          </div>
        </div>

        {/* Tool Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="p-8">
              <div className="flex items-start space-x-6 space-x-reverse">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={tool.logo}
                    alt={tool.nameAr}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{tool.nameAr}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{tool.name}</p>
                  <div className="flex items-center space-x-4 space-x-reverse mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(tool.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                      <span className="mr-2 font-semibold">{tool.rating}</span>
                    </div>
                    <Badge variant={tool.pricing === 'مجاني' ? 'secondary' : 'default'}>
                      {tool.pricing}
                    </Badge>
                    <Badge variant="outline">{tool.difficulty}</Badge>
                  </div>
                  <p className="text-lg leading-relaxed">{tool.description}</p>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">الميزات الرئيسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Use Cases */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">حالات الاستخدام</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start space-x-3 space-x-reverse">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{useCase}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-green-600">المزايا</h3>
                <div className="space-y-3">
                  {tool.pros.map((pro, index) => (
                    <div key={index} className="flex items-start space-x-3 space-x-reverse">
                      <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{pro}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-red-600">العيوب</h3>
                <div className="space-y-3">
                  {tool.cons.map((con, index) => (
                    <div key={index} className="flex items-start space-x-3 space-x-reverse">
                      <Minus className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{con}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Tutorials */}
            {tool.tutorials && tool.tutorials.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">الدروس التعليمية</h2>
                <div className="space-y-4">
                  {tool.tutorials.map((tutorial, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <PlayCircle className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">{tutorial.title}</h4>
                          <p className="text-sm text-muted-foreground">{tutorial.duration}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(tutorial.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">معلومات سريعة</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الفئة</label>
                  <p className="font-semibold">{tool.categoryAr}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">التخصص</label>
                  <p className="font-semibold">{tool.subcategoryAr}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">مستوى الصعوبة</label>
                  <p className="font-semibold">{tool.difficulty}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">التسعير</label>
                  <p className="font-semibold">{tool.pricingDetails}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">آخر تحديث</label>
                  <p className="font-semibold">{tool.lastUpdated}</p>
                </div>
              </div>
            </Card>

            {/* Integrations */}
            {tool.integrations && tool.integrations.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">التكاملات</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((integration, index) => (
                    <Badge key={index} variant="secondary">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">العلامات</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  className="w-full gradient-primary text-white"
                  onClick={() => window.open(tool.link, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 ml-2" />
                  زيارة الموقع الرسمي
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tool.nameAr,
                        text: tool.description,
                        url: tool.link
                      });
                    } else {
                      navigator.clipboard.writeText(tool.link);
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 ml-2" />
                  مشاركة الأداة
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};


// Login Component
const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth login
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUser = {
        id: '1',
        name: 'مستخدم تجريبي',
        email: 'user@example.com',
        avatar: '/api/placeholder/40/40',
        provider: 'google'
      };
      onLogin(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate email login
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockUser = {
        id: '2',
        name: 'مستخدم البريد الإلكتروني',
        email: email,
        avatar: '/api/placeholder/40/40',
        provider: 'email'
      };
      onLogin(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card className="p-8 shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">
              مرحباً بك في <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">المصمم الذكي</span>
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول إلى حسابك'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  المتابعة مع Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">أو</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 gradient-primary text-white font-semibold"
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'
                )}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
              </button>
            </div>
          </div>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>بالمتابعة، أنت توافق على <a href="#" className="text-primary hover:underline">شروط الخدمة</a> و <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a></p>
        </div>
      </motion.div>
    </div>
  );
};


// Main App Component with Authentication
function AppWithAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <App user={user} onLogout={handleLogout} />;
}

export default AppWithAuth;



