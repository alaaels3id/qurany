# قرآني - Quran Desktop

تطبيق Desktop حديث وفاخر للاستماع للقرآن الكريم ومحطات البث الإذاعي الإسلامي مبني باستخدام **Electron.js** و **React** و **TypeScript** ومصدر البيانات **MP3Quran API v3**.

---

## 🌟 المميزات الرئيسية

- **تصفح كامل للقرآن الكريم**: 114 سورة بالترتيب والتفاصيل (مكية / مدنية، عدد الآيات، رقم الصفحة).
- **أكثر من 200 قارئ**: مئات المصاحف والروايات (حفص، ورش، قالون، الدوري، المصحف المجود، وغيرها).
- **مشغل صوتي احترافي (Audio Player)**:
  - تشغيل / إيقاف مؤقت / تقديم / ترجيع / انتقال للسورة التالية والسابقة.
  - التحكم في السرعة (0.5x وحتى 2.0x).
  - أوضاع التكرار (إيقاف / تكرار السورة / تكرار القائمة).
  - التشغيل التلقائي للسورة التالية (Auto Next).
  - قائمة انتظار التلاوات (Queue Drawer).
- **بث مباشر للإذاعات الإسلامية (Live Radios)**: استماع متواصل لإذاعات القرآن والتفاسير.
- **متابعة الاستماع (Continue Listening)**: استعادة آخر موضع تم تشغيله بدقة عند فتح التطبيق.
- **المفضلة (Favorites)**: حفظ السور والقراء والإذاعات المفضلة والوصول السريع إليها.
- **تكامل أصيل مع سطح المكتب (Native Desktop Integrations)**:
  - **شريط المهام (System Tray)** مع قائمة تحكم سريعة وعرض اسم السورة الحالية.
  - **اختصارات لوحة المفاتيح العامة (Global Shortcuts)** مثل `MediaPlayPause` و `Alt+Space`.
  - **إشعارات النظام (Native Notifications)** عند تغيير السورة.
- **تصميم عصري وفخم**:
  - دعم كامل للغة العربية والـ RTL مع خطوط عربية أصيلة (`Amiri`, `Cairo`, `Tajawal`).
  - دعم النمط الداكن والفاتح وتفضيلات النظام (Dark / Light / System).
  - تأثيرات زجاجية (Glassmorphism) وأمواج صوتية حية.

---

## 🏗️ هيكلية المشروع (Architecture)

```text
src/
├── main/                 # عملية Electron الرئيسية (Main Process)
│   ├── main.ts           # دورة حياة التطبيق والنوافذ والأمان
│   ├── tray.ts           # شريط المهام System Tray وقوائم التحكم
│   ├── shortcuts.ts      # الاختصارات العامة Global Media Shortcuts
│   ├── notifications.ts  # إشعارات النظام Native Notifications
│   └── ipc.ts            # معالجات قنوات IPC الآمنة
├── preload/              # Preload Script وعزل البيئات (Security Boundary)
│   └── preload.ts        # عرض window.electronAPI الآمن
├── shared/               # الأنواع والثوابت المشتركة
│   ├── types/            # تعريفات النطاق (Surah, Reciter, Moshaf, Radio...)
│   └── constants/        # بيانات سور القرآن الـ 114 الكاملة
└── renderer/             # واجهة المستخدم (React + Tailwind)
    ├── components/       # المكونات القابلة لإعادة الاستخدام (AudioPlayer, Sidebar, Cards...)
    ├── pages/            # الشاشات الرئيسية (Home, Surahs, Reciters, Radio, Favorites, Settings)
    ├── services/         # عميل MP3Quran API v3 وباني الروابط AudioUrlBuilder
    └── store/            # إدارة الحالة بواسطة Zustand (Player, Favorites, History, Settings)
```

---

## 🚀 التثبيت والتشغيل المحلي (Setup & Development)

### المتطلبات
- Node.js إصدار 18 أو أحدث
- npm أو yarn أو pnpm

### خطوات التثبيت

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل بيئة التطوير
npm run dev

# 3. التحقق من صحة الأنواع (TypeScript Check)
npm run typecheck

# 4. تشغيل الاختبارات (Vitest)
npm test

# أو في وضع المراقبة التفاعلي
npm run test:watch

# 5. بناء نسخة الإنتاج
npm run build
```

---

## 🧪 الاختبارات (Testing)

يستخدم المشروع **Vitest** لتنفيذ اختبارات الوحدة والتكامل للمنطق البرمجي والحالة (State):

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات في وضع المراقبة (Watch Mode)
npm run test:watch
```

### الوظائف التي يتم اختبارها:
- **البحث والتصفية (Search)**: دقة البحث في السور والقراء ومحطات الإذاعة.
- **مشغل الصوت وقائمة الانتظار (Player & Queue)**: أوضاع التكرار، التنقل، والتشغيل التلقائي.
- **التخزين المؤقت وروابط التلاوات (API Cache & Audio URLs)**: إدارة الكاش والنسخ الاحتياطي المحلي وبناء الروابط.
- **المفضلة وسجل الاستماع (Favorites & History)**: إضافة واسترجاع ومزامنة السجلات.
- **الإعدادات واللغات (Settings & i18n)**: ضبط الثيمات، وحجم الخطوط، واللغة وحفظ التفضيلات.

---

## ⌨️ اختصارات لوحة المفاتيح (Global Shortcuts)

| الوظيفة | الاختصار |
| :--- | :--- |
| **تشغيل / إيقاف مؤقت** | `MediaPlayPause` أو `Alt + Space` |
| **السورة التالية** | `MediaTrackNext` |
| **السورة السابقة** | `MediaTrackPrevious` |

---

## 🔒 الأمان والمطابقة (Security & Best Practices)

- `contextIsolation: true` و `nodeIntegration: false`.
- عزل بناء روابط الملفات الصوتية داخل `AudioUrlBuilder`.
- استدعاء عمليات النظام عبر `electronAPI` المحددة بدقة.
- كاش محلي بمدة صلاحية (TTL) لتقليل استهلاك الشبكة وسرعة فتح التطبيق.
