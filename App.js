import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Global variables provided by the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Fallback for local development if firebaseConfig is not provided
  if (!app) {
    console.warn("Firebase config not found. Running in development mode without full Firebase features.");
  }
}

// Auth Context for managing user state
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserId(user.uid);
      } else {
        // Sign in anonymously if no initial auth token or if signed out
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Firebase anonymous sign-in failed:", error);
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userId, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Modal Component for alerts/confirmations
const Modal = ({ isOpen, onClose, title, message, onConfirm, showConfirmButton = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-right">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-right">{message}</p>
        <div className="flex justify-end space-x-2">
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-right"
            >
              تأكيد
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-right"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};


// Hardcoded tool data (will be replaced/augmented by Firestore)
const initialTools = [
  {
    id: "midjourney",
    name: "Midjourney",
    description: "توليد تصاميم داخلية فنية أو واقعية من أوصاف نصية.",
    category: "Generalist Generative AI",
    link: "https://www.midjourney.com/",
    useCases: ["ideation", "rendering", "artistic-creation"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Midjourney_Icon.png"
  },
  {
    id: "dalle3",
    name: "DALL·E 3",
    description: "إنشاء مشاهد بصرية عالية الجودة من وصف دقيق.",
    category: "Generalist Generative AI",
    link: "https://www.esafety.gov.au/key-topics/esafety-guide/dalle-3",
    useCases: ["image-generation", "visualization"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/DALL-E_3_logo.png"
  },
  {
    id: "stablediffusion",
    name: "Stable Diffusion (AUTOMATIC1111/SDXL)",
    description: "تحكم تفصيلي في إخراج الصور التصميمية بأساليب متنوعة.",
    category: "Generalist Generative AI",
    link: "https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki",
    useCases: ["image-generation", "customization", "rendering"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Stable_Diffusion_Logo.png/512px-Stable_Diffusion_Logo.png"
  },
  {
    id: "runwayml",
    name: "Runway ML",
    description: "توليد فيديوهات ترويجية لمقترحات ديكورية.",
    category: "Generalist Generative AI",
    link: "https://runwayml.com/",
    useCases: ["video-generation", "marketing"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Runway_Logo.png/1280px-Runway_Logo.png"
  },
  {
    id: "adobefirefly",
    name: "Adobe Firefly",
    description: "تحرير وإنشاء صور داخلية باستخدام الذكاء الاصطناعي.",
    category: "Generalist Generative AI",
    link: "https://www.adobe.com/learn/firefly/web/introduction-to-firefly",
    useCases: ["image-editing", "image-generation"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Adobe_Firefly_Logo.svg/512px-Adobe_Firefly_Logo.svg.png"
  },
  {
    id: "claude3multimodal",
    name: "Claude 3 Multimodal",
    description: "فهم وتحليل صور داخلية وإنشاء ردود نصية مخصصة.",
    category: "Generalist Generative AI",
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude",
    useCases: ["image-analysis", "text-generation"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Claude_AI_logo.svg/512px-Claude_AI_logo.svg.png"
  },
  {
    id: "spacelyai",
    name: "Spacely AI",
    description: "اقتراحات تصميم داخلية ذكية بناءً على تحليل المساحة.",
    category: "Interior-Specific AI",
    link: "https://www.spacely.ai/",
    useCases: ["layout", "ideation", "space-analysis"],
    logo: "https://assets-global.website-files.com/64b5f49d32906b3a3c20040f/64b5f49d32906b3a3c200427_Spacely.ai%20Logo.png"
  },
  {
    id: "decorilla",
    name: "Decorilla",
    description: "خدمة تصميم متكاملة بمساعدة الذكاء الاصطناعي والمصممين البشر.",
    category: "Interior-Specific AI",
    link: "https://www.youtube.com/watch?v=Fdal15TpSIk",
    useCases: ["full-service-design", "collaboration"],
    logo: "https://cdn.decorilla.com/online-interior-design/images/decorilla-logo.png"
  },
  {
    id: "airoomplanner",
    name: "AI Room Planner",
    description: "أداة مجانية لتصميم الغرف ثلاثية الأبعاد.",
    category: "Interior-Specific AI",
    link: "https://roomaiplanner.com/",
    useCases: ["3d-design", "room-planning"],
    logo: "https://roomaiplanner.com/img/logo.png"
  },
  {
    id: "planner5dai",
    name: "Planner 5D AI",
    description: "إنشاء مخططات تصميم واقعية قابلة للتخصيص.",
    category: "Interior-Specific AI",
    link: "https://planner5d.com/",
    useCases: ["floor-planning", "3d-design"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Planner_5D_logo.png/600px-Planner_5D_logo.png"
  },
  {
    id: "homevisualizerai",
    name: "HomeVisualizer.AI",
    description: "تحويل النص أو الصور إلى مشاهد تصميم داخلي.",
    category: "Interior-Specific AI",
    link: "https://www.homevisualizer.ai/",
    useCases: ["visualization", "image-to-design"],
    logo: "https://www.homevisualizer.ai/images/logo.png"
  },
  {
    id: "visualizeai",
    name: "VisualizeAI",
    description: "تحسين وعرض الغرف بمقترحات أثاث مرئية.",
    category: "Interior-Specific AI",
    link: "https://visualizeai.pro/",
    useCases: ["visualization", "furniture-placement"],
    logo: "https://visualizeai.pro/logo.png"
  },
  {
    id: "myroomdesignerai",
    name: "MyRoomDesigner.AI",
    description: "تصميم ديكور داخلي وتقدير ميزانيات فورية.",
    category: "Interior-Specific AI",
    link: "https://myroomdesigner.ai/",
    useCases: ["interior-design", "budgeting"],
    logo: "https://myroomdesigner.ai/logo.png"
  },
  {
    id: "zmoaiinteriordesigner",
    name: "ZMO.AI Interior Designer",
    description: "توليد اقتراحات ديكور بأساليب متعددة.",
    category: "Interior-Specific AI",
    link: "https://www.zmo.ai/interior-ai/",
    useCases: ["decor-suggestions", "style-generation"],
    logo: "https://www.zmo.ai/img/logo-white.svg"
  },
  {
    id: "roomgptai",
    name: "RoomGPT.ai",
    description: "اقتراح أنماط مختلفة للفراغات الحالية من خلال الصور.",
    category: "Interior-Specific AI",
    link: "https://roomgpt.io/",
    useCases: ["style-suggestion", "image-analysis"],
    logo: "https://roomgpt.io/logo.png"
  },
  {
    id: "paintitai",
    name: "Paintit.ai",
    description: "تغيير الألوان والأنماط وإضافة روابط شراء المنتجات.",
    category: "Interior-Specific AI",
    link: "https://paintit.ai/",
    useCases: ["color-change", "pattern-design", "product-linking"],
    logo: "https://paintit.ai/logo.png"
  },
  {
    id: "ontonaiimagine",
    name: "Onton AI (Imagine)",
    description: "تحليل الذوق وتقديم تصميمات متناسقة.",
    category: "Interior-Specific AI",
    link: "https://docs.onton.com/onton-imagine-2",
    useCases: ["taste-analysis", "consistent-design"],
    logo: "https://docs.onton.com/img/logo.png"
  },
  {
    id: "aihouse",
    name: "AIHouse",
    description: "نظام تصميم داخلي شامل يدعم VR والذكاء الاصطناعي.",
    category: "Interior-Specific AI",
    link: "https://www.aihousedavos.com/",
    useCases: ["vr-design", "comprehensive-design"],
    logo: "https://www.aihousedavos.com/images/logo.png"
  },
  {
    id: "autodeskforma",
    name: "Autodesk Forma",
    description: "تحليل الموقع والتصميم الحضري باستخدام الذكاء الاصطناعي.",
    category: "3D & Spatial AI",
    link: "https://www.autodesk.com/company/autodesk-platform/aec",
    useCases: ["urban-planning", "site-analysis", "3d-modeling"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Autodesk_%28logo%29.png/180px-Autodesk_%28logo%29.png"
  },
  {
    id: "morpholioboardai",
    name: "Morpholio Board AI",
    description: "توليد لوحات إلهام تلقائية من أنماط وصور.",
    category: "3D & Spatial AI",
    link: "https://www.morpholioapps.com/board/",
    useCases: ["mood-board", "inspiration"],
    logo: "https://www.morpholioapps.com/board/img/logo.png"
  },
  {
    id: "interioraipro",
    name: "InteriorAI Pro",
    description: "إعادة تصميم الفراغات بناءً على صور فعلية.",
    category: "3D & Spatial AI",
    link: "https://interiorai.pro/",
    useCases: ["space-redesign", "image-based-design"],
    logo: "https://interiorai.pro/logo.png"
  },
  {
    id: "kaedimai",
    name: "Kaedim AI",
    description: "تحويل الرسومات والصور إلى نماذج ثلاثية الأبعاد.",
    category: "3D & Spatial AI",
    link: "https://www.kaedim3d.com/",
    useCases: ["2d-to-3d", "3d-modeling"],
    logo: "https://www.kaedim3d.com/logo.png"
  },
  {
    id: "enscapeai",
    name: "Enscape AI",
    description: "تصيير فوري لمشاهد التصميم الداخلي بتقنية Realtime Rendering.",
    category: "3D & Spatial AI",
    link: "https://www.youtube.com/watch?v=HHG8xHU3Cd4",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Enscape_Logo.png/750px-Enscape_Logo.png"
  },
  {
    id: "shapr3dai",
    name: "Shapr3D AI",
    description: "برنامج CAD ثلاثي الأبعاد مدعوم بالذكاء الاصطناعي.",
    category: "3D & Spatial AI",
    link: "https://shapr3d.net/",
    useCases: ["cad-design", "3d-modeling"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Shapr3d-blue-logo.png/1226px-Shapr3d-blue-logo.png"
  },
  {
    id: "sketchupaiextensions",
    name: "SketchUp AI Extensions",
    description: "إضافات ذكية تدعم سير العمل في برنامج SketchUp.",
    category: "3D & Spatial AI",
    link: "https://www.sketchup.com/en/ai-in-sketchup",
    useCases: ["sketchup-integration", "workflow-automation"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SketchUp-Logo.png/256px-SketchUp-Logo.png"
  },
  {
    id: "myarchitectai",
    name: "MyArchitectAI",
    description: "إنشاء رندرات فاخرة لتصميم داخلي خلال ثوانٍ.",
    category: "3D & Spatial AI",
    link: "https://www.myarchitectai.com/",
    useCases: ["rendering", "fast-rendering"],
    logo: "https://www.myarchitectai.com/logo.png"
  },
  {
    id: "sketchupdiffusion",
    name: "SketchUp Diffusion",
    description: "أداة تصميم مجانية مدعومة بالذكاء الاصطناعي داخل SketchUp.",
    category: "3D & Spatial AI",
    link: "https://extensions.sketchup.com/extension/7bfb6011-ee6b-4c16-9cce-9d35a3ad5b8c/sketch-up-diffusion",
    useCases: ["sketchup-integration", "design-generation"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SketchUp-Logo.png/256px-SketchUp-Logo.png"
  },
  {
    id: "foyrneo",
    name: "Foyr Neo",
    description: "نمذجة وتصميم داخلي قائم على مكتبات ذكية.",
    category: "3D & Spatial AI",
    link: "https://www.youtube.com/channel/UC4kt__4pC_N1HiB7Ye0zcUA",
    useCases: ["3d-modeling", "interior-design"],
    logo: "https://www.foyr.com/images/logo-dark.png"
  },
  {
    id: "pconplanner",
    name: "pCon.planner",
    description: "تصميم ثلاثي الأبعاد تفاعلي لتخطيط الفراغات والأثاث.",
    category: "3D & Spatial AI",
    link: "https://pcon-solutions.com/pcon-planner-web/",
    useCases: ["3d-planning", "furniture-layout"],
    logo: "https://pcon-solutions.com/img/logo.png"
  },
  {
    id: "magicplan",
    name: "Magicplan",
    description: "مسح الغرف وتحويلها لمخططات CAD.",
    category: "3D & Spatial AI",
    link: "https://www.magicplan.app/",
    useCases: ["room-scanning", "cad-conversion"],
    logo: "https://www.magicplan.app/img/logo.png"
  },
  {
    id: "sweethome3d",
    name: "Sweet Home 3D",
    description: "أداة مجانية لتصميم ثلاثي الأبعاد مع عرض فوري.",
    category: "3D & Spatial AI",
    link: "https://www.sweethome3d.com/",
    useCases: ["3d-design", "free-tool"],
    logo: "https://www.sweethome3d.com/images/SweetHome3DLogo.png"
  },
  {
    id: "luminarai_enhancer",
    name: "Luminar AI",
    description: "تعديل الصور النهائية وتحسين الإضاءة والمظهر الجمالي.",
    category: "Rendering Enhancers",
    link: "https://lumina247.com/",
    useCases: ["post-processing", "image-enhancement"],
    logo: "https://lumina247.com/wp-content/uploads/2023/07/Lumina-AI-Logo.png"
  },
  {
    id: "topazlabssuite_enhancer",
    name: "Topaz Labs Suite",
    description: "تحسين جودة الصور وإزالة التشويش والتشويش.",
    category: "Rendering Enhancers",
    link: "https://www.topazlabs.com/",
    useCases: ["image-enhancement", "noise-reduction"],
    logo: "https://lobehub.com/icons/topazlabs/topazlabs-combine.svg"
  },
  {
    id: "adobephotoshopgenerativefill",
    name: "Adobe Photoshop Generative Fill",
    description: "إنشاء مناطق جديدة داخل الصور باستخدام الذكاء الاصطناعي.",
    category: "Rendering Enhancers",
    link: "https://www.adobe.com/products/photoshop/generative-fill.html",
    useCases: ["image-editing", "generative-editing"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/512px-Adobe_Photoshop_CC_icon.svg.png"
  },
  {
    id: "blenderaiadd-ons",
    name: "Blender AI Add-ons",
    description: "أدوات تصيير بالذكاء الاصطناعي داخل Blender.",
    category: "Rendering Enhancers",
    link: "https://studio.blender.org/tools/addons/overview",
    useCases: ["blender-integration", "rendering"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/512px-Blender_logo_no_text.svg.png"
  },
  {
    id: "fotoraisuite",
    name: "Fotor AI Suite",
    description: "تعديل بصري شامل مع تحسينات تلقائية.",
    category: "Rendering Enhancers",
    link: "https://www.fotor.com/ai/",
    useCases: ["image-editing", "automatic-enhancement"],
    logo: "https://www.fotor.com/images/logo-white.svg"
  },
  {
    id: "kaedimai_enhancer",
    name: "Kaedim AI",
    description: "إخراج ثلاثي الأبعاد واقعي من صور مسطحة.",
    category: "Rendering Enhancers",
    link: "https://www.kaedim3d.com/",
    useCases: ["3d-rendering", "2d-to-3d"],
    logo: "https://www.kaedim3d.com/logo.png"
  },
  {
    id: "reluxai_lighting",
    name: "Relux AI",
    description: "تحليل إضاءة داخلية وخارجية بدقة علمية.",
    category: "Lighting & Color AI",
    link: "https://relux.com/",
    useCases: ["lighting-analysis", "simulation"],
    logo: "https://relux.com/assets/img/logo.svg"
  },
  {
    id: "lightstanza",
    name: "LightStanza",
    description: "محاكاة الأداء الضوئي للمباني.",
    category: "Lighting & Color AI",
    link: "https://lightstanza.com/",
    useCases: ["daylighting-analysis", "building-performance"],
    logo: "https://lightstanza.com/images/logo.png"
  },
  {
    id: "dialuxevoaiplugins",
    name: "Dialux evo + AI Plugins",
    description: "تصاميم ضوئية احترافية.",
    category: "Lighting & Color AI",
    link: "https://www.dial.de/en-GB/dialux",
    useCases: ["lighting-design", "professional-lighting"],
    logo: "https://www.dial.de/assets/img/logo.svg"
  },
  {
    id: "colormind_lighting",
    name: "ColorMind",
    description: "توليد لوحات ألوان متناسقة باستخدام تعلم الآلة.",
    category: "Lighting & Color AI",
    link: "http://colormind.io/",
    useCases: ["color-palette", "ideation"],
    logo: "https://brandfetch.io/assets/colormind.io/logo.png"
  },
  {
    id: "khroma",
    name: "Khroma",
    description: "اكتشاف ألوان بناءً على الذوق الشخصي.",
    category: "Lighting & Color AI",
    link: "https://www.khroma.co/",
    useCases: ["color-discovery", "personalization"],
    logo: "https://www.khroma.co/img/logo.png"
  },
  {
    id: "palettefm",
    name: "Palette.fm",
    description: "تلوين تلقائي للصور الداخلية.",
    category: "Lighting & Color AI",
    link: "https://palette.fm/",
    useCases: ["image-colorization", "automatic-coloring"],
    logo: "https://palette.fm/logo.png"
  },
  {
    id: "chatgpt4o_writing",
    name: "ChatGPT-4o",
    description: "كتابة وصف المشاريع، الجداول، والوثائق الفنية.",
    category: "Writing & Presentation AI",
    link: "https://chatgpt4online.org/",
    useCases: ["content-creation", "documentation", "brainstorming"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png"
  },
  {
    id: "claude3claude2",
    name: "Claude 3 / Claude 2",
    description: "توليد نصوص احترافية ومعالجة بيانات التصميم.",
    category: "Writing & Presentation AI",
    link: "https://claude.ai/",
    useCases: ["text-generation", "data-processing"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Claude_AI_logo.svg/512px-Claude_AI_logo.svg.png"
  },
  {
    id: "tomeai_presentation",
    name: "Tome AI",
    description: "توليد عروض تقديمية تلقائية.",
    category: "Writing & Presentation AI",
    link: "https://tome.app/",
    useCases: ["presentation", "storytelling"],
    logo: "https://tome.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftome-icon-logo.36988894.png&w=64&q=75"
  },
  {
    id: "beautifulai",
    name: "Beautiful.ai",
    description: "توليد عروض تقديمية تلقائية.",
    category: "Writing & Presentation AI",
    link: "https://www.beautiful.ai/",
    useCases: ["presentation", "design-automation"],
    logo: "https://www.beautiful.ai/images/logo-dark.png"
  },
  {
    id: "gammaapp",
    name: "Gamma.app",
    description: "توليد عروض تقديمية تلقائية.",
    category: "Writing & Presentation AI",
    link: "https://gamma.app/",
    useCases: ["presentation", "document-creation"],
    logo: "https://gamma.app/static/logo.svg"
  },
  {
    id: "copyai",
    name: "Copy.ai",
    description: "كتابة محتوى تسويقي وتقني داعم للعرض.",
    category: "Writing & Presentation AI",
    link: "https://www.copy.ai/",
    useCases: ["marketing-copy", "technical-writing"],
    logo: "https://brandfetch.io/assets/copy.ai/logo.png"
  },
  {
    id: "jasperai",
    name: "Jasper.ai",
    description: "كتابة محتوى تسويقي وتقني داعم للعرض.",
    category: "Writing & Presentation AI",
    link: "https://www.jasper.ai/",
    useCases: ["marketing-copy", "content-generation"],
    logo: "https://www.jasper.ai/favicon.ico"
  },
  {
    id: "writesonic",
    name: "Writesonic",
    description: "كتابة محتوى تسويقي وتقني داعم للعرض.",
    category: "Writing & Presentation AI",
    link: "https://writesonic.com/",
    useCases: ["marketing-copy", "ai-writing"],
    logo: "https://writesonic.com/favicon.ico"
  },
  {
    id: "notionai",
    name: "Notion AI",
    description: "كتابة محتوى تسويقي وتقني داعم للعرض.",
    category: "Writing & Presentation AI",
    link: "https://www.notion.so/product/ai",
    useCases: ["note-taking", "content-summarization"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Notion_app_logo.png/512px-Notion_app_logo.png"
  },
  {
    id: "miroai_project",
    name: "Miro AI",
    description: "العصف الذهني وتصميم أفكار التصميم.",
    category: "Project & Trend Tools",
    link: "https://miro.com/whiteboard/",
    useCases: ["brainstorming", "ideation", "collaboration"],
    logo: "https://miro.com/favicon.ico"
  },
  {
    id: "trello_project",
    name: "Trello",
    description: "تنظيم المهام وتتبع تقدم المشاريع.",
    category: "Project & Trend Tools",
    link: "https://trello.com/",
    useCases: ["project-management", "task-tracking"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Trello_logo.png/562px-Trello_logo.png"
  },
  {
    id: "asanaai",
    name: "Asana (AI-powered)",
    description: "تنظيم المهام وتتبع تقدم المشاريع.",
    category: "Project & Trend Tools",
    link: "https://chromewebstore.google.com/detail/asana/khnpeclbnipcdacdkhejifenadikeghk",
    useCases: ["project-management", "task-automation"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Asana_logo_2020.svg/512px-Asana_logo.svg.png"
  },
  {
    id: "googlebard",
    name: "Google Bard",
    description: "تحليل بيانات السوق والاتجاهات التصميمية.",
    category: "Project & Trend Tools",
    link: "https://bard.google.com/",
    useCases: ["market-analysis", "trend-spotting"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Google_Bard_logo.svg/512px-Google_Bard_logo.svg.png"
  },
  {
    id: "midnightinsights",
    name: "Midnight Insights",
    description: "أدوات رؤية اتجاهات السوق من خلال تحليل بصري ذكي.",
    category: "Project & Trend Tools",
    link: "https://midnight.network/",
    useCases: ["market-insights", "visual-analysis"],
    logo: "https://midnight.network/brand-hub/midnight-logo.svg"
  },
  {
    id: "decormattersar_ar",
    name: "DecorMatters AR",
    description: "عرض التصميم داخل المساحة الحقيقية باستخدام AR.",
    category: "AR/Visualization Tools",
    link: "http://decormatters.app/",
    useCases: ["augmented-reality", "visualization"],
    logo: "https://www.company.decormatters.com/static/media/Logo%20Colored_10x.png"
  },
  {
    id: "ikeaplacear_ar",
    name: "IKEA Place AR",
    description: "معاينة الأثاث في الغرف الواقعية.",
    category: "AR/Visualization Tools",
    link: "https://www.ikea.com/us/en/customer-service/mobile-apps/ikea-place-pub035e07a0",
    useCases: ["augmented-reality", "furniture-preview"],
    logo: "https://www.ikea.com/favicon.ico"
  },
  {
    id: "houzzar",
    name: "Houzz AR",
    description: "تجربة التصاميم ثلاثية الأبعاد مباشرة.",
    category: "AR/Visualization Tools",
    link: "https://www.houzz.com/for-pros/software-ai-ar-tools",
    useCases: ["augmented-reality", "3d-experience"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Houzz_Logo.svg/512px-Houzz_Logo.svg.png"
  },
  {
    id: "adobeaero",
    name: "Adobe Aero",
    description: "إنشاء عروض تصميم داخلية بالواقع المعزز.",
    category: "AR/Visualization Tools",
    link: "https://www.adobe.com/learn/aero/web/create-ar-in-aero",
    useCases: ["augmented-reality", "interactive-presentations"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Adobe_Aero_2021_logo.png/512px-Adobe_Aero_2021_logo.png"
  }
];

// Component for displaying a single tool card
const ToolCard = ({ tool, isBookmarked, onToggleBookmark }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img src={tool.logo} alt={`${tool.name} Logo`} className="w-16 h-16 mb-4 rounded-full border-2 border-indigo-500 object-contain p-1 bg-white dark:bg-gray-700" />
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{tool.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow" dir="rtl" style={{ textAlign: 'right' }}>{tool.description}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {tool.useCases && tool.useCases.map(tag => (
          <span key={tag} className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <a
        href={tool.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 text-sm font-semibold"
      >
        الرابط الرسمي
      </a>
      <button
        onClick={() => onToggleBookmark(tool.id)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-200 ${
          isBookmarked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } shadow-md`}
      >
        {isBookmarked ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      </button>
    </div>
  );
};

// Tool Directory Module
const ToolDirectory = ({ tools, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, bookmarkedTools, toggleBookmark }) => {
  const filteredTools = tools.filter(tool => {
    const matchesSearch = searchTerm === '' || tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tool.useCases && tool.useCases.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">دليل أدوات الذكاء الاصطناعي للمصمم الداخلي</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="ابحث عن أداة..."
          className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
        />
        <select
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          dir="rtl"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTools.length > 0 ? (
          filteredTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isBookmarked={bookmarkedTools.includes(tool.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400 text-lg" dir="rtl">لا توجد أدوات مطابقة لمعايير البحث.</p>
        )}
      </div>
    </div>
  );
};

// Interactive Comparison Tool
const ComparisonTool = ({ tools }) => {
  const [compareTool1, setCompareTool1] = useState('');
  const [compareTool2, setCompareTool2] = useState('');

  const availableTools = tools.filter(tool => tool.id); // Ensure tools are loaded

  const tool1Details = availableTools.find(tool => tool.id === compareTool1);
  const tool2Details = availableTools.find(tool => tool.id === compareTool2);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">أداة المقارنة التفاعلية</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">اختر أداتين للمقارنة جنبًا إلى جنب:</p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
          <select
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right flex-grow text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
            value={compareTool1}
            onChange={(e) => setCompareTool1(e.target.value)}
            dir="rtl"
          >
            <option value="">اختر الأداة 1</option>
            {availableTools.map(tool => (
              <option key={tool.id} value={tool.id}>{tool.name}</option>
            ))}
          </select>

          <select
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right flex-grow text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
            value={compareTool2}
            onChange={(e) => setCompareTool2(e.target.value)}
            dir="rtl"
          >
            <option value="">اختر الأداة 2</option>
            {availableTools.map(tool => (
              <option key={tool.id} value={tool.id}>{tool.name}</option>
            ))}
          </select>
        </div>

        {(tool1Details || tool2Details) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {tool1Details ? (
              <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-xl shadow-inner flex flex-col items-center text-center border-2 border-indigo-200 dark:border-indigo-700">
                <img src={tool1Details.logo} alt={`${tool1Details.name} Logo`} className="w-24 h-24 mb-4 rounded-full border-2 border-indigo-500 object-contain p-2 bg-white dark:bg-gray-700" />
                <h4 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">{tool1Details.name}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-4" dir="rtl" style={{ textAlign: 'right' }}>{tool1Details.description}</p>
                <a href={tool1Details.link} target="_blank" rel="noopener noreferrer" className="text-indigo-700 dark:text-indigo-400 hover:underline text-sm font-semibold">الرابط الرسمي</a>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {tool1Details.useCases && tool1Details.useCases.map(tag => (
                    <span key={tag} className="bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 text-xs font-medium px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-inner flex items-center justify-center h-full min-h-[250px] border-2 border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400 text-lg">اختر الأداة 1 للمقارنة</p>
              </div>
            )}

            {tool2Details ? (
              <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-xl shadow-inner flex flex-col items-center text-center border-2 border-indigo-200 dark:border-indigo-700">
                <img src={tool2Details.logo} alt={`${tool2Details.name} Logo`} className="w-24 h-24 mb-4 rounded-full border-2 border-indigo-500 object-contain p-2 bg-white dark:bg-gray-700" />
                <h4 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">{tool2Details.name}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-4" dir="rtl" style={{ textAlign: 'right' }}>{tool2Details.description}</p>
                <a href={tool2Details.link} target="_blank" rel="noopener noreferrer" className="text-indigo-700 dark:text-indigo-400 hover:underline text-sm font-semibold">الرابط الرسمي</a>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {tool2Details.useCases && tool2Details.useCases.map(tag => (
                    <span key={tag} className="bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 text-xs font-medium px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-inner flex items-center justify-center h-full min-h-[250px] border-2 border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400 text-lg">اختر الأداة 2 للمقارنة</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Learning Hub Module (Conceptual)
const LearningHub = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">مركز التعلم</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
          هنا ستجد دروسًا تعليمية ومشاريع نموذجية وسيناريوهات استخدام لكل أداة.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
          (سيتم دمج مقاطع الفيديو من YouTube/Vimeo وقارئات ملفات PDF لتوفير محتوى غني وتفاعلي في الإصدارات المستقبلية.)
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 shadow-inner">
            <h4 className="font-bold text-2xl text-indigo-800 dark:text-indigo-300 mb-3">دروس الفيديو</h4>
            <p className="text-gray-700 dark:text-gray-300 text-base">شاهد دروسًا متعمقة حول كيفية استخدام الأدوات بفعالية لتحقيق أقصى استفادة من قدراتها.</p>
            <div className="mt-5 w-full h-40 bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-200 rounded-lg text-lg font-semibold">
              [مشغل فيديو وهمي]
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 shadow-inner">
            <h4 className="font-bold text-2xl text-indigo-800 dark:text-indigo-300 mb-3">المشاريع النموذجية</h4>
            <p className="text-gray-700 dark:text-gray-300 text-base">استكشف مشاريع تصميم داخلي واقعية تم إنشاؤها بالكامل باستخدام أدوات الذكاء الاصطناعي.</p>
            <div className="mt-5 w-full h-40 bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-200 rounded-lg text-lg font-semibold">
              [معاينة مشروع وهمي]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AR + Demo Section (Conceptual)
const ARDemoSection = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">الواقع المعزز والعروض التوضيحية</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
          استكشف الأدوات التي تدعم الواقع المعزز وشاهد كيف يمكنها تحويل مساحاتك في الوقت الفعلي قبل التنفيذ.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
          (سيتم توفير عروض توضيحية تفاعلية ونماذج ثلاثية الأبعاد للأدوات ذات الصلة قريبًا.)
        </p>
        <div className="mt-6 w-full h-64 bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-200 rounded-lg text-xl font-semibold shadow-inner">
          [عرض توضيحي للواقع المعزز / نموذج ثلاثي الأبعاد]
        </div>
      </div>
    </div>
  );
};

// User Profile & Bookmarks
const UserProfile = ({ userId, isAuthReady, tools, bookmarkedTools, toggleBookmark }) => {
  if (!isAuthReady) {
    return (
      <div className="container mx-auto p-6 text-center" dir="rtl">
        <p className="text-gray-600 dark:text-gray-400 text-lg">جاري تحميل ملف تعريف المستخدم...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">ملفي الشخصي</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
          **معرف المستخدم:** <span className="font-semibold text-indigo-600 dark:text-indigo-400 break-all">{userId || "غير متاح"}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-base mb-8">
          هنا يمكنك إدارة أدواتك المفضلة ومجموعات الأدوات الشخصية لتبسيط سير عملك.
        </p>

        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center" dir="rtl">الأدوات المفضلة</h3>
        {bookmarkedTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedTools.map(toolId => {
              const tool = tools.find(t => t.id === toolId);
              return tool ? (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isBookmarked={true}
                  onToggleBookmark={toggleBookmark}
                />
              ) : null;
            })}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-lg text-center" dir="rtl">لم تقم بإضافة أي أدوات إلى المفضلة بعد. ابدأ استكشاف الدليل الآن!</p>
        )}

        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-10 mb-6 text-center" dir="rtl">مجموعات الأدوات الشخصية</h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg text-center" dir="rtl">
          (ستسمح لك هذه الميزة بإنشاء مجموعات أدوات مخصصة لمراحل تصميم محددة، مما يسهل الوصول إلى الأدوات المناسبة في الوقت المناسب.)
        </p>
        <div className="mt-6 bg-indigo-50 dark:bg-indigo-900 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-center text-indigo-700 dark:text-indigo-200 text-lg font-medium">
          <p dir="rtl">مثال: مجموعة أدوات لمرحلة "التصميم المفاهيمي" أو "التقديم للعميل".</p>
        </div>
      </div>
    </div>
  );
};

// Admin Panel (Conceptual)
const AdminPanel = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">لوحة الإدارة</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
          تتيح هذه اللوحة للمسؤولين إدارة قوائم الأدوات وتحديثات المحتوى والإشراف على الملاحظات لضمان جودة المنصة.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
          (تتطلب هذه الوحدة نظام مصادقة وتفويض أكثر تعقيدًا لضمان الأمان والتحكم في الوصول.)
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-200 text-lg font-semibold">
            إدارة الأدوات
          </button>
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-200 text-lg font-semibold">
            إدارة المحتوى
          </button>
        </div>
      </div>
    </div>
  );
};

// Design Concept Generator Component
const DesignConceptGenerator = ({ designConceptInput, setDesignConceptInput, generatedDesignConcept, setGeneratedDesignConcept, isLoadingLLM, setIsLoadingLLM }) => {
  const generateConcept = async () => {
    setIsLoadingLLM(true);
    setGeneratedDesignConcept('');
    try {
      const prompt = `أنا مصمم داخلي وأحتاج إلى مفهوم تصميم داخلي مفصل للمساحة التالية: "${designConceptInput}". يرجى تزويدي بوصف شامل يتضمن:
- النمط العام (مثل: عصري، بوهيمي، صناعي).
- لوحة الألوان المقترحة (مع أمثلة للألوان).
- أنواع الأثاث والمواد الرئيسية.
- عناصر الإضاءة.
- اللمسات النهائية والديكور.
- الجو العام الذي تهدف إليه.
يرجى الكتابة باللغة العربية الفصحى وبأسلوب احترافي ومفصل.`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will automatically provide it in runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setGeneratedDesignConcept(result.candidates[0].content.parts[0].text);
      } else {
        setGeneratedDesignConcept("عذرًا، لم أتمكن من إنشاء مفهوم التصميم. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error generating design concept:", error);
      setGeneratedDesignConcept("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setIsLoadingLLM(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">✨ مولد أفكار التصميم</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">أدخل وصفًا موجزًا للمساحة التي ترغب في تصميمها (مثال: "غرفة معيشة صغيرة بأسلوب بوهيمي مريح").</p>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right h-36 mb-6 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
          placeholder="مثال: غرفة نوم رئيسية فاخرة بألوان هادئة وإضاءة دافئة."
          value={designConceptInput}
          onChange={(e) => setDesignConceptInput(e.target.value)}
          dir="rtl"
        ></textarea>
        <button
          onClick={generateConcept}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 text-lg font-semibold"
          disabled={isLoadingLLM || !designConceptInput.trim()}
        >
          {isLoadingLLM ? 'جاري التوليد...' : 'توليد مفهوم التصميم'}
        </button>

        {generatedDesignConcept && (
          <div className="mt-10 p-6 bg-indigo-50 dark:bg-indigo-900 rounded-xl border border-indigo-200 dark:border-indigo-700 text-right shadow-inner">
            <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4">مفهوم التصميم المقترح:</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed" dir="rtl" style={{ textAlign: 'right' }}>{generatedDesignConcept}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Prompt Crafting Assistant Component
const PromptCraftingAssistant = ({ promptAssistantInput, setPromptAssistantInput, selectedImageAITool, setSelectedImageAITool, generatedPrompt, setGeneratedPrompt, isLoadingLLM, setIsLoadingLLM }) => {
  const imageAITools = ["Midjourney", "DALL·E 3", "Stable Diffusion"]; // Example tools for prompt generation

  const generatePrompt = async () => {
    setIsLoadingLLM(true);
    setGeneratedPrompt('');
    try {
      const prompt = `أنا أرغب في إنشاء صورة تصميم داخلي باستخدام ${selectedImageAITool}. فكرتي الأساسية هي: "${promptAssistantInput}".
      يرجى توسيع هذه الفكرة إلى أمر (prompt) مفصل ومُحسّن لـ ${selectedImageAITool}، مع تضمين تفاصيل حول:
      - النمط الفني أو الواقعي.
      - لوحة الألوان.
      - عناصر الإضاءة.
      - زاوية الكاميرا وتكوين المشهد.
      - التفاصيل الدقيقة التي ستجعل الصورة فريدة وجذابة.
      يرجى صياغة الأمر باللغة الإنجليزية ليكون مناسبًا لأداة توليد الصور.`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will automatically provide it in runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setGeneratedPrompt(result.candidates[0].content.parts[0].text);
      } else {
        setGeneratedPrompt("عذرًا، لم أتمكن من صياغة الأمر. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      setGeneratedPrompt("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setIsLoadingLLM(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">✨ مساعد صياغة الأوامر</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">أدخل فكرتك الأساسية لتصميم الصورة، واختر أداة الذكاء الاصطناعي المستهدفة.</p>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right h-28 mb-6 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
          placeholder="مثال: صورة لغرفة معيشة مريحة مع مدفأة."
          value={promptAssistantInput}
          onChange={(e) => setPromptAssistantInput(e.target.value)}
          dir="rtl"
        ></textarea>
        <select
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right w-full md:w-auto mb-6 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
          value={selectedImageAITool}
          onChange={(e) => setSelectedImageAITool(e.target.value)}
          dir="rtl"
        >
          {imageAITools.map(tool => (
            <option key={tool} value={tool}>{tool}</option>
          ))}
        </select>
        <button
          onClick={generatePrompt}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 text-lg font-semibold"
          disabled={isLoadingLLM || !promptAssistantInput.trim()}
        >
          {isLoadingLLM ? 'جاري الصياغة...' : 'صياغة الأمر'}
        </button>

        {generatedPrompt && (
          <div className="mt-10 p-6 bg-indigo-50 dark:bg-indigo-900 rounded-xl border border-indigo-200 dark:border-indigo-700 text-left shadow-inner" dir="ltr">
            <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4 text-right" dir="rtl">الأمر المقترح:</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{generatedPrompt}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// AI Image Generator Component
const AIImageGenerator = ({ imageGeneratorPrompt, setImageGeneratorPrompt, generatedImageUrl, setGeneratedImageUrl, isGeneratingImage, setIsGeneratingImage, showModal }) => {
  const generateImage = async () => {
    setIsGeneratingImage(true);
    setGeneratedImageUrl('');
    try {
      const payload = { instances: { prompt: imageGeneratorPrompt }, parameters: { "sampleCount": 1} };
      const apiKey = ""; // Canvas will automatically provide it in runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setGeneratedImageUrl(imageUrl);
      } else {
        setGeneratedImageUrl('');
        showModal("خطأ في التوليد", "عذرًا، لم أتمكن من توليد الصورة. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setGeneratedImageUrl('');
      showModal("خطأ", "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي لتوليد الصورة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-10 text-center" dir="rtl">✨ مولد الصور بالذكاء الاصطناعي</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" dir="rtl">
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">أدخل وصفًا تفصيليًا للصورة التي ترغب في توليدها (باللغة الإنجليزية للحصول على أفضل النتائج).</p>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-left h-28 mb-6 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
          placeholder="مثال: A modern minimalist living room with warm lighting and a large window overlooking a city skyline."
          value={imageGeneratorPrompt}
          onChange={(e) => setImageGeneratorPrompt(e.target.value)}
          dir="ltr" // Keep LTR for English prompt
        ></textarea>
        <button
          onClick={generateImage}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 text-lg font-semibold"
          disabled={isGeneratingImage || !imageGeneratorPrompt.trim()}
        >
          {isGeneratingImage ? 'جاري التوليد...' : 'توليد الصورة'}
        </button>

        {isGeneratingImage && (
          <div className="mt-10 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">جاري توليد الصورة، قد يستغرق الأمر بضع لحظات...</p>
          </div>
        )}

        {generatedImageUrl && !isGeneratingImage && (
          <div className="mt-10 p-6 bg-indigo-50 dark:bg-indigo-900 rounded-xl border border-indigo-200 dark:border-indigo-700">
            <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4 text-right" dir="rtl">الصورة المولدة:</h3>
            <img src={generatedImageUrl} alt="Generated Interior Design" className="max-w-full h-auto rounded-xl shadow-lg mx-auto border border-gray-300 dark:border-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
};


const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // State for simple routing
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedTools, setBookmarkedTools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isLoadingLLM, setIsLoadingLLM] = useState(false); // New state for LLM loading

  // State for Design Concept Generator
  const [designConceptInput, setDesignConceptInput] = useState('');
  const [generatedDesignConcept, setGeneratedDesignConcept] = useState('');

  // State for Prompt Crafting Assistant
  const [promptAssistantInput, setPromptAssistantInput] = useState('');
  const [selectedImageAITool, setSelectedImageAITool] = useState('Midjourney'); // Default image AI tool
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // State for AI Image Generator
  const [imageGeneratorPrompt, setImageGeneratorPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or default to 'light'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const { userId, isAuthReady } = useContext(AuthContext);

  // Effect to apply theme class to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const categories = [
    'All',
    'Generalist Generative AI',
    'Interior-Specific AI',
    '3D & Spatial AI',
    'Rendering Enhancers',
    'Lighting & Color AI',
    'Writing & Presentation AI',
    'Project & Trend Tools',
    'AR/Visualization Tools'
  ];

  // Fetch tools from Firestore and user bookmarks
  useEffect(() => {
    if (!db || !isAuthReady) return;

    // Fetch tools (public data)
    const toolsCollectionRef = collection(db, `artifacts/${appId}/public/data/tools`);
    const unsubscribeTools = onSnapshot(toolsCollectionRef, (snapshot) => {
      const fetchedTools = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Merge initial tools with fetched tools, prioritizing fetched tools if IDs overlap
      const mergedToolsMap = new Map();
      initialTools.forEach(tool => mergedToolsMap.set(tool.id, tool));
      fetchedTools.forEach(tool => mergedToolsMap.set(tool.id, tool));
      setTools(Array.from(mergedToolsMap.values()));
    }, (error) => {
      console.error("Error fetching tools:", error);
      showModal("خطأ", "فشل تحميل الأدوات.");
    });

    // Fetch user bookmarks (private data)
    let unsubscribeBookmarks;
    if (userId) {
      const userBookmarksRef = collection(db, `artifacts/${appId}/users/${userId}/bookmarks`);
      unsubscribeBookmarks = onSnapshot(userBookmarksRef, (snapshot) => {
        const bookmarks = snapshot.docs.map(doc => doc.id);
        setBookmarkedTools(bookmarks);
      }, (error) => {
        console.error("Error fetching bookmarks:", error);
        showModal("خطأ", "فشل تحميل الإشارات المرجعية.");
      });
    }

    return () => {
      unsubscribeTools();
      if (unsubscribeBookmarks) {
        unsubscribeBookmarks();
      }
    };
  }, [db, userId, isAuthReady]);

  // Function to add/remove a tool from bookmarks
  const toggleBookmark = async (toolId) => {
    if (!userId) {
      showModal("تسجيل الدخول مطلوب", "يرجى تسجيل الدخول لحفظ الأدوات المفضلة.");
      return;
    }

    const bookmarkRef = doc(db, `artifacts/${appId}/users/${userId}/bookmarks`, toolId);
    try {
      if (bookmarkedTools.includes(toolId)) {
        await deleteDoc(bookmarkRef);
        showModal("تمت الإزالة", "تمت إزالة الأداة من الإشارات المرجعية.");
      } else {
        await setDoc(bookmarkRef, { timestamp: new Date() });
        showModal("تمت الإضافة", "تمت إضافة الأداة إلى الإشارات المرجعية.");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      showModal("خطأ", "فشل تحديث الإشارة المرجعية.");
    }
  };

  const showModal = (title, message, showConfirm = false, onConfirm = () => {}) => {
    setModalContent({ title, message, showConfirm, onConfirm });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({});
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tool.useCases && tool.useCases.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  return (
    <div className={`min-h-screen font-sans text-right ${theme === 'dark' ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`} dir="rtl">
      <nav className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-b-xl">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4 md:mb-0">المصمم الذكي</h1>
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            <button onClick={() => setCurrentPage('home')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'home' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              الرئيسية
            </button>
            <button onClick={() => setCurrentPage('design-concept-generator')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'design-concept-generator' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              ✨ مولد أفكار التصميم
            </button>
            <button onClick={() => setCurrentPage('prompt-crafting-assistant')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'prompt-crafting-assistant' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              ✨ مساعد صياغة الأوامر
            </button>
            <button onClick={() => setCurrentPage('ai-image-generator')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'ai-image-generator' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              ✨ مولد الصور بالذكاء الاصطناعي
            </button>
            <button onClick={() => setCurrentPage('compare')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'compare' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              مقارنة الأدوات
            </button>
            <button onClick={() => setCurrentPage('learn')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'learn' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              مركز التعلم
            </button>
            <button onClick={() => setCurrentPage('ar-demo')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'ar-demo' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              الواقع المعزز والعروض
            </button>
            <button onClick={() => setCurrentPage('profile')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'profile' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              ملفي الشخصي
            </button>
            <button onClick={() => setCurrentPage('admin')} className={`px-5 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${currentPage === 'admin' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 shadow-md' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
              لوحة الإدارة
            </button>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {currentPage === 'home' && <ToolDirectory
          tools={filteredTools}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          bookmarkedTools={bookmarkedTools}
          toggleBookmark={toggleBookmark}
        />}
        {currentPage === 'design-concept-generator' && <DesignConceptGenerator
          designConceptInput={designConceptInput}
          setDesignConceptInput={setDesignConceptInput}
          generatedDesignConcept={generatedDesignConcept}
          setGeneratedDesignConcept={setGeneratedDesignConcept}
          isLoadingLLM={isLoadingLLM}
          setIsLoadingLLM={setIsLoadingLLM}
        />}
        {currentPage === 'prompt-crafting-assistant' && <PromptCraftingAssistant
          promptAssistantInput={promptAssistantInput}
          setPromptAssistantInput={setPromptAssistantInput}
          selectedImageAITool={selectedImageAITool}
          setSelectedImageAITool={setSelectedImageAITool}
          generatedPrompt={generatedPrompt}
          setGeneratedPrompt={setGeneratedPrompt}
          isLoadingLLM={isLoadingLLM}
          setIsLoadingLLM={setIsLoadingLLM}
        />}
        {currentPage === 'ai-image-generator' && <AIImageGenerator
          imageGeneratorPrompt={imageGeneratorPrompt}
          setImageGeneratorPrompt={setImageGeneratorPrompt}
          generatedImageUrl={generatedImageUrl}
          setGeneratedImageUrl={setGeneratedImageUrl}
          isGeneratingImage={isGeneratingImage}
          setIsGeneratingImage={setIsGeneratingImage}
          showModal={showModal}
        />}
        {currentPage === 'compare' && <ComparisonTool tools={tools} />}
        {currentPage === 'learn' && <LearningHub />}
        {currentPage === 'ar-demo' && <ARDemoSection />}
        {currentPage === 'profile' && <UserProfile
          userId={userId}
          isAuthReady={isAuthReady}
          tools={tools}
          bookmarkedTools={bookmarkedTools}
          toggleBookmark={toggleBookmark}
        />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        message={modalContent.message}
        showConfirmButton={modalContent.showConfirm}
        onConfirm={modalContent.onConfirm}
      />
    </div>
  );
};

// Wrap the App with AuthProvider
const WrappedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default WrappedApp;


