## লক্ষ্য
আপলোড করা **LTDEZ লোগো** (Latent Talents Discovering & Employing Zone — "Learn Through Mistakes") দিয়ে পুরো ওয়েবসাইটের ব্র্যান্ডিং Noor Handicraft Academy থেকে **LTDEZ**-এ পরিবর্তন করা।

লোগো ইতিমধ্যে `src/assets/ltdez-logo.png`-এ কপি করা হয়েছে।

## পরিবর্তন

### 1. Logo replacement
সব জায়গায় `noor-logo.png` → `ltdez-logo.png`:
- `src/components/promo/PromoHeader.tsx`
- `src/components/promo/PromoFooter.tsx`
- `src/components/noor/NoorHeader.tsx`
- `src/components/noor/NoorFooter.tsx`
- `src/components/dashboard/UserDashboardLayout.tsx` (যদি থাকে)
- `src/components/admin/AdminSidebar.tsx` (যদি থাকে)
- `src/pages/Auth.tsx` (যদি লোগো থাকে)

### 2. Brand name & copy update
"Noor Handicraft Academy" / "Noor" → "LTDEZ" / "Learn Through Mistakes":
- **Header**: brand text → `LTDEZ` / `Learn Through Mistakes`
- **Footer**: brand block, email (`support@ltdez.com`), copyright → `© 2026 LTDEZ`
- **Pricing card title**: `Noor Handicraft — Full Program` → `LTDEZ — Full Program`
- **Order form WhatsApp message**: program name → `LTDEZ Full Program`
- **Hero image alt**: `LTDEZ Course Promo`
- **Tagline**: "Latent Talents Discovering & Employing Zone — আপনার ভেতরের প্রতিভা আবিষ্কার করুন, ভুল থেকে শিখুন।"

### 3. Page title / favicon
- `index.html` `<title>` → `LTDEZ — Learn Through Mistakes`
- `public/` favicon: লোগো ব্যবহার করে favicon update (favicon link in `index.html` → `/ltdez-logo.png` কপি `public/`-এ)

### 4. যা touch হবে না
- Course content / handicraft-specific copy (Hero headline, Problem cards) এখনো বাংলা handicraft messaging — যদি আপনি চান এটাও generic skill-based language-এ যাক, পরে বলুন
- Database, auth flow, admin panel logic অপরিবর্তিত
- Color theme (orange/amber) — LTDEZ লোগোর সাথে মিলে যায়, তাই unchanged

### 5. Memory update
`mem://index.md` Core-এ ব্র্যান্ড লাইন update: `Brand: LTDEZ (Learn Through Mistakes). Logo at src/assets/ltdez-logo.png.`

## প্রশ্ন
Hero/Problem/Features-এর বাংলা handicraft copy ("হাতের কাজ শিখে আয়", "craft technique" ইত্যাদি) কি LTDEZ-এর জন্য generic skill/learning copy-তে rewrite করব, নাকি handicraft theme-ই রাখব? Approve করলে শুধু branding (লোগো + নাম) বদলাব, copy পরের message-এ আলাদা করে কাজ করব।
