# راهنمای فعال‌سازی PWA (Progressive Web App)

برای تبدیل این پروژه به یک PWA کامل که بتواند به صورت کاملاً آفلاین کار کند، مراحل زیر را دنبال کنید:

## فایل‌های مورد نیاز

### 1. manifest.json
```json
{
  "name": "استودیو ریلز و کارت استارتیچ",
  "short_name": "Starteach Studio",
  "description": "ابزار حرفه‌ای طراحی محتوای بصری",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#10b981",
  "orientation": "any",
  "icons": [
    {
      "src": "./icon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "lang": "fa",
  "dir": "rtl"
}
```

### 2. service-worker.js
```javascript
const CACHE_NAME = 'starteach-studio-v1';
const ASSETS = [
  './',
  './index.html',
  './tailwind.min.js',
  './html2canvas.min.js',
  './gifshot.min.js',
  './fonts.css',
  './icon.png',
  './Vazirmatn-Regular.woff2',
  './Shabnam-Regular.woff2',
  './Lalezar-Regular.ttf'
];

// نصب Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// فعال‌سازی
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// دریافت درخواست‌ها
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
```

### 3. اضافه کردن به index.html

در بخش `<head>` فایل index.html اضافه کنید:
```html
<link rel="manifest" href="./manifest.json">
<meta name="theme-color" content="#10b981">
<link rel="apple-touch-icon" href="./icon.png">
```

قبل از بسته شدن `</body>` اضافه کنید:
```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW error:', err));
    });
  }
</script>
```

## مزایا

- ✅ کار کامل بدون اینترنت
- ✅ کش کردن تمام فایل‌ها
- ✅ نصب به عنوان اپلیکیشن روی موبایل
- ✅ لود سریع‌تر
- ✅ تجربه کاربری بهتر

## تست PWA

1. سایت را روی HTTPS یا localhost اجرا کنید
2. در Chrome DevTools به Application > Service Workers بروید
3. بررسی کنید که Service Worker ثبت شده باشد
4. حالت آفلاین را فعال کرده و تست کنید
