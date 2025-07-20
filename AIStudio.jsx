import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Camera, 
  Palette, 
  Brain, 
  Download, 
  Share2, 
  Settings, 
  Zap,
  Upload,
  RefreshCw,
  Eye,
  Layers,
  Sliders,
  Image as ImageIcon,
  FileText,
  Lightbulb,
  Target,
  Brush,
  Scissors,
  Move3D,
  Maximize,
  Play,
  Pause,
  RotateCcw,
  Save,
  Copy,
  ExternalLink
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const AIStudio = () => {
  const [activeTab, setActiveTab] = useState('concept');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Concept Generator State
  const [conceptInput, setConceptInput] = useState('');
  const [conceptStyle, setConceptStyle] = useState('modern');
  const [conceptRoom, setConceptRoom] = useState('living-room');
  
  // Image Generator State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('photorealistic');
  const [imageAspectRatio, setImageAspectRatio] = useState('16:9');
  const [imageQuality, setImageQuality] = useState(80);
  
  // Prompt Assistant State
  const [promptIdea, setPromptIdea] = useState('');
  const [promptTool, setPromptTool] = useState('midjourney');
  const [promptComplexity, setPromptComplexity] = useState('detailed');
  
  // Color Palette State
  const [paletteBase, setPaletteBase] = useState('#4f46e5');
  const [paletteStyle, setPaletteStyle] = useState('harmonious');
  const [paletteCount, setPaletteCount] = useState(5);

  const fileInputRef = useRef(null);

  const styles = [
    { value: 'modern', label: 'عصري', description: 'خطوط نظيفة وألوان محايدة' },
    { value: 'classic', label: 'كلاسيكي', description: 'أناقة تقليدية وتفاصيل راقية' },
    { value: 'minimalist', label: 'بساطة', description: 'أقل هو أكثر، تركيز على الوظيفة' },
    { value: 'bohemian', label: 'بوهيمي', description: 'ألوان دافئة وأنسجة متنوعة' },
    { value: 'industrial', label: 'صناعي', description: 'مواد خام وتصميم عملي' },
    { value: 'scandinavian', label: 'إسكندنافي', description: 'بساطة دافئة وألوان فاتحة' }
  ];

  const rooms = [
    { value: 'living-room', label: 'غرفة المعيشة', icon: '🛋️' },
    { value: 'bedroom', label: 'غرفة النوم', icon: '🛏️' },
    { value: 'kitchen', label: 'المطبخ', icon: '🍳' },
    { value: 'bathroom', label: 'الحمام', icon: '🛁' },
    { value: 'office', label: 'المكتب', icon: '💼' },
    { value: 'dining', label: 'غرفة الطعام', icon: '🍽️' }
  ];

  const imageStyles = [
    { value: 'photorealistic', label: 'واقعي', description: 'صور تبدو كالتصوير الفوتوغرافي' },
    { value: 'artistic', label: 'فني', description: 'لمسة فنية وإبداعية' },
    { value: 'architectural', label: 'معماري', description: 'تركيز على التفاصيل المعمارية' },
    { value: 'conceptual', label: 'مفاهيمي', description: 'أفكار تصميمية مبتكرة' },
    { value: 'luxury', label: 'فاخر', description: 'تصميمات راقية ومواد عالية الجودة' }
  ];

  const aiTools = [
    { value: 'midjourney', label: 'Midjourney', description: 'الأفضل للصور الفنية' },
    { value: 'dalle3', label: 'DALL-E 3', description: 'فهم ممتاز للنصوص' },
    { value: 'stable-diffusion', label: 'Stable Diffusion', description: 'تحكم كامل ومرونة' },
    { value: 'leonardo', label: 'Leonardo AI', description: 'متخصص في التصميم' }
  ];

  const simulateGeneration = useCallback(async (type, duration = 3000) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        concept: {
          title: 'مفهوم تصميم متطور',
          description: 'تصميم عصري يجمع بين الأناقة والوظيفة، مع استخدام ألوان محايدة وخطوط نظيفة لخلق مساحة مريحة ومتطورة.',
          elements: [
            'لوحة ألوان محايدة مع لمسات من الأزرق الداكن',
            'أثاث بخطوط نظيفة ومواد طبيعية',
            'إضاءة متدرجة لخلق أجواء مختلفة',
            'نباتات طبيعية لإضافة الحيوية',
            'مساحات تخزين مخفية للحفاظ على النظافة'
          ],
          mood: 'هادئ ومتطور',
          budget: 'متوسط إلى عالي'
        },
        image: {
          url: '/api/placeholder/800/600',
          prompt: imagePrompt,
          style: imageStyle,
          aspectRatio: imageAspectRatio
        },
        prompt: {
          optimized: `A stunning ${conceptStyle} ${conceptRoom} interior design, featuring ${promptIdea}, professional photography, high-end materials, perfect lighting, architectural digest style, ultra-detailed, 8K resolution`,
          breakdown: {
            style: `${conceptStyle} design aesthetic`,
            subject: `${conceptRoom} interior`,
            details: promptIdea,
            technical: 'professional photography, 8K resolution',
            mood: 'perfect lighting, architectural digest style'
          }
        },
        palette: {
          colors: [
            { hex: '#4f46e5', name: 'أزرق ملكي', usage: 'لون أساسي' },
            { hex: '#7c3aed', name: 'بنفسجي', usage: 'لون ثانوي' },
            { hex: '#f3f4f6', name: 'رمادي فاتح', usage: 'خلفية' },
            { hex: '#1f2937', name: 'رمادي داكن', usage: 'نصوص' },
            { hex: '#fbbf24', name: 'ذهبي', usage: 'لمسات' }
          ],
          harmony: 'متناغم',
          mood: 'احترافي وهادئ'
        }
      };
      
      setGeneratedContent(mockResults[type]);
      setHistory(prev => [...prev, { type, content: mockResults[type], timestamp: new Date() }]);
    }, duration);
  }, [conceptStyle, conceptRoom, imagePrompt, imageStyle, imageAspectRatio, promptIdea]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file);
    }
  };

  const ConceptGenerator = () => (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Lightbulb className="w-6 h-6 text-primary" />
            <span>مولد المفاهيم التصميمية</span>
          </CardTitle>
          <CardDescription>
            اوصف فكرتك وسنقوم بتطوير مفهوم تصميمي شامل ومفصل
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="concept-input">وصف المساحة أو الفكرة</Label>
                <Textarea
                  id="concept-input"
                  placeholder="مثال: غرفة معيشة عائلية مريحة مع مساحة للأطفال..."
                  value={conceptInput}
                  onChange={(e) => setConceptInput(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نوع الغرفة</Label>
                  <Select value={conceptRoom} onValueChange={setConceptRoom}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.value} value={room.value}>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span>{room.icon}</span>
                            <span>{room.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>النمط المطلوب</Label>
                  <Select value={conceptStyle} onValueChange={setConceptStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">النمط المختار: {styles.find(s => s.value === conceptStyle)?.label}</h4>
                <p className="text-sm text-muted-foreground">
                  {styles.find(s => s.value === conceptStyle)?.description}
                </p>
              </div>
              
              <Button
                onClick={() => simulateGeneration('concept')}
                disabled={!conceptInput.trim() || isGenerating}
                className="w-full gradient-primary text-white"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 ml-2" />
                    توليد المفهوم التصميمي
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جاري التوليد...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
          
          {generatedContent && activeTab === 'concept' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{generatedContent.title}</h3>
                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {generatedContent.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">العناصر الأساسية:</h4>
                  <ul className="space-y-2">
                    {generatedContent.elements.map((element, index) => (
                      <li key={index} className="flex items-start space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <Palette className="w-4 h-4 text-primary" />
                      <span className="font-medium">المزاج العام</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{generatedContent.mood}</p>
                  </div>
                  
                  <div className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">الميزانية المقترحة</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{generatedContent.budget}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const ImageGenerator = () => (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-secondary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Camera className="w-6 h-6 text-secondary" />
            <span>مولد الصور بالذكاء الاصطناعي</span>
          </CardTitle>
          <CardDescription>
            أنشئ صوراً واقعية لتصاميمك الداخلية باستخدام أحدث تقنيات الذكاء الاصطناعي
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Label htmlFor="image-prompt">وصف الصورة المطلوبة</Label>
                <Textarea
                  id="image-prompt"
                  placeholder="مثال: غرفة معيشة عصرية مع أريكة رمادية وطاولة قهوة خشبية..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نمط الصورة</Label>
                  <Select value={imageStyle} onValueChange={setImageStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {imageStyles.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          <div>
                            <div className="font-medium">{style.label}</div>
                            <div className="text-xs text-muted-foreground">{style.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>نسبة العرض إلى الارتفاع</Label>
                  <Select value={imageAspectRatio} onValueChange={setImageAspectRatio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (عريض)</SelectItem>
                      <SelectItem value="4:3">4:3 (قياسي)</SelectItem>
                      <SelectItem value="1:1">1:1 (مربع)</SelectItem>
                      <SelectItem value="3:4">3:4 (عمودي)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>جودة الصورة: {imageQuality}%</Label>
                <Slider
                  value={[imageQuality]}
                  onValueChange={(value) => setImageQuality(value[0])}
                  max={100}
                  min={50}
                  step={10}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">إعدادات متقدمة</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الإضاءة الطبيعية</span>
                    <Button variant="outline" size="sm">تفعيل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تحسين الألوان</span>
                    <Button variant="outline" size="sm">تفعيل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تفاصيل عالية</span>
                    <Button variant="outline" size="sm">تفعيل</Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">رفع صورة مرجعية</h4>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  اختر صورة
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <Button
                onClick={() => simulateGeneration('image', 5000)}
                disabled={!imagePrompt.trim() || isGenerating}
                className="w-full gradient-secondary text-white"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 ml-2" />
                    توليد الصورة
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جاري توليد الصورة...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
          
          {generatedContent && activeTab === 'image' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className="relative group">
                <img
                  src={generatedContent.url}
                  alt="Generated Interior Design"
                  className="w-full rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">تفاصيل الصورة</h4>
                  <Badge variant="secondary">{generatedContent.style}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>الوصف:</strong> {generatedContent.prompt}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>النسبة:</strong> {generatedContent.aspectRatio}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>استوديو الذكاء الاصطناعي</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            استوديو الإبداع الذكي
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            مجموعة شاملة من أدوات الذكاء الاصطناعي المتطورة لتحويل أفكارك إلى تصاميم استثنائية
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="concept" className="flex flex-col items-center space-y-2 py-4">
                <Lightbulb className="w-5 h-5" />
                <span className="text-sm font-medium">مولد المفاهيم</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex flex-col items-center space-y-2 py-4">
                <Camera className="w-5 h-5" />
                <span className="text-sm font-medium">مولد الصور</span>
              </TabsTrigger>
              <TabsTrigger value="prompt" className="flex flex-col items-center space-y-2 py-4">
                <Wand2 className="w-5 h-5" />
                <span className="text-sm font-medium">مساعد الأوامر</span>
              </TabsTrigger>
              <TabsTrigger value="palette" className="flex flex-col items-center space-y-2 py-4">
                <Palette className="w-5 h-5" />
                <span className="text-sm font-medium">لوحة الألوان</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="concept" className="space-y-6">
              <ConceptGenerator />
            </TabsContent>

            <TabsContent value="image" className="space-y-6">
              <ImageGenerator />
            </TabsContent>

            <TabsContent value="prompt" className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-accent/5 to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Wand2 className="w-6 h-6 text-accent" />
                    <span>مساعد صياغة الأوامر</span>
                  </CardTitle>
                  <CardDescription>
                    احصل على أوامر محسنة ومفصلة لأدوات الذكاء الاصطناعي المختلفة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>مساعد صياغة الأوامر قيد التطوير...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="palette" className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Palette className="w-6 h-6 text-primary" />
                    <span>مولد لوحات الألوان</span>
                  </CardTitle>
                  <CardDescription>
                    أنشئ لوحات ألوان متناغمة ومتطورة لمشاريعك التصميمية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>مولد لوحات الألوان قيد التطوير...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* History Sidebar */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 w-80 max-h-96 hidden xl:block"
          >
            <Card className="glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">السجل</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {history.slice(-5).reverse().map((item, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type === 'concept' ? 'مفهوم' : 
                             item.type === 'image' ? 'صورة' : 
                             item.type === 'prompt' ? 'أمر' : 'لوحة ألوان'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.timestamp.toLocaleTimeString('ar-SA')}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">
                          {item.type === 'concept' ? item.content.title :
                           item.type === 'image' ? item.content.prompt :
                           'محتوى مولد'}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIStudio;

